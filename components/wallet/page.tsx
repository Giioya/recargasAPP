"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export function useWalletAuth() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);

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

        // Extraer dirección de wallet
        const wallet = finalPayload.address ?? "Dirección no disponible";
        setWalletAddress(wallet);

        // Obtener saldo en WLD
        await fetchBalance(wallet);
        } catch (error) {
        console.error("Error en la autenticación:", error);
        alert("Hubo un problema con la autenticación.");
        }
    };

    const fetchBalance = async (wallet: string) => {
        try {
        const response = await fetch(`https://blockchain-api-url.com/balance?wallet=${wallet}`);
        const data = await response.json();
        
        // Buscar el saldo en WLD dentro de la respuesta
        const wldBalance = data.tokens.find((token: any) => token.symbol === "WLD")?.balance ?? 0;
        
        setBalance(wldBalance);
        } catch (error) {
        console.error("Error al obtener saldo:", error);
        setBalance(null);
        }
    };

    return { walletAddress, balance, signInWithWallet };
}

