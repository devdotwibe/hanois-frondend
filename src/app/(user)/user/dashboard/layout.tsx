import type { Metadata } from "next";


import "../../../globals.css"
import "../../../styles/header.css"
import "../../../styles/footer.css"
import "../../../styles/home.css"
import "../../../styles/languageswitcher.css"
import "../../../styles/rtl.css"
import "../../../styles/popup.css"
import "../../../styles/btn.css"
import "../../../styles/serviceprovidersignup.css"
import "../../../styles/sidebar.css"




import Header from "@/app/(frontend)/components/Header/Header";
import Footer from "@/app/(frontend)/components/Footer/Footer";
import BodyClassManager from "@/app/(frontend)/components/BodyClassManager";
import SideBar from "../Componrnts/SideBar";

export const metadata: Metadata = {
  title: "hanois",
  description: "hanois",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className="antialiased" suppressHydrationWarning={true}>
        <>
        <BodyClassManager />
       <Header />


       <div className="sidebar-div">

          <SideBar />

          <div className="sidebar-pages">
             {children}

          </div>
           

       </div>

          

       <Footer />
        </>
        

      </body>
    </html>
  );
}
