"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config"; 

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | null>(null);
  const [providerData, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      if (!id) {
        setLoading(false);
        return;
      }

      setProviderId(id);

      // Load cached data
      const cached = localStorage.getItem(`provider_${id}`);
      if (cached) {
        setProviderData(JSON.parse(cached));
        setLoading(false);
      }

      // Fetch fresh data in background
      (async () => {
        try {
          const res = await fetch(`${API_URL}providers`);
          const json = await res.json();
          if (json?.success) {
            const match = json.data.providers.find((p: any) => p.id === id);
            if (match) {
              localStorage.setItem(`provider_${id}`, JSON.stringify(match));
              setProviderData(match);
            }
          }
        } catch (err) {
          console.error("Failed to fetch provider data:", err);
        } finally {
          setLoading(false);
        }
      })();
    } catch (err) {
      console.error("Error getting provider ID:", err);
      setLoading(false);
    }
  }, []);

  if (loading) return null; // or show a skeleton loader

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
