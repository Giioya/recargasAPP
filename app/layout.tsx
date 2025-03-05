import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import { FaHome, FaInfoCircle, FaHeadset } from "react-icons/fa";
import AuthGuard from "@/components/AuthGuard";

const carga = "/images/carga_buenocambios.jpg";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuenoCambios 1.1.0",
  description: "Gioya",
};

// 🟢 Importa el ErudaProvider con importación dinámica
const ErudaProvider = dynamic(
  () => import("@/components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Encabezado con título y menú */}
        <header>
          <h1 className="title">BuenoCambios</h1>
        </header>

        {/* Imagen de carga */}
        <div className="flex justify-center mt-4">
          <Image
            src={carga}
            alt="Carga BuenoCambios"
            className="carga_bc"
            width={800}
            height={600}
          />
        </div>

        {/* Footer fijo */}
        <footer className="footer">
          <a href="/informacion" className="footer-item">
            <FaInfoCircle />
            <span>Ayuda</span>
          </a>
          <a href="/" className="footer-item">
            <FaHome />
            <span>Inicio</span>
          </a>
          <a href="/soporte" className="footer-item">
            <FaHeadset />
            <span>Soporte</span>
          </a>
        </footer>

        {/* Proveedores de autenticación y MiniKit */}
        <NextAuthProvider>
          <AuthGuard>
            <ErudaProvider> {/* ✅ Ahora funciona correctamente */}
              <MiniKitProvider>{children}</MiniKitProvider>
            </ErudaProvider>
          </AuthGuard>
        </NextAuthProvider>
      </body>
    </html>
  );
}

