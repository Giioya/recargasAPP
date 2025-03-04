"use client";

import Image from "next/image";
import "./globals.css";
import { useWalletAuth } from "@/components/wallet/page";

const operadores = [
  { nombre: "Movistar", img: "/movistar.jpg" },
  { nombre: "Claro", img: "/claro.webp" },
  { nombre: "Tigo", img: "/tigo.png" },
  { nombre: "ETB", img: "/etb.png" },
  { nombre: "Virgin", img: "/virgin.png" },
  { nombre: "Exito", img: "/exito.png" },
];

export default function Home() {
  const { walletAddress, balance, signInWithWallet } = useWalletAuth();

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
          {balance !== null ? (
            <p><strong>Saldo en WLD:</strong> {balance} WLD</p>
          ) : (
            <p>Cargando saldo...</p>
          )}
        </div>
      )}
    </div>
  );
}












