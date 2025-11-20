

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


    if (pathname.startsWith("/serviceprovider/signup")) {
      document.body.classList.add("serv-signup");
    } else {
      document.body.classList.remove("serv-signup");
    }


    if (pathname.startsWith("/provider/dashboard")) {
      document.body.classList.add("prov-dashboard");
    } else {
      document.body.classList.remove("prov-dashboard");
    }




    if (pathname.startsWith("/provider/dashboard/public-projects")) {
      document.body.classList.add("public-proj");
    } else {
      document.body.classList.remove("public-proj");
    }





    // if (pathname.startsWith("/provider/directory")) {
    //   document.body.classList.add("public");
    // } else {
    //   document.body.classList.remove("public");
    // }


    if (pathname.startsWith("/service-provider-directory")) {
      document.body.classList.add("directory");
    } else {
      document.body.classList.remove("directory");
    }


    if (pathname.startsWith("/user")) {
      document.body.classList.add("seeker-dashboard1");
    } else {
      document.body.classList.remove("seeker-dashboard1");
    }

    if (pathname.startsWith("/user/providers")) {
      document.body.classList.add("public");
    } else {
      document.body.classList.remove("public");
    }

















  }, [pathname]);

  return null;
}
