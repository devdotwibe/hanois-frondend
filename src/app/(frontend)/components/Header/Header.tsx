


"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../../public/images/logo.png";

const Header = () => {
  const [isFixed, setIsFixed] = useState(false);

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

  return (
    <div className={`header ${isFixed ? "fixedtop" : ""}`}>
      <div className="containers">
        <div className="header-div">
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

          <div className="header-col2">
            {/* <LanguageSwitcher /> */}
            <Link href="/login" className="h-login">
              Login
            </Link>
            <Link href="/signup" className="h-btn">
              Get Listed
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
