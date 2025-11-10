"use client";
import React, { useState } from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

type Provider = {
  id: number;
  name?: string;
  image?: string | null;
  professional_headline?: string | null;
};

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | null>(null);
  const [providerData, setProviderData] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // determine providerId from localStorage / token
  const getProviderId = (): number | null => {
    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userData) {
      const parsed = JSON.parse(userData);
      return Number(parsed?.id ?? parsed?.provider_id ?? parsed?.user_id ?? null) || null;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      const base64 = token.split(".")[1];
      const payload = JSON.parse(atob(base64));
      return Number(payload?.provider_id ?? payload?.id ?? payload?.user_id ?? null) || null;
    }

    return null;
  };

  // fetch provider from API
  const fetchProvider = async (id: number) => {
    setLoading(true);
    setError(null);

    const endpoint = `${API_URL.replace(/\/+$/, "")}/providers/${id}`;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

    let provider: Provider | null = null;
    if (data?.data?.provider) provider = data.data.provider;
    else if (data?.provider) provider = data.provider;
    else if (data?.data && typeof data.data === "object" && data.data.id) provider = data.data;
    else if (data?.id) provider = data;
    else provider = null;

    if (!provider) throw new Error("Unexpected provider response shape");

    setProviderData(provider);
  };

  // main logic (synchronous flow)
  React.useMemo(() => {
    const id = getProviderId();
    setProviderId(id);

    if (!id) return;

    fetchProvider(id).catch((err) => {
      setError(err.message || "Failed to load provider");
      setLoading(false);
    });
  }, []);

  if (!providerId) return null;
  if (loading && !providerData) return <div>Loading provider...</div>;
  if (error && !providerData) return <div>Error loading provider: {error}</div>;
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
