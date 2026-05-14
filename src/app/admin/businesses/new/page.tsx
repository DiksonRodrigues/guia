import { supabase } from "@/lib/supabase";
import AdminShell from "@/components/AdminShell/AdminShell";
import BusinessForm from "../BusinessForm";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <AdminShell>
      <div className={styles.topbar}>
        <h1 className={styles.pageTitle}>Novo Negócio</h1>
      </div>
      <BusinessForm categories={categories ?? []} />
    </AdminShell>
  );
}
