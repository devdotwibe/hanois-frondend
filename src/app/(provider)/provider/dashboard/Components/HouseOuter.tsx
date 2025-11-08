"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";

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
    return JSON.parse(atob(parts[1]));
  } catch (e) {
    console.warn("parseJwtPayload failed:", e);
    return null;
  }
};

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | undefined>(undefined);
  const [providerData, setProviderData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawUser = localStorage.getItem("user");
    const parsedUser = safeParse<any>(rawUser);

    let id: number | null = null;
    if (parsedUser) {
      id = Number(parsedUser?.id ?? parsedUser?.provider_id ?? parsedUser?.user_id ?? null) || null;
      console.log("HouseOuter: parsed user object found, provider id candidate:", id);
    } else {
      const rawToken = localStorage.getItem("token");
      const payload = parseJwtPayload(rawToken);
      if (payload) {
        id = Number(payload?.provider_id ?? payload?.id ?? payload?.user_id ?? null) || null;
        console.log("HouseOuter: parsed token payload, provider id candidate:", id);
      } else {
        console.log("HouseOuter: no user or token found in localStorage");
      }
    }

    console.log("HouseOuter: final provider id to set:", id);
    if (id) {
      setProviderId(id);
    } else {
      setProviderId(undefined);
      setProviderData(null);
    }
  }, []);

  useEffect(() => {
    if (!providerId) return;

    console.log("HouseOuter: providerId state changed ->", providerId);

    const controller = new AbortController();
    const signal = controller.signal;

    const cached = safeParse<any>(localStorage.getItem(`provider_${providerId}`));
    if (cached) {
      console.log(`HouseOuter: using cached provider_${providerId}`, cached);
      setProviderData(cached);
      // optionally still refresh in background
      return;
    }

    const fetchProvider = async () => {
      setLoading(true);
      setError(null);
      console.log(`HouseOuter: fetching provider from API for id ${providerId}...`);

      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = { "Accept": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `https://hanois.dotwibe.com/api/api/providers/${providerId}`,
          { method: "GET", headers, signal }
        );

        console.log("HouseOuter: fetch response status", res.status, res.statusText);

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Fetch failed: ${res.status} ${res.statusText} ${text}`);
        }

        const data = await res.json();
        console.log("HouseOuter: provider data received", data);
        setProviderData(data);

        try {
          localStorage.setItem(`provider_${providerId}`, JSON.stringify(data));
          console.log(`HouseOuter: cached provider_${providerId} in localStorage`);
        } catch (e) {
          console.warn("Could not cache provider data", e);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("HouseOuter: fetch aborted");
        } else {
          console.warn("Failed to fetch provider:", err);
          setError(err.message ?? String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();

    return () => {
      controller.abort();
    };
  }, [providerId]);

  return (
    <div>
      {loading && <div style={{ marginBottom: 8 }}>Loading provider…</div>}
      {error && <div style={{ color: "red", marginBottom: 8 }}>Provider load error: {error}</div>}

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
