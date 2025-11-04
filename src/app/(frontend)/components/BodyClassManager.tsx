

"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BodyClassManager() {
  const pathname = usePathname();

  useEffect(() => {
  
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      document.body.classList.add("login-body");
    } else {
      document.body.classList.remove("login-body");
    }

  


    if (pathname === "/about") {
      document.body.classList.add("about-body");
    } else {
      document.body.classList.remove("about-body");
    }
  }, [pathname]);

  return null;
}
