"use client";

import Link from "next/link";
import "./styles/admin.css";
import { usePathname ,useRouter} from "next/navigation";
import { API_URL } from '@/config'; 
import axios from "axios";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [pagesOpen, setPagesOpen] = useState(false);

  const handleLogout = async () => {
      try {

         const res = await axios.post(`${API_URL}admin/logout`, {}, { 
            withCredentials: true 
          });

        if (res.status === 200) {

          localStorage.removeItem("token");
          localStorage.removeItem("auth");

          document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

          router.push("/admin/login");
        }
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

        <div
            className="pages-dropdown"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            <button className="dropdown-btn">Pages</button>

          {pagesOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link
                    href="/admin/home"
                    className={pathname === "/admin/home" ? "active" : ""}
                  >
                    Home Page
                  </Link>
                </li>

              </ul>
            )}
        </div>

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
