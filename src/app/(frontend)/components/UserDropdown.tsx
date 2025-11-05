"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import profile from "../../../../public/images/profile.png";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`loged-inn-div ${open ? "open" : ""}`}
      ref={dropdownRef}
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="user-logo">
        <Image src={profile} alt="User" width={40} height={40} />
      </div>
      <div className="user-name">
        <p>jssjsjd</p>
      </div>

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
