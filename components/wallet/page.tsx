"use client";

import { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function WalletAuth() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [wldBalance, setWldBalance] = useState<number | null>(null);

    useEffect(() => {
        signInWithWallet();
    }, []); // Se ejecuta una vez al montar el componente

    const signInWithWallet = async () => {
        if (!MiniKit.isInstalled()) {
        alert("MiniKit no está instalado.");
        return;
        }

        try {
        const res = await fetch(`/api/nonce`);
        const { nonce } = await res.json();

        const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
            nonce,
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
        console.log("Verificación de datos:", verifyData); // Para ver qué propiedades tiene

        if (verifyData.status === "success" && verifyData.isValid) {
            setWalletAddress(MiniKit.walletAddress ?? "Dirección no disponible");
            setUsername(verifyData.user?.username ?? "Usuario desconocido");

            // Obtener saldo en WLD
            const balanceRes = await fetch(`/api/get-balance?address=${MiniKit.walletAddress}`);
            const balanceData = await balanceRes.json();
            setWldBalance(balanceData.balance ?? 0);
        }
        } catch (error) {
        console.error("Error en la autenticación:", error);
        alert("Hubo un problema con la autenticación.");
        }
    };

    return (
        <div className="flex flex-col items-center">
        <button 
            onClick={signInWithWallet} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
            Iniciar sesión con Ethereum
        </button>

        {walletAddress && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-center">
            <p><strong>Dirección de Wallet:</strong> {walletAddress}</p>
            <p><strong>Usuario:</strong> {username}</p>
            <p><strong>Saldo en WLD:</strong> {wldBalance !== null ? `${wldBalance} WLD` : "Cargando..."}</p>
            </div>
        )}
        </div>
    );
}

