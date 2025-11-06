


"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarProvider = () => {
  const pathname = usePathname();

  // Define your links
  const links = [
    { href: "/provider/dashboard", label: "Leads" },
    { href: "/provider/dashboard/company-profile", label: "Company Profile" },
    { href: "/provider/dashboard/paymentandbilling", label: "Payment And Billing" },
    { href: "/provider/dashboard/public-ptojects", label: "Public Projects" },
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

export default SidebarProvider;
