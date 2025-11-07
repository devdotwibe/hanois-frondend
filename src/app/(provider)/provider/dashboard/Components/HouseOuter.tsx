"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | null>(null);
  const [providerData, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviderData = async () => {
      try {
        // 1️⃣ Get provider ID
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

        // 2️⃣ Load cached data
        const cached = localStorage.getItem(`provider_${id}`);
        if (cached) {
          setProviderData(JSON.parse(cached));
          setLoading(false);
        }

        // 3️⃣ Fetch fresh data for the logged-in provider
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
      } finally {
        setLoading(false);
      }
    };

    loadProviderData();
  }, []);

  if (loading) return null; // or show a loader
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
