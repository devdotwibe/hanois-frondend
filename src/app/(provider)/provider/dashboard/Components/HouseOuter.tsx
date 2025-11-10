"use client";
import React from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

type Provider = {
  id: number;
  name?: string;
  image?: string | null;
  professional_headline?: string | null;
  // ...other provider fields if needed
};

const parseJson = (s: string | null): any | null => {
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token: string | null): any | null => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    // atob for base64 decode in browser env
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // pad base64 if required
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const getProviderFromLocal = (): { providerId: number | null; providerData: Provider | null } => {
  if (typeof window === "undefined") {
    return { providerId: null, providerData: null };
  }

  // 1) try to get 'user' object from localStorage first
  const userRaw = localStorage.getItem("user");
  const user = parseJson(userRaw);

  if (user) {
    const id = Number(user?.id ?? user?.provider_id ?? user?.user_id) || null;
    if (!id) return { providerId: null, providerData: null };

    // If `user` contains provider-like fields, use them directly.
    const provider: Provider = {
      id,
      name: user?.name ?? user?.full_name ?? undefined,
      image: user?.image ?? user?.avatar ?? null,
      professional_headline: user?.professional_headline ?? user?.headline ?? null,
    };

    return { providerId: id, providerData: provider };
  }

  // 2) fallback: try to decode `token` (JWT)
  const token = localStorage.getItem("token");
  const payload = decodeJwtPayload(token);
  const idFromToken = Number(payload?.provider_id ?? payload?.id ?? payload?.user_id) || null;

  if (!idFromToken) {
    return { providerId: null, providerData: null };
  }

  // token rarely contains full provider profile — return minimal provider with id only
  const providerFromToken: Provider = {
    id: idFromToken,
    // if token contains name/other fields, prefer those
    name: payload?.name ?? payload?.full_name ?? undefined,
    image: payload?.image ?? null,
    professional_headline: payload?.professional_headline ?? null,
  };

  return { providerId: idFromToken, providerData: providerFromToken };
};

const HouseOuter: React.FC = () => {
  const { providerId, providerData } = getProviderFromLocal();

  // if we don't have an id or any provider data synchronously available, render nothing
  if (!providerId || !providerData) return null;

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
