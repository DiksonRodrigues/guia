import { MapPin, Star } from "lucide-react";
import { cityConfig } from "@/config/city";
import { getCategories, getFeaturedBusinesses } from "@/lib/database";
import Link from "next/link";
import styles from "./page.module.css";
import * as LucideIcons from "lucide-react";
import FloatingSearch from "@/components/FloatingSearch/FloatingSearch";
import BannerCarousel from "@/components/BannerCarousel/BannerCarousel";

export default async function Home() {
  const categories = await getCategories();
  const featuredBusinesses = await getFeaturedBusinesses();

  return (
    <div className={styles.homePage}>
      {/* Lupa Flutuante - fixa na tela */}
      <FloatingSearch />

      {/* Banner Carousel */}
      <BannerCarousel businesses={featuredBusinesses} />

      {/* Categories Section */}
      <section className={`${styles.categories} section`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Categorias Populares</h2>
          <div className={styles.categoryGrid}>
            {categories.map((cat: any, i: number) => {
              // @ts-ignore
              const IconComponent = LucideIcons[cat.icon_name] || LucideIcons.HelpCircle;
              return (
                <Link 
                  href={`/categories/${cat.slug}`} 
                  key={cat.id} 
                  className={`${styles.categoryItem} glass-card animate-fade`} 
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={styles.categoryIcon} style={{ color: cat.color }}>
                    <IconComponent size={24} />
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className={`${styles.featured} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <Link href="/business" className={styles.viewAll}>Ver todos</Link>
          </div>
          
          <div className={styles.featuredGrid}>
            {featuredBusinesses.map((biz: any, i: number) => (
              <Link 
                href={`/business/${biz.slug}`} 
                key={biz.id} 
                className={`${styles.featuredCard} glass-card animate-fade`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div 
                  className={styles.cardImage} 
                  style={{ backgroundImage: `url(${biz.image_url})` }}
                ></div>
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
        </div>
      </section>
    </div>
  );
}
