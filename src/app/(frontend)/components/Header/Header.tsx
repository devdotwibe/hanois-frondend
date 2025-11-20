"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../../public/images/logo2.png";
import UserDropdown from "../UserDropdown";
import menuimg from "../../../../../public/images/header-menu.svg";
import { usePathname } from "next/navigation";
import DirectorySidebar from "@/app/(directory)/provider/Components/DirectorySidebar";


const Header = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [auth, setauth] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("menu"); // menu | filters

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const authUser = localStorage.getItem("auth");
    if (authUser) setauth(authUser);

    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <div className={`header ${isFixed ? "fixedtop" : ""}`}>
      {/* Desktop Header */}
      <div className="containers desk-header">
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

            {(token == null || auth == "admin") && (
              <div className="header-col2">
                <Link href="/login" className="h-login">
                  Log in
                </Link>

                <Link href="/get-listed" className="h-btn">
                  Get Listed
                </Link>
              </div>
            )}

            {token && auth != "admin" && (
              <div className="logged-outer">
                <div className="loged-inn-div">
                  <UserDropdown />
                </div>
              </div>
            )}
          </>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="containers mob-header">
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

            <div className="div2h">
              {(token == null || auth == "admin") && (
                <div className="header-col2">
                  <Link href="/login" className="h-login">
                    Log in
                  </Link>

                  <Link href="/get-listed" className="h-btn">
                    Get Listed
                  </Link>
                </div>
              )}

              {token && auth != "admin" && (
                <div className="logged-outer">
                  <div className="loged-inn-div">
                    <UserDropdown />
                  </div>
                </div>
              )}

              {/* Mobile Menu Icon */}
              <div className="mob-menu" onClick={() => setIsMenuOpen(true)}>
                <Image src={menuimg} alt="img" width={22} height={22} />
              </div>

              {/* ---------------- Mobile Menu Overlay ---------------- */}
              <div className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`}>
                <div className="mobile-menu-header">
                  {/* Tabs */}
                  <div className="tabs">
                    <button
                      className={activeTab === "menu" ? "active" : ""}
                      onClick={() => setActiveTab("menu")}
                    >
                      Menu
                    </button>

                    <button
                      className={activeTab === "filters" ? "active" : ""}
                      onClick={() => setActiveTab("filters")}
                    >
                      Filters
                    </button>
                  </div>

                  {/* Close Button */}
                  <button className="close-btn11" onClick={() => setIsMenuOpen(false)}>
                    ✕
                  </button>
                </div>

                {/* Tabs Content */}
                <div className="tab-content">
                  {activeTab === "menu" && (
                    <ul className="menu-list">
  <li
    className={pathname === "/provider/dashboard" ? "active" : ""}
    onClick={() => setIsMenuOpen(false)}
  >
    <Link href="/provider/dashboard">Leads</Link>
  </li>

  <li
    className={pathname === "/provider/dashboard/company-profile" ? "active" : ""}
    onClick={() => setIsMenuOpen(false)}
  >
    <Link href="/provider/dashboard/company-profile">Company Profile</Link>
  </li>

  <li
    className={pathname === "/provider/payment-billing" ? "active" : ""}
    onClick={() => setIsMenuOpen(false)}
  >
    <Link href="/provider/payment-billing">Payment & Billing</Link>
  </li>

  <li
    className={pathname === "/provider/dashboard/public-projects" ? "active" : ""}
    onClick={() => setIsMenuOpen(false)}
  >
    <Link href="/provider/dashboard/public-projects">Public Projects</Link>
  </li>
  <li
    className={pathname === "/get-listed" ? "active" : ""}
    onClick={() => setIsMenuOpen(false)}
  >
    <Link href="/get-listed">Get Listed</Link>
  </li>


</ul>

                  )}

                  {activeTab === "filters" && (
                    <div className="filter-box">
                      <DirectorySidebar />
                    </div>
                  )}
                </div>
              </div>
              {/* ---------------- END Mobile Menu ---------------- */}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default Header;
