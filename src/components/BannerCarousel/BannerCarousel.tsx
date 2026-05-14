"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import styles from "./BannerCarousel.module.css";

type Business = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  categories?: { name: string };
};

export default function BannerCarousel({ businesses }: { businesses: Business[] }) {
  const slides = businesses.slice(0, 5);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {slides.map((biz, i) => (
          <Link
            href={`/business/${biz.slug}`}
            key={biz.id}
            className={`${styles.slide} ${i === current ? styles.active : ""}`}
            style={{ backgroundImage: `url(${biz.image_url})` }}
            aria-hidden={i !== current}
            tabIndex={i !== current ? -1 : 0}
          >
            <div className={styles.overlay} />
            <div className={styles.content}>
              <span className={styles.tag}>{biz.categories?.name}</span>
              <h2 className={styles.name}>{biz.name}</h2>
              <p className={styles.desc}>{biz.description}</p>
              <span className={styles.cta}>Ver estabelecimento →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Arrows */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Anterior">
        <ChevronLeft size={22} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Próximo">
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
