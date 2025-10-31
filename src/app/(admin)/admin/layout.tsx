import type { Metadata } from "next";
import "./styles/admin.css";

export const metadata: Metadata = {
  title: "Admin Panel | hanois",
  description: "Simple Admin Dashboard for hanois",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="admin-container">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <h2 className="admin-logo">Admin Panel</h2>
            <nav className="admin-nav">
              <a href="/admin" className="active">Dashboard</a>
              <a href="/admin/users">Users</a>
              <a href="/admin/products">Products</a>
              <a href="/admin/orders">Orders</a>
              <a href="/admin/settings">Settings</a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
