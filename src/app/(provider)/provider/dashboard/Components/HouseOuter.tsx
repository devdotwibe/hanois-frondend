"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import { API_URL } from "@/config";

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | null>(null);
  const [providerData, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // determine provider id (from local "user" or JWT token)
        const userData = localStorage.getItem("user");
        let id: number | null = null;

        if (userData) {
          const parsed = JSON.parse(userData);
          id = Number(parsed?.id || parsed?.provider_id || parsed?.user_id) || null;
        } else {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const base64 = token.split(".")[1];
              const payload = JSON.parse(atob(base64));
              id = Number(payload?.provider_id || payload?.id || payload?.user_id) || null;
            } catch (e) {
              // ignore token parse errors
              id = null;
            }
          }
        }

        if (!id) {
          setLoading(false);
          return;
        }

        setProviderId(id);

        // try cache first
        const cached = localStorage.getItem(`provider_${id}`);
        if (cached) {
          try {
            setProviderData(JSON.parse(cached));
          } catch (e) {
            // ignore parse error and continue to fetch fresh
          }
        }

        // fetch single provider by id (NOT the whole list)
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}providers/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });

          const json = await res.json();

          // support both shapes: { provider: {...} } or provider object directly
          const provider = json?.provider ?? json ?? null;

          if (provider) {
            localStorage.setItem(`provider_${id}`, JSON.stringify(provider));
            setProviderData(provider);
          } else {
            // If API returned success wrapper, try other common shapes
            if (json?.data?.provider) {
              localStorage.setItem(`provider_${id}`, JSON.stringify(json.data.provider));
              setProviderData(json.data.provider);
            }
          }
        } catch (err) {
          console.error("Failed to fetch provider data:", err);
        } finally {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error getting provider ID:", err);
        setLoading(false);
      }
    })();
  }, []);

  // keep original behavior: render nothing if still loading or no provider
  if (loading) return null;
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
