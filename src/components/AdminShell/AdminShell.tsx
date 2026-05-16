"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, Tag, LogOut, ShoppingCart, MapPin } from "lucide-react";
import styles from "../../app/admin/admin.module.css";

const navItems = [
  { href: "/admin/businesses", label: "Negócios", icon: Store },
  { href: "/admin/bairros", label: "Bairros", icon: MapPin },
  { href: "/admin/cupons", label: "Cupons", icon: Tag },
  { href: "/admin/supermercados", label: "Supermercados", icon: ShoppingCart },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/admin/businesses" className={styles.sidebarLogo}>
          Guia<span>Admin</span>
        </Link>
        <nav className={styles.sidebarNav}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.sidebarLink} ${pathname.startsWith(href) ? styles.sidebarLinkActive : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <button className={styles.logoutBtn} onClick={logout}>
            <LogOut size={14} style={{ display: "inline", marginRight: 6 }} />
            Sair
          </button>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
