"use client";

import Image from "next/image";
import "./globals.css";
import { useState } from "react";
import { SignIn } from "@/components/SignIn";
import { MiniKit } from "@worldcoin/minikit-js";

const operadores = [
  { nombre: "Movistar", img: "/movistar.jpg" },
  { nombre: "Claro", img: "/claro.webp" },
  { nombre: "Tigo", img: "/tigo.png" },
  { nombre: "ETB", img: "/etb.png" },
  { nombre: "Virgin", img: "/virgin.png" },
  { nombre: "Exito", img: "/exito.png" },
];

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

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
        setProfilePic(MiniKit.user?.profilePictureUrl ?? null);
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      alert("Hubo un problema con la autenticación.");
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Elige operador</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {operadores.map((operador) => (
          <button key={operador.nombre} className="card p-4 border rounded-lg shadow-md hover:bg-gray-100">
            <Image src={operador.img} alt={operador.nombre} width={50} height={50} className="image mb-2" />
            {operador.nombre}
          </button>
        ))}
      </div>

      <div className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition inline-block">
        <button onClick={signInWithWallet}>Iniciar sesión con Ethereum</button>
      </div>

      {walletAddress && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-center">
          <p><strong>Dirección de Wallet:</strong> {walletAddress}</p>
          <p><strong>Usuario:</strong> {username}</p>
          {profilePic && <Image src={profilePic} alt="Profile Picture" width={50} height={50} className="rounded-full mt-2" />}
        </div>
      )}
    </div>
  );
}









