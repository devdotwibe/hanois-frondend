"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

const safeParse = <T,>(str: string | null): T | null => {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    console.warn("safeParse failed:", e, str);
    return null;
  }
};

const parseJwtPayload = (token: string | null): any | null => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    // atob is available in the browser
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (e) {
    console.warn("parseJwtPayload failed:", e);
    return null;
  }
};

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | undefined>(undefined);
  const [providerData, setProviderData] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1) Try saved user object
    const rawUser = localStorage.getItem("user");
    const parsedUser = safeParse<any>(rawUser);

    let id: number | null = null;
    if (parsedUser) {
      id = Number(parsedUser?.id ?? parsedUser?.provider_id ?? parsedUser?.user_id ?? null) || null;
    } else {
      // 2) Try token (JWT)
      const rawToken = localStorage.getItem("token");
      const payload = parseJwtPayload(rawToken);
      if (payload) {
        id = Number(payload?.provider_id ?? payload?.id ?? payload?.user_id ?? null) || null;
      }
    }

    if (id) {
      setProviderId(id);
      // 3) Try cached provider data
      const cached = localStorage.getItem(`provider_${id}`);
      const parsedCached = safeParse<any>(cached);
      if (parsedCached) {
        setProviderData(parsedCached);
      } else {
        // Optionally fetch fresh data from API if no cache (uncomment if you want)
        /*
        const token = localStorage.getItem("token");
        fetch(`${API_URL}/providers/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
          .then(res => res.ok ? res.json() : Promise.reject(res))
          .then(data => {
            setProviderData(data);
            try { localStorage.setItem(`provider_${id}`, JSON.stringify(data)); } catch (e) { console.warn("Could not cache provider data", e); }
          })
          .catch(err => console.warn("Failed to fetch provider:", err));
        */
      }
    } else {
      // no provider id found
      setProviderId(undefined);
      setProviderData(null);
    }
  }, []);

  return (
    <div>
      <HouseCard
        providerId={providerId}
        name={providerData?.name ?? "Provider"}
        initialDescription={providerData?.professional_headline ?? ""}
        initialImagePath={providerData?.image ?? null}
      />
    </div>
  );
};

export default HouseOuter;
