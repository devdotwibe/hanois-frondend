"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();

  // Define your links
  const links = [
    { href: "/user/providers", label: "Service Providers" },
    { href: "/user/dashboard", label: "My Project" },
    { href: "/user/my-account", label: "My Account" },
  ];

  // Determine which one is active (default to first if none matches)
  const activePath =
    links.some((link) => link.href === pathname)
      ? pathname
      : "/user/dashboard";

  return (
    <div className="outr">
      <ul className="sidebarul">
        {links.map((link) => (
          <li
            key={link.href}
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
