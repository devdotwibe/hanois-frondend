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
    // company-profile will be handled specially on click
    { href: "/provider/dashboard/company-profile", label: "Company Profile" },
    { href: "/provider/dashboard/paymentandbilling", label: "Payment And Billing" },
    { href: "/provider/dashboard/public-projects", label: "Public Projects" },
  ];

  // normalize function: remove query string and trailing slashes
  const normalize = (p) => {
    if (!p) return "";
    const noQuery = p.split("?")[0];
    return noQuery.replace(/\/+$/, "") || "/";
  };

  // check active by normalization and startsWith (so subroutes count as active)
  const isActive = (linkHref) => {
    const np = normalize(pathname);
    const nh = normalize(linkHref);
    if (nh === "/") return np === "/";
    return np === nh || np.startsWith(nh + "/") || np === nh;
  };

  // Mandatory provider fields to check:
  // name, categories (array or categories_id), phone, location, team_size,
  // notes, service_id/services, service_notes
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
    const serviceNotesOk = Boolean(provider.service_notes && String(provider.service_notes).trim());

    return nameOk && categoriesOk && phoneOk && locationOk && teamOk && notesOk && servicesOk && serviceNotesOk;
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
    // prevent default Link navigation
    e?.preventDefault?.();
    if (checking) return; // avoid double click

    const providerId = getProviderIdFromStorage();
    const token = localStorage.getItem("token");

    if (!providerId) {
      // nothing to check - go to edit page to let them create/enter details
      router.push("/provider/dashboard/company-profile");
      return;
    }

    // if no token, still try to go to edit page (or redirect to login if you prefer)
    if (!token) {
      // You can choose to router.push('/login') here instead
      router.push(`/provider/dashboard/company-profile?providerId=${encodeURIComponent(providerId)}`);
      return;
    }

    setChecking(true);
    try {
      const res = await fetch(`${API_URL}providers/${encodeURIComponent(providerId)}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // If we can't fetch provider, send to company-profile for editing
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
      // fallback to edit page
      router.push(`/provider/dashboard/company-profile?providerId=${encodeURIComponent(providerId)}`);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="outr">
      <ul className="sidebarul">
        {links.map((link) => {
          const active = isActive(link.href) ? "active" : "";

          // render company profile link with click handler (use Link so pathname updates consistently)
          if (link.href === "/provider/dashboard/company-profile") {
            return (
              <li key={link.href} className={active}>
                <Link href={link.href} onClick={handleCompanyClick}>
                  <span style={{ cursor: checking ? "wait" : "pointer" }}>
                    {checking ? "Checking..." : link.label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={link.href} className={active}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarProvider;
