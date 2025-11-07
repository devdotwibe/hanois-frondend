"use client";
import React, { useState } from "react";
import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";
import { API_URL } from "@/config";

const HouseOuter = () => {
  // Lazy initialize state once when the component mounts (no useEffect needed)
  const [providerData, setProviderData] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      let id: number | null = null;

      if (userData) {
        const parsed = JSON.parse(userData);
        id = Number(parsed?.id || parsed?.provider_id || parsed?.user_id);
      } else {
        const token = localStorage.getItem("token");
        if (token) {
          const base64 = token.split(".")[1];
          const payload = JSON.parse(atob(base64));
          id = Number(payload?.provider_id || payload?.id || payload?.user_id);
        }
      }

      if (!id) return null;

      // Try cached data first
      const cached = localStorage.getItem(`provider_${id}`);
      if (cached) return JSON.parse(cached);

      // If not cached, try synchronous fetch (not ideal but avoids useEffect)
      // We’ll make it asynchronous-compatible using async IIFE
      (async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}providers/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const json = await res.json();
          if (json?.success && json?.data) {
            const provider = json.data.provider || json.data;
            localStorage.setItem(`provider_${id}`, JSON.stringify(provider));
            setProviderData(provider);
          }
        } catch (err) {
          console.error("Error fetching provider data:", err);
        }
      })();

      return null;
    } catch (err) {
      console.error("Error initializing provider data:", err);
      return null;
    }
  });

  if (!providerData)
    return (
      <div>
        <HouseCard
          logo={logo1}
          name="American House Improvements Inc."
          providerId={5}
          initialDescription="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
          initialImagePath="/uploads/1762501777711.jpg"
        />
      </div>
    );

  return (
    <div>
      <HouseCard
        providerId={providerData.id}
        name={providerData.name || "American House Improvements Inc."}
 initialDescription={providerData.professional_headline || ""}
        initialImagePath={providerData.image || null}      />
    </div>
  );
};

export default HouseOuter;
