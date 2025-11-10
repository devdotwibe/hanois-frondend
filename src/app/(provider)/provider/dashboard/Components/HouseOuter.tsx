"use client";
import React from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

const HouseOuter: React.FC = () => {
  let providerId: number | null = null;
  let providerData: any = null;

  const userData = localStorage.getItem("user");
  if (userData) {
    const parsed = JSON.parse(userData);
    providerId = Number(parsed?.id || parsed?.provider_id || parsed?.user_id);
  } else {
    const token = localStorage.getItem("token");
    if (token) {
      const base64 = token.split(".")[1];
      const payload = JSON.parse(atob(base64));
      providerId = Number(payload?.provider_id || payload?.id || payload?.user_id);
    }
  }

  if (providerId) {
    const cached = localStorage.getItem(`provider_${providerId}`);
    if (cached) providerData = JSON.parse(cached);
  }

  if (!providerId || !providerData) return null;

  return (
    <div>
      <HouseCard
        providerId={providerId}
        name={providerData.name || ""}
        initialDescription={providerData.professional_headline || ""}
        initialImagePath={providerData.image || null}
      />
    </div>
  );
};

export default HouseOuter;
