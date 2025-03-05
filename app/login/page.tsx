"use client";

import { useWalletAuth } from "@/components/wallet/";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const { signInWithWallet, isLoading, walletAddress } = useWalletAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const storedWallet = typeof window !== "undefined" ? localStorage.getItem("walletAddress") : null;
        
        if (walletAddress || storedWallet) {
            console.log("✅ Wallet detectada, redirigiendo a la página principal...");
            router.push("/");
        }
    }, [walletAddress, router]);

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
            <p className="mb-4 text-gray-600">Conéctate con tu billetera para continuar.</p>
            
            <button
                onClick={signInWithWallet}
                className="bg-[#3b5110] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#589013] transition disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? "Conectando..." : "Conéctate"}
            </button>
        </div>
    );
}




