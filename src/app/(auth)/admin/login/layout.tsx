export const dynamic = 'force-static';
export const metadata = {
  title: "Admin Login | hanois",
  description: "Admin login page",
};

export const runtime = 'edge';
export const revalidate = 0;

// --- THIS IS THE FIX ---
export const metadataBase = new URL('https://hanois.dotwibe.com');
export const dynamicParams = false;
export const preferredRegion = 'auto';
export const rootLayout = true; 


export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <>
        <head>

          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <title>Admin Login</title>

        </head>

        <body suppressHydrationWarning={true}>
          <main className="flex justify-center items-center min-h-screen bg-gray-100">
            {children}
          </main>
        </body>
        
      </>

    </html>
  );
}
