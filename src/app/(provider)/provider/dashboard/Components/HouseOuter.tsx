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

const getProviderId = (): number | null => {
  let id: number | null = null;

  const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  if (userData) {
    const parsed = JSON.parse(userData);
    id = Number(parsed?.id ?? parsed?.provider_id ?? parsed?.user_id ?? null) || null;
  } else {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      const base64 = token.split(".")[1];
      const payload = JSON.parse(atob(base64));
      id = Number(payload?.provider_id ?? payload?.id ?? payload?.user_id ?? null) || null;
    }
  }

  return id;
};

const fetchProvider = async (providerId: number, token: string | null): Promise<Provider | null> => {
  const endpoint = `${API_URL.replace(/\/+$/, "")}/providers/${providerId}`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) return null;

  const data = await res.json();

  if (data?.data?.provider) return data.data.provider;
  if (data?.provider) return data.provider;
  if (data?.data && typeof data.data === "object" && data.data.id) return data.data;
  if (data?.id) return data;

  return null;
};

const HouseOuter: React.FC = () => {
  const [providerId] = useState<number | null>(getProviderId());
  const [providerData, setProviderData] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoadProvider = async () => {
    if (!providerId) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const provider = await fetchProvider(providerId, token);

    if (provider) {
      setProviderData(provider);
      localStorage.setItem(`provider_${provider.id}`, JSON.stringify(provider));
      setError(null);
    } else {
      setError("Failed to fetch provider");
    }
  };

  if (!providerId) return <div>No provider ID found.</div>;

  return (
    <div>
      {!providerData && !error && (
        <button onClick={handleLoadProvider} className="px-4 py-2 bg-blue-500 text-white rounded">
          Load Provider
        </button>
      )}

      {error && <div>Error: {error}</div>}

      {providerData && (
        <HouseCard
          providerId={providerId}
          name={providerData.name ?? ""}
          initialDescription={providerData.professional_headline ?? ""}
          initialImagePath={providerData.image ?? null}
        />
      )}
    </div>
  );
};

export default HouseOuter;
