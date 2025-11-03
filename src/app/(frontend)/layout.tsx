import type { Metadata } from "next";
import "../globals.css";
import "../../app/styles/header.css"
import "../../app/styles/home.css"
import "../../app/styles/footer.css"
import "../../app/styles/languageswitcher.css"
import "../../app/styles/rtl.css"
import "../../app/styles/login.css"
import "../../app/styles/popup.css"
import "../../app/styles/serviceprovidersignup.css"

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import BodyClassManager from "./components/BodyClassManager";

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
        
        <BodyClassManager />

        <Header />

              {children}

        <Footer />

      </body>
    </html>
  );
}
