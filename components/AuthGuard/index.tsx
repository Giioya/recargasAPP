"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || status === "loading") return;

        const storedWallet = typeof window !== "undefined" ? localStorage.getItem("walletAddress") : null;

        // Revisar si MiniKit tiene un usuario autenticado
        if (MiniKit.user?.username) {
            setIsAuthenticated(true);
            localStorage.setItem("username", MiniKit.user.username);
            localStorage.setItem("walletAddress", MiniKit.walletAddress ?? "");
        }

        // Redirigir solo si no hay sesión ni usuario autenticado en MiniKit
        if (pathname === "/" && status === "unauthenticated" && !storedWallet && !MiniKit.user?.username) {
            router.push("/login");
        }
    }, [status, router, pathname, isClient]);

    if (status === "loading" || !isClient) {
        return <p>Cargando...</p>;
    }

    return <>{children}</>;
}



