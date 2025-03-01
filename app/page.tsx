"use client"

import Image from "next/image";
import "./globals.css";

const operadores = [
  { nombre: "Movistar", img: "/movistar.jpg" },
  { nombre: "Claro", img: "/claro.webp" },
  { nombre: "Tigo", img: "/tigo.png" },
  { nombre: "ETB", img: "/etb.png" },
  { nombre: "Virgin", img: "/virgin.png" },
  { nombre: "Exito", img: "/exito.png" },
];

export default function Home() {
  return (
    <div className="container">
      <h2 className="title">Elige operador</h2>
      <div className="grid">
        {operadores.map((operador) => (
          <button key={operador.nombre} className="card">
            <Image
              src={operador.img}
              alt={operador.nombre}
              width={50}
              height={50}
              className="image"
            />
            {operador.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}





