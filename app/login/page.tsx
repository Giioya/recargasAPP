"use client";

import { useWalletAuth } from "@/components/wallet/page";

export default function LoginPage() {
    const { signInWithWallet, isLoading } = useWalletAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
            <p className="mb-4 text-gray-600">Conéctate con tu billetera para continuar.</p>
            
            <button
                onClick={signInWithWallet}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? "Conectando..." : "Iniciar sesión con Ethereum"}
            </button>
        </div>
    );
}

