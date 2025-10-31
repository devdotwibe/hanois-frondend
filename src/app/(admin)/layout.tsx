// app/(admin)/layout.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | GlobBird",
  description: "Admin Panel for managing products, users, and orders.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-semibold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/(admin)"
            className="block p-2 rounded hover:bg-gray-800 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/(admin)/users"
            className="block p-2 rounded hover:bg-gray-800 transition"
          >
            Users
          </Link>
          <Link
            href="/(admin)/products"
            className="block p-2 rounded hover:bg-gray-800 transition"
          >
            Products
          </Link>
          <Link
            href="/(admin)/orders"
            className="block p-2 rounded hover:bg-gray-800 transition"
          >
            Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, Admin</span>
            <img
              src="/admin-avatar.png"
              alt="Admin"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
