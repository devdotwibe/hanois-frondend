import type { Metadata } from "next";
import "./globals.css";
import "../../src/app/styles/header.css"
import "../../src/app/styles/home.css"
import "../../src/app/styles/footer.css"
import "../../src/app/styles/languageswitcher.css"
import "../../src/app/styles/rtl.css"
import "../../src/app/styles/btn.css"
import "../../src/app/styles/login.css"
import "../../src/app/styles/popup.css"
import "../../src/app/styles/serviceprovidersignup.css"

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header"
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
