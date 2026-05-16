import { MapPin, Star, ArrowLeft } from "lucide-react";
import { cityConfig } from "@/config/city";
import { getBusinessesByCategory, getNeighborhoods } from "@/lib/database";
import Link from "next/link";
import styles from "../../page.module.css";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import NeighborhoodFilter from "./NeighborhoodFilter";
import { supabase } from "@/lib/supabase";
import BusinessCardImage from "@/components/BusinessCardImage/BusinessCardImage";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bairro?: string }>;
}) {
  const { slug } = await params;
  const { bairro } = await searchParams;

  let data;
  let neighborhoods;
  try {
    let neighborhoodId: string | undefined;
    if (bairro) {
      const { data: hood } = await supabase
        .from("neighborhoods")
        .select("id")
        .eq("slug", bairro)
        .eq("is_active", true)
        .single();
      neighborhoodId = hood?.id;
    }
    [data, neighborhoods] = await Promise.all([
      getBusinessesByCategory(slug, neighborhoodId),
      getNeighborhoods(),
    ]);
  } catch {
    return notFound();
  }

  const { businesses, category } = data;

  return (
    <div className="section">
      <div className="container">
        <Link href="/categories" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
          <ArrowLeft size={20} /> Todas as Categorias
        </Link>

        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
          {category.name} em <span className="gradient-text">{cityConfig.name}</span>
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          {businesses.length} estabelecimento{businesses.length !== 1 ? "s" : ""}
          {bairro ? ` no bairro selecionado` : " nesta categoria"}.
        </p>

        <Suspense fallback={null}>
          <NeighborhoodFilter
            neighborhoods={neighborhoods}
            active={bairro ?? null}
          />
        </Suspense>

        <div className={styles.featuredGrid}>
          {businesses.map((biz: any, i: number) => (
            <Link
              href={`/business/${biz.slug}`}
              key={biz.id}
              className={`${styles.featuredCard} glass-card animate-fade`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <BusinessCardImage url={biz.image_url} name={biz.name} />
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
                  <span className={styles.cardTag}>{category.name}</span>
                  <span className={styles.cardLocation}>
                    <MapPin size={12} />
                    {biz.neighborhoods?.name ?? cityConfig.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {businesses.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ color: "var(--text-muted)" }}>
              Nenhum estabelecimento encontrado{bairro ? " neste bairro" : ""}.
            </p>
            <Link href="/" className="gradient-text" style={{ fontWeight: 600, marginTop: "1rem", display: "inline-block" }}>
              Voltar para o início
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
