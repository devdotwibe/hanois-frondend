"use client";
import React from "react";
import HouseCard from "./HouseCard";

const API_URL = "https://hanois.dotwibe.com/api/api/";

const HouseOuter: React.FC = () => {
  let providerId: number | null = null;

  if (typeof window !== "undefined") {
    try {
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
    } catch (err) {
      console.error("Error getting provider ID:", err);
    }
  }

  // If no user logged in, render nothing
  if (!providerId) return null;

  // Load cached provider data if available
  const cachedData =
    typeof window !== "undefined"
      ? localStorage.getItem(`provider_${providerId}`)
      : null;

  let providerData: any = cachedData ? JSON.parse(cachedData) : null;

  // Fetch in background to refresh cache
  if (typeof window !== "undefined" && !providerData) {
    (async () => {
      try {
        const res = await fetch(`${API_URL}providers`);
        const json = await res.json();
        if (json?.success) {
          const match = json.data.providers.find((p: any) => p.id === providerId);
          if (match) {
            localStorage.setItem(`provider_${providerId}`, JSON.stringify(match));
          }
        }
      } catch (err) {
        console.error("Failed to fetch provider data:", err);
      }
    })();
  }

  // Don’t render anything until real data is present
  if (!providerData) return null;

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
