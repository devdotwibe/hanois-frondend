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
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("auth");

          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          router.push("/admin/login");
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

                 <li>
                  <Link
                    href="/admin/get-list"
                    className={pathname === "/admin/get-list" ? "active" : ""}
                  >
                    Get Listed
                  </Link>
                </li>

              </ul>
            )}
        </div>


      <div
            className="pages-dropdown"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            <button className="dropdown-btn">Options</button>

          {pagesOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link
                    href="/admin/categories"
                    className={pathname === "/admin/categories" ? "active" : ""}
                  >
                    Categories
                  </Link>
                </li>

                             <li>
                  <Link
                    href="/admin/home"
                    className={pathname === "" ? "active" : ""}
                  >
                    Services
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
