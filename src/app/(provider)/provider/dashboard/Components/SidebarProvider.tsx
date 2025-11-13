"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/config";

const SidebarProvider = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const links = [
    { href: "/provider/dashboard", label: "Leads" },
    { href: "/provider/dashboard/company-profile", label: "Company Profile" },
    { href: "/provider/dashboard/paymentandbilling", label: "Payment And Billing" },
    { href: "/provider/dashboard/public-projects", label: "Public Projects" },
  ];

const activePath = (() => {
  if (pathname.startsWith("/provider/dashboard/details/")) {
    return "/provider/dashboard/company-profile";
  }

  return links.some((link) => link.href === pathname)
    ? pathname
    : "/user/dashboard";
})();


  const hasAllMandatoryFields = (provider) => {
    if (!provider) return false;

    const nameOk = Boolean(provider.name && String(provider.name).trim());
    const categoriesOk =
      Array.isArray(provider.categories_id)
        ? provider.categories_id.length > 0
        : (provider.categories_id !== undefined && provider.categories_id !== null && provider.categories_id !== "");
    const phoneOk = Boolean(provider.phone && String(provider.phone).trim());
    const locationOk = Boolean(provider.location && String(provider.location).trim());
    const teamOk =
      provider.team_size !== undefined && provider.team_size !== null && String(provider.team_size).trim() !== "";
    const notesOk = Boolean(provider.notes && String(provider.notes).trim());
    const servicesOk =
      (Array.isArray(provider.service_id) && provider.service_id.length > 0) ||
      (Array.isArray(provider.service_id || provider.services) && (provider.service_id || provider.services).length > 0) ||
      (provider.service_id !== undefined && provider.service_id !== null && provider.service_id !== "");

    return nameOk && categoriesOk && phoneOk && locationOk && teamOk && notesOk && servicesOk ;
  };

  const getProviderIdFromStorage = () => {
    let providerId = null;
    try {
      providerId = localStorage.getItem("providerId");
      const token = localStorage.getItem("token");
      if (!providerId && token) {
        const base64 = token.split(".")[1];
        const payload = JSON.parse(atob(base64));
        providerId = String(payload?.provider_id || payload?.id || payload?.user_id || providerId);
      }
    } catch (e) {
      // ignore
    }
    return providerId;
  };

const handleCompanyClick = async (e) => {
  e.preventDefault();

  const providerId = getProviderIdFromStorage();
  const token = localStorage.getItem("token");

  if (!providerId) {
    router.push("/provider/dashboard/company-profile");
    return;
  }

  if (!token) {
    router.push(`/provider/dashboard/company-profile?providerId=${encodeURIComponent(providerId)}`);
    return;
  }

  try {
    const res = await fetch(`${API_URL}providers/${encodeURIComponent(providerId)}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      router.push(`/provider/dashboard/company-profile?providerId=${encodeURIComponent(providerId)}`);
      return;
    }

    const provider = data?.provider ?? data ?? null;

    if (hasAllMandatoryFields(provider)) {
      router.push(`/provider/dashboard/details/${providerId}`);
    } else {
      router.push(`/provider/dashboard/company-profile?providerId=${encodeURIComponent(providerId)}`);
    }
  } catch (err) {
    console.error("Error checking provider:", err);
    router.push(`/provider/dashboard/company-profile?providerId=${encodeURIComponent(providerId)}`);
  }
};


  return (
    <div className="outr">
      <ul className="sidebarul">
          {links.map((link) => {
            if (link.href === "/provider/dashboard/company-profile") {
              return (
                <li key={link.href} className={activePath === link.href ? "active" : ""}>
                  <a href={link.href} onClick={handleCompanyClick}>
                    {link.label}
                  </a>
                </li>
              );
            }

            return (
              <li key={link.href} className={activePath === link.href ? "active" : ""}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default SidebarProvider;