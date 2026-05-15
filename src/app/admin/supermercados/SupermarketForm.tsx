"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { uploadImage } from "@/lib/storage";
import styles from "../admin.module.css";

type SupermarketData = {
  id?: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  address: string;
  phone: string;
  active: boolean;
};

const empty: SupermarketData = {
  name: "", slug: "", logo_url: "", description: "", address: "", phone: "", active: true,
};

function toSlug(name: string): string {
  return name
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function SupermarketForm({ initial }: { initial?: SupermarketData }) {
  const isEdit = !!initial?.id;
  const router = useRouter();
  const [form, setForm] = useState<SupermarketData>(initial ?? empty);
  const [slugManual, setSlugManual] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof SupermarketData, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleNameChange = (value: string) => {
    setForm((f) => ({ ...f, name: value, slug: slugManual ? f.slug : toSlug(value) }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "supermarkets");
      set("logo_url", url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      setError("Nome e slug são obrigatórios.");
      return;
    }
    setLoading(true);
    setError("");
    const payload = { ...form };
    delete (payload as any).id;
    try {
      const url = isEdit ? `/api/admin/supermarkets/${initial!.id}` : "/api/admin/supermarkets";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/supermercados");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.formGrid}>

          <div className={styles.field}>
            <label className={styles.label}>Nome *</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Supermercado Bom Preço"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Slug (URL) *</span>
              {slugManual && (
                <button
                  type="button"
                  onClick={() => { setSlugManual(false); set("slug", toSlug(form.name)); }}
                  style={{ fontSize: "0.72rem", color: "#5b21b6", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  ↺ Gerar automático
                </button>
              )}
            </label>
            <input
              className={styles.input}
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set("slug", e.target.value.toLowerCase().replace(/\s/g, "-")); }}
              placeholder="bom-preco"
              style={{ fontFamily: "monospace" }}
            />
          </div>

          <div className={`${styles.field} ${styles.formFull}`}>
            <label className={styles.label}>Descrição</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Breve descrição do supermercado..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Endereço</label>
            <input
              className={styles.input}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Rua, número, bairro"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Telefone</label>
            <input
              className={styles.input}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(85) 99999-9999"
            />
          </div>

          <div className={`${styles.field} ${styles.formFull}`}>
            <label className={styles.label}>Logo</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {form.logo_url && (
                <img src={form.logo_url} alt="logo" style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc" }} />
              )}
              <label className={`${styles.btn} ${styles.btnOutline}`} style={{ cursor: "pointer" }}>
                {uploading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Enviando...</> : <><Upload size={14} /> Upload logo</>}
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.checkboxRow}>
              <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
              Supermercado ativo (visível no site)
            </label>
          </div>

        </div>
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          disabled={loading || uploading}
          style={{ minWidth: 180, justifyContent: "center" }}
        >
          {loading
            ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Salvando...</>
            : isEdit ? "Salvar alterações" : "Criar supermercado"}
        </button>
        <a href="/admin/supermercados" className={`${styles.btn} ${styles.btnOutline}`}>Cancelar</a>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
