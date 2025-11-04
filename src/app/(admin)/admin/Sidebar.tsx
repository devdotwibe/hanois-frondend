"use client";

import Link from "next/link";
import "./styles/admin.css";
import { usePathname ,useRouter} from "next/navigation";
import { API_URL } from '@/config'; 
import axios from "axios";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
      try {
        await axios.post(`${API_URL}admin/logout`, {}, { 
          withCredentials: true 
        });

        router.push("/admin/login");
      } catch (err) {
        console.error("Logout failed", err);
      }
  };


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
          Seekers
        </Link>

        <Link
          href="/admin/prividers"
          className={pathname === "/admin/prividers" ? "active" : ""}
        >
          Providers
        </Link>

        {/* <Link
          href="/admin/orders"
          className={pathname === "/admin/orders" ? "active" : ""}
        >
          Orders
        </Link> */}
    
          <Link
          href="/admin/home"
          className={pathname === "/admin/home" ? "active" : ""}
        >
          Home Page
        </Link>

        <Link
            href="/admin/settings"
            className={pathname === "/admin/settings" ? "active" : ""}
          >
            Settings
        </Link>

        <button onClick={handleLogout} className={pathname === "/admin/logout" ? "active" : ""}>

            Logout
        </button>

      </nav>
    </aside>
  );
}
