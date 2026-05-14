import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import AdminShell from "@/components/AdminShell/AdminShell";
import styles from "../admin.module.css";
import DeleteBusinessBtn from "./DeleteBusinessBtn";

export const dynamic = "force-dynamic";

export default async function AdminBusinessesPage() {
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, categories(name)")
    .order("name");

  return (
    <AdminShell>
      <div className={styles.topbar}>
        <h1 className={styles.pageTitle}>Negócios</h1>
        <Link href="/admin/businesses/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          <Plus size={16} /> Novo negócio
        </Link>
      </div>

      <div className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Desconto</th>
              <th>Destaque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {businesses?.map((biz: any) => (
              <tr key={biz.id}>
                <td>
                  <img
                    src={biz.image_url}
                    alt={biz.name}
                    className={styles.thumb}
                  />
                </td>
                <td style={{ fontWeight: 600 }}>{biz.name}</td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeGray}`}>
                    {biz.categories?.name ?? "—"}
                  </span>
                </td>
                <td>
                  {biz.discount_label ? (
                    <span className={`${styles.badge} ${styles.badgeOrange}`}>
                      {biz.discount_label}
                    </span>
                  ) : "—"}
                </td>
                <td>
                  <span className={`${styles.badge} ${biz.featured ? styles.badgeGreen : styles.badgeGray}`}>
                    {biz.featured ? "Sim" : "Não"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    href={`/admin/businesses/${biz.id}/edit`}
                    className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                  >
                    <Pencil size={13} /> Editar
                  </Link>
                  <DeleteBusinessBtn id={biz.id} name={biz.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
