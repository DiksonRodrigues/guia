"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import styles from "./FloatingSearch.module.css";

export default function FloatingSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Foca no input ao abrir
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  // Fecha com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Botão Flutuante da Lupa */}
      <button
        id="floating-search-btn"
        className={styles.fab}
        onClick={() => setOpen(true)}
        aria-label="Abrir busca"
      >
        <Search size={22} />
      </button>

      {/* Overlay + Modal de Busca */}
      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} />
          <div className={styles.modal}>
            <div className={styles.searchBar}>
              <Search size={20} className={styles.searchIcon} />
              <input
                ref={inputRef}
                id="floating-search-input"
                type="text"
                placeholder="Buscar estabelecimento ou categoria..."
                className={styles.input}
              />
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Fechar busca"
              >
                <X size={20} />
              </button>
            </div>
            <p className={styles.hint}>Pressione <kbd>ESC</kbd> para fechar</p>
          </div>
        </>
      )}
    </>
  );
}
