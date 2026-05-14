"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Star, ArrowLeft, SearchX, Loader2 } from "lucide-react";
import { cityConfig } from "@/config/city";
import Link from "next/link";
import Fuse from "fuse.js";
import styles from "../page.module.css";

type Business = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  rating: number;
  discount_label?: string | null;
  categories?: { name: string };
};

// Remove acentos para comparação (otica → otica, ótica → otica)
function normalize(str: string) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega todos os businesses uma vez
  useEffect(() => {
    fetch("/api/businesses")
      .then((r) => r.json())
      .then((data) => {
        setAllBusinesses(data);
        setLoading(false);
      });
  }, []);

  // Roda busca sempre que query ou dados mudam
  useEffect(() => {
    if (!query || allBusinesses.length === 0) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(allBusinesses, {
      keys: [
        { name: "name", weight: 0.6 },
        { name: "description", weight: 0.25 },
        { name: "categories.name", weight: 0.15 },
      ],
      threshold: 0.45,       // 0 = perfeito, 1 = qualquer coisa
      distance: 100,
      includeScore: true,
      getFn: (obj, path) => {
        // Normaliza o valor do campo antes de comparar
        const val = Fuse.config.getFn(obj, path);
        if (typeof val === "string") return normalize(val);
        return val;
      },
    });

    // Normaliza a query também
    const hits = fuse.search(normalize(query));
    setResults(hits.map((h) => h.item));
  }, [query, allBusinesses]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "8rem 0" }}>
        <Loader2 size={32} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "2rem" }}
        >
          <ArrowLeft size={18} /> Voltar
        </Link>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          {query ? (
            <>Resultados para <span className="gradient-text">"{query}"</span></>
          ) : (
            "Busca"
          )}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
          {results.length} estabelecimento{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
        </p>

        {results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-muted)" }}>
            <SearchX size={48} style={{ margin: "0 auto 1rem", opacity: 0.4, display: "block" }} />
            <p>Nenhum resultado para <strong>"{query}"</strong>.</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Tente outra palavra ou explore as categorias.</p>
            <Link href="/categories" className="gradient-text" style={{ fontWeight: 700, marginTop: "1.5rem", display: "inline-block" }}>
              Ver categorias →
            </Link>
          </div>
        ) : (
          <div className={styles.featuredGrid}>
            {results.map((biz, i) => (
              <Link
                href={`/business/${biz.slug}`}
                key={biz.id}
                className={`${styles.featuredCard} glass-card animate-fade`}
                style={{ animationDelay: `${i * 0.05}s`, position: "relative" }}
              >
                {biz.discount_label && (
                  <span className={styles.discountBadge}>{biz.discount_label}</span>
                )}
                <div
                  className={styles.cardImage}
                  style={{ backgroundImage: `url(${biz.image_url})` }}
                />
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{biz.name}</h3>
                    <div className={styles.cardRating}>
                      <Star size={14} fill="currentColor" />
                      <span>{Number(biz.rating).toFixed(1)}</span>
                    </div>
                  </div>
                  <p className={styles.cardDesc}>{biz.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardTag}>{biz.categories?.name}</span>
                    <span className={styles.cardLocation}>
                      <MapPin size={12} /> {cityConfig.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
