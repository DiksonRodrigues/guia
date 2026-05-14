import styles from "./CredibilityStrip.module.css";

const items = [
  { emoji: "🏷️", text: "Descontos exclusivos" },
  { emoji: "📍", text: "Só em Maracanaú" },
  { emoji: "✅", text: "Estabelecimentos verificados" },
  { emoji: "🤝", text: "Parceiros confiáveis" },
];

export default function CredibilityStrip() {
  return (
    <div className={styles.strip}>
      <div className={styles.inner}>
        {items.map((item) => (
          <div key={item.text} className={styles.item}>
            <span className={styles.emoji}>{item.emoji}</span>
            <span className={styles.text}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
