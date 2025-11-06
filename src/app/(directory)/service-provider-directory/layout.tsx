import type { Metadata } from "next";


import "../../../app/globals.css"


import "../../../app/styles/header.css"

import "../../../app/styles/footer.css"
import "../../../app/styles/home.css"
import "../../../app/styles/languageswitcher.css"
import "../../../app/styles/rtl.css"
import "../../../app/styles/popup.css"
import "../../../app/styles/btn.css"
import "../../../app/styles/serviceprovidersignup.css"
import "../../../app/styles/sidebar.css"




import Header from "@/app/(frontend)/components/Header/Header";
import Footer from "@/app/(frontend)/components/Footer/Footer";
import BodyClassManager from "@/app/(frontend)/components/BodyClassManager";
import SideBar from "@/app/(user)/user/Componrnts/SideBar";
import DirectorySidebar from "../Components/DirectorySidebar";

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
        <DirectorySidebar />

      

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
