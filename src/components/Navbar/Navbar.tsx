"use client";

import Link from "next/link";
import { cityConfig } from "@/config/city";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.navContainer}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            Guia<span className="gradient-text">{cityConfig.name}</span>
          </Link>

          {/* Desktop Links */}
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Início</Link>
            <Link href="/categories" className={styles.navLink}>Categorias</Link>
            <Link href="/about" className={styles.navLink}>Sobre</Link>
            <button className={styles.navButton}>
              Anunciar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
