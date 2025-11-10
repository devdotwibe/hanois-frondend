"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

const HouseOuter: React.FC = () => {
  const [providerData, setProviderData] = useState<any>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      let providerId: number | null = null;

      // determine providerId from localStorage / token
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        providerId = Number(parsed?.id || parsed?.provider_id || parsed?.user_id) || null;
      } else {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const base64 = token.split(".")[1];
            const payload = JSON.parse(atob(base64));
            providerId = Number(payload?.provider_id || payload?.id || payload?.user_id) || null;
          } catch {}
        }
      }

      if (!providerId) return;

      try {
        const res = await fetch(`${API_URL.replace(/\/+$/, "")}/providers/${providerId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();

        let provider: any = data?.data?.provider || data?.provider || data?.data || data;
        setProviderData(provider);
      } catch (err) {
        console.error("Failed to fetch provider", err);
      }
    };

    fetchProvider();
  }, []);

  if (!providerData) return null;

  return (
    <div>
      <HouseCard
        providerId={providerData.id}
        name={providerData.name || ""}
        initialDescription={providerData.professional_headline || ""}
        initialImagePath={providerData.image || null}
      />
    </div>
  );
};

export default HouseOuter;
