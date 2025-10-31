"use client";

import Link from "next/link";
import "./styles/admin.css";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">Admin Panel</h2>
      <nav className="admin-nav">
        <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
          Dashboard
        </Link>
        <Link
          href="/admin/users"
          className={pathname === "/admin/users" ? "active" : ""}
        >
          Users
        </Link>
        <Link
          href="/admin/products"
          className={pathname === "/admin/products" ? "active" : ""}
        >
          Products
        </Link>
        <Link
          href="/admin/orders"
          className={pathname === "/admin/orders" ? "active" : ""}
        >
          Orders
        </Link>
        <Link
          href="/admin/settings"
          className={pathname === "/admin/settings" ? "active" : ""}
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}
