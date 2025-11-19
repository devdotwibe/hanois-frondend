"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();

  // Sidebar links
  const links = [
    { href: "/user/providers", label: "Service Providers" },
    { href: "/user/dashboard", label: "My Project" },
    { href: "/user/my-account", label: "My Account" },
  ];

  // Active path logic
  const activePath =
    links.some((link) => link.href === pathname)
      ? pathname
      : "/user/providers";

  return (
    <div className="outr">
      <ul className="sidebarul">
        {links.map((link) => (
          <li
            key={link.href + link.label}   // ✅ unique key
            className={activePath === link.href ? "active" : ""}
          >
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
