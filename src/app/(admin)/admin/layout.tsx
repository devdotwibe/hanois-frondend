// app/(admin)/admin/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - hanois",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="admin-container">{children}</div>
      </body>
    </html>
  );
}
