"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import profile from "../../../../public/images/profile.png";

import profile_logo from "../../../../public/images/logo2.png";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  return (
    <div
      className={`loged-inn-div ${open ? "open" : ""}`}
      ref={dropdownRef}
      onClick={() => setOpen((prev) => !prev)}
    >

        <div className="user-logo">
          <Image src={profile_logo} alt="User" width={40} height={40} />
        </div>

      {user && (
        <div className="user-name">

          <p>{user?.name}</p>

        </div>
      )}

        {open && (
          <div className="user-dropdown">
            <Link href="/profile">Profile</Link>
            <button onClick={() => alert("Logout clicked")}>Logout</button>
          </div>
        )}

    </div>
  );
};

export default UserDropdown;
