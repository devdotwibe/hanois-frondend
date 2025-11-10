"use client";
import React, { useState, useMemo } from "react";
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

  const fetchProvider = async (id: number) => {
    const endpoint = `${API_URL.replace(/\/+$/, "")}/providers/${id}`;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) return;

    const data = await res.json();
    let provider: Provider | null = null;
    if (data?.data?.provider) provider = data.data.provider;
    else if (data?.provider) provider = data.provider;
    else if (data?.data?.id) provider = data.data;
    else if (data?.id) provider = data;

    if (provider) setProviderData(provider);
  };

  useMemo(() => {
    const id = getProviderId();
    setProviderId(id);
    if (id) fetchProvider(id);
  }, []);

  // Always render immediately (even if data is not yet fetched)
  return (
    <div>
      <HouseCard
        providerId={providerId ?? 0}
        name={providerData?.name ?? ""}
        initialDescription={providerData?.professional_headline ?? ""}
        initialImagePath={providerData?.image ?? null}
      />
    </div>
  );
};

export default HouseOuter;
