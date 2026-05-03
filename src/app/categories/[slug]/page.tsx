import { MapPin, Star, ArrowLeft } from "lucide-react";
import { cityConfig } from "@/config/city";
import { getBusinessesByCategory } from "@/lib/database";
import Link from "next/link";
import styles from "../../page.module.css";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let data;
  try {
    data = await getBusinessesByCategory(slug);
  } catch (e) {
    return notFound();
  }

  const { businesses, category } = data;

  return (
    <div className="section">
      <div className="container">
        <Link href="/categories" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <ArrowLeft size={20} /> Todas as Categorias
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          {category.name} em <span className="gradient-text">{cityConfig.name}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Encontramos {businesses.length} estabelecimentos nesta categoria.
        </p>
        
        <div className={styles.featuredGrid}>
          {businesses.map((biz: any, i: number) => (
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
                  <span className={styles.cardTag}>{category.name}</span>
                  <span className={styles.cardLocation}>
                    <MapPin size={12} /> {cityConfig.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {businesses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ color: 'var(--text-muted)' }}>Nenhum estabelecimento encontrado nesta categoria ainda.</p>
            <Link href="/" className="gradient-text" style={{ fontWeight: 600, marginTop: '1rem', display: 'inline-block' }}>
              Voltar para o início
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
