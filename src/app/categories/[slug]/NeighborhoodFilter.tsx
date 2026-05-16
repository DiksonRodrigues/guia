"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./category.module.css";
import { track } from "@/lib/track";

type Neighborhood = { id: string; name: string; slug: string };

export default function NeighborhoodFilter({
  neighborhoods,
  active,
}: {
  neighborhoods: Neighborhood[];
  active: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("bairro", slug);
      track("filter_neighborhood", { metadata: { neighborhood_slug: slug } });
    } else {
      params.delete("bairro");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (neighborhoods.length === 0) return null;

  return (
    <div className={styles.filterWrap}>
      <p className={styles.filterLabel}>Filtrar por bairro</p>
      <div className={styles.filterChips}>
        <button
          className={`${styles.chip} ${!active ? styles.chipActive : ""}`}
          onClick={() => setFilter(null)}
        >
          Todos
        </button>
        {neighborhoods.map((n) => (
          <button
            key={n.id}
            className={`${styles.chip} ${active === n.slug ? styles.chipActive : ""}`}
            onClick={() => setFilter(active === n.slug ? null : n.slug)}
          >
            {n.name}
          </button>
        ))}
      </div>
    </div>
  );
}
