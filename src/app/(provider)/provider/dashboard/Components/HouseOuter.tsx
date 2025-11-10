"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | null>(null);
  const [providerData, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Determine provider ID (from localStorage or JWT)
  useEffect(() => {
    let id: number | null = null;

    const userData = localStorage.getItem("user");
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

    setProviderId(id || 0);
  }, []);

  // 🧠 Fetch provider info from API
  useEffect(() => {
    if (!providerId) return;

    const fetchProvider = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://hanois.dotwibe.com/api/api/providers/${providerId}`);
        if (!res.ok) throw new Error("Failed to load provider");
        const data = await res.json();

        // Handle both API formats (e.g. { data: {...} } or just {...})
        const provider = data?.data || data;
        setProviderData(provider);
        // Optionally cache in localStorage
        localStorage.setItem(`provider_${providerId}`, JSON.stringify(provider));
      } catch (err) {
        console.error("Error loading provider:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  if (loading) {
    return <p>Loading provider info...</p>;
  }

  // ✅ Always render even if no data
  return (
    <div>
      <HouseCard
        providerId={providerId || 0}
        name={providerData?.name || "Unnamed Provider"}
        initialDescription={providerData?.professional_headline || ""}
        initialImagePath={providerData?.image || null}
      />
    </div>
  );
};

export default HouseOuter;
