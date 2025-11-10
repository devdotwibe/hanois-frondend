"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../../public/images/logo2.png";
import profile from "../../../../../public/images/profile.png"
import UserDropdown from "../UserDropdown";


const Header = () => {
  const [isFixed, setIsFixed] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  const [auth, setauth] = useState(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

      window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
   
  useEffect(() => {

     const authUser = localStorage.getItem("auth");

      if(authUser)
      {
        setauth(authUser);
      }

      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }, []);

  return (
    <div className={`header ${isFixed ? "fixedtop" : ""}`}>

      <div className="containers">

            <div className="header-div">

              <>
                <div className="header-col1">
                  <div className="header-logo">
                    <Link href="/">
                      <Image src={logo} alt="logo" width={100} height={19} />
                    </Link>
                  </div>

                  <div className="header-text">
                    <p>Service Providers</p>
                  </div>
                </div>

                {(token ==null || auth =='admin')  && (

                  <div className="header-col2">
                
                    <Link href="/login" className="h-login">
                      Log in
                    </Link>

                    <Link href="/get-listed" className="h-btn">
                      Get Listed
                    </Link>

                  </div>
                  
                )}

                {token && auth !='admin' &&(

                  <div className="logged-outer ">

                    <div className="loged-inn-div">

                      <UserDropdown />

                    </div>

                  </div>
                )}

              </>

            </div>
      </div>
    </div>
  );
};

export default Header;
