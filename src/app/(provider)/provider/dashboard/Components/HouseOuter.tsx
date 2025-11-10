"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

type Provider = {
  id: number;
  name?: string;
  image?: string | null;
  professional_headline?: string | null;
  // ...other provider fields if you want
};

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | null>(null);
  const [providerData, setProviderData] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // determine providerId from localStorage / token (same logic you had)
  useEffect(() => {
    try {
      let id: number | null = null;
      const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userData) {
        const parsed = JSON.parse(userData);
        id = Number(parsed?.id ?? parsed?.provider_id ?? parsed?.user_id ?? null) || null;
      } else {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          try {
            const base64 = token.split(".")[1];
            const payload = JSON.parse(atob(base64));
            id = Number(payload?.provider_id ?? payload?.id ?? payload?.user_id ?? null) || null;
          } catch (e) {
            // malformed token or no numeric id — ignore
          }
        }
      }
      setProviderId(id);
    } catch (e) {
      // ignore
      setProviderId(null);
    }
  }, []);

  // fetch provider from API (no cache)
  useEffect(() => {
    if (!providerId) return;

    const fetchProvider = async () => {
      setLoading(true);
      setError(null);

      // prefer the canonical providers endpoint
      const endpoint = `${API_URL.replace(/\/+$/, "")}/providers/${providerId}`;

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      try {
        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to fetch provider (${res.status})`);
        }

        const data = await res.json();

        // normalize response shapes like you did in HouseCard
        let provider: Provider | null = null;
        if (data?.data?.provider) provider = data.data.provider;
        else if (data?.provider) provider = data.provider;
        else if (data?.data && typeof data.data === "object" && data.data.id) provider = data.data;
        else if (data?.id) provider = data;
        else provider = null;

        if (provider) {
          setProviderData(provider);
        } else {
          setError("Unexpected provider response shape");
        }
      } catch (err: any) {
        console.error("Fetch provider error", err);
        setError(err?.message ?? "Failed to load provider");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  // show nothing if we have no provider id
  if (!providerId) return null;

  // optional: show loading or error states (you can change to whatever UI you want)
  if (loading && !providerData) {
    return <div>Loading provider...</div>;
  }
  if (error && !providerData) {
    return <div>Error loading provider: {error}</div>;
  }

  if (!providerData) return null;

  return (
    <div>
      <HouseCard
        providerId={providerId}
        name={providerData.name ?? ""}
        initialDescription={providerData.professional_headline ?? ""}
        initialImagePath={providerData.image ?? null}
      />
    </div>
  );
};

export default HouseOuter;
