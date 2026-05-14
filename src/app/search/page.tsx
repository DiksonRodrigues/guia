import { MapPin, Star, ArrowLeft, SearchX } from "lucide-react";
import { cityConfig } from "@/config/city";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import styles from "../page.module.css";

async function searchBusinesses(q: string) {
  const { data, error } = await supabase
    .from("businesses")
    .select("*, categories(name)")
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .order("featured", { ascending: false })
    .limit(30);

  if (error) throw error;
  return data;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchBusinesses(query) : [];

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
            {results.map((biz: any, i: number) => (
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
