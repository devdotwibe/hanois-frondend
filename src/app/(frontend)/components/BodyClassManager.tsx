

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


      // service provider signup
    if (pathname.startsWith("/serviceprovider/signup")) {
      document.body.classList.add("serv-signup");
    } else {
      document.body.classList.remove("serv-signup");
    }

      // service provider signup
    if (pathname.startsWith("/provider-dashboard")) {
      document.body.classList.add("prov-dashboard");
    } else {
      document.body.classList.remove("prov-dashboard");
    }


    
    if (pathname.startsWith("/seeker-dashboard")) {
      document.body.classList.add("seeker-dashboard1");
    } else {
      document.body.classList.remove("seeker-dashboard1");
    }








  


    if (pathname === "/about") {
      document.body.classList.add("about-body");
    } else {
      document.body.classList.remove("about-body");
    }
  }, [pathname]);

  return null;
}
