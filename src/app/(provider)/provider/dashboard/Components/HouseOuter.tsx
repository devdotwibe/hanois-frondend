"use client";
import React from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

const HouseOuter: React.FC = () => {
  let providerId: number | null = null;
  let providerData: any = null;

  try {
    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userData) {
      const parsed = JSON.parse(userData);
      providerId = Number(parsed?.id ?? parsed?.provider_id ?? parsed?.user_id ?? null) || null;
    } else {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const base64 = token.split(".")[1];
        const payload = JSON.parse(atob(base64));
        providerId = Number(payload?.provider_id ?? payload?.id ?? payload?.user_id ?? null) || null;
      }
    }

    if (providerId) {
      const cached = localStorage.getItem(`provider_${providerId}`);
      if (cached) providerData = JSON.parse(cached);
    }
  } catch (e) {
    // defensive: if localStorage/parsing fails, keep providerId/providerData null
    console.warn("HouseOuter: localstorage parse error", e);
  }

  // Always render. If we don't have provider info, pass nulls/defaults to HouseCard.
  return (
    <div>
      <HouseCard
        providerId={providerId ?? undefined}
        name={providerData?.name ?? "Provider"}
        initialDescription={providerData?.professional_headline ?? ""}
        initialImagePath={providerData?.image ?? null}
      />
    </div>
  );
};

export default HouseOuter;
