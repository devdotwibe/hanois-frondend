import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | hanois",
  description: "Admin login page",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning={true}>
        <main className="flex justify-center items-center min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}
