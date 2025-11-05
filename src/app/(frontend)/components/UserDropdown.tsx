"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import profile from "../../../../public/images/profile.png";

import profile_logo from "../../../../public/images/fav.png";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [user, setUser] = useState<{ name?: string } | null>(null);

  const [auth, setauth] = useState(null);

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

    const authUser = localStorage.getItem("auth");

    if(authUser)
    {
      setauth(authUser);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);


   const handleLogout = () => {

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("auth");

      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      router.push("/login");
    };


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

           <p>{user.name ? user.name.split(" ")[0] : ""}</p>

        </div>
      )}

        {open && auth !='admin' && (
          
          <div className="user-dropdown">

            <Link href={`${auth}/dashboard`}>Profile</Link>
            
            <button onClick={handleLogout} >Logout</button>

          </div>
        )}

    </div>
  );
};

export default UserDropdown;
