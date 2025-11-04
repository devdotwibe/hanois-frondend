import type { Metadata } from "next";
import "./styles/admin.css";
import AdminSidebar from "./Sidebar";

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
        <>
        <head>

          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        </head>

          <body suppressHydrationWarning={true}>

              <div className="admin-container">

                <>
                
                  <AdminSidebar /> 

                  <main className="admin-content">

                    {children}

                  </main>

                </>
                
              </div>
          </body>

          </>
    </html>
  );
}
