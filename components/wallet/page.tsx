"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export function useWalletAuth() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const signInWithWallet = async () => {
        if (!MiniKit.isInstalled()) {
        alert("MiniKit no está instalado.");
        return;
        }

        try {
        const res = await fetch(`/api/nonce`);
        const { nonce } = await res.json();

        const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
            nonce: nonce,
            requestId: "0",
            expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            statement: "This is my statement and here is a link https://worldcoin.com/apps",
        });

        if (finalPayload.status === "error") {
            alert("Error en la autenticación.");
            return;
        }

        const verifyRes = await fetch("/api/complete-siwe", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            payload: finalPayload,
            nonce,
            }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.status === "success" && verifyData.isValid) {
            setWalletAddress(MiniKit.walletAddress ?? "Dirección no disponible");
            setUsername(MiniKit.user?.username ?? "Usuario desconocido");
        }
        } catch (error) {
        console.error("Error en la autenticación:", error);
        alert("Hubo un problema con la autenticación.");
        }
    };

    return { walletAddress, username, signInWithWallet };
}
