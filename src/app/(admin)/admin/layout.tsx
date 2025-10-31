import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - hanois",
  description: "Admin panel for hanois",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="admin-body">
        <div className="admin-container">
          <aside className="admin-sidebar">
            <h2>Admin Panel</h2>
          
          </aside>

          <main className="admin-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
