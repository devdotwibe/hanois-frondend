"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`bg-indigo-700 text-white p-4 flex-shrink-0 transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="text-white mb-6 focus:outline-none"
      >
        {open ? "⮜" : "⮞"}
      </button>

      {/* Menu items */}
      <nav className="flex flex-col gap-3">
        <Link href="/admin" className="hover:bg-indigo-600 p-2 rounded">
          {open ? "Dashboard" : "🏠"}
        </Link>
        <Link href="/admin/users" className="hover:bg-indigo-600 p-2 rounded">
          {open ? "Users" : "👥"}
        </Link>
        <Link href="/admin/products" className="hover:bg-indigo-600 p-2 rounded">
          {open ? "Products" : "📦"}
        </Link>
        <Link href="/admin/orders" className="hover:bg-indigo-600 p-2 rounded">
          {open ? "Orders" : "🧾"}
        </Link>
        <Link href="/admin/settings" className="hover:bg-indigo-600 p-2 rounded">
          {open ? "Settings" : "⚙️"}
        </Link>
      </nav>
    </aside>
  );
}
