"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/user/providers", label: "Service Providers" },
    { href: "/user/dashboard", label: "My Project" },
    { href: "/user/my-account", label: "My Account" },
  ];

  // ✅ Custom active logic
  const isMyProjectActive =
    pathname.startsWith("/user/dashboard") ||
    pathname.startsWith("/user/project-details") ||
    pathname.startsWith("/user/project-edit");

  return (
    <div className="outr">
      <ul className="sidebarul">
        {links.map((link) => {
          const isActive =
            link.href === "/user/dashboard"
              ? isMyProjectActive
              : pathname === link.href;

          return (
            <li
              key={link.href + link.label}
              className={isActive ? "active" : ""}
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
