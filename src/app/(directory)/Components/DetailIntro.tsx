"use client";

import React, { useEffect, useState } from "react";
import DetailCard from "@/app/(directory)/Components/DetailCard";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/config";

const DEFAULT_LOGO = "/images/default-logo.png"; // fallback if no image

const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  let base = API_URL.replace(/\/+$/, "");
  base = base.replace(/\/api\/api$/i, "/api");
  base = base.replace(/\/api$/i, "/api");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};

const DetailIntro = () => {
  const searchParams = useSearchParams();
  const providerId = searchParams?.get("providerId");

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(Boolean(providerId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!providerId) {
      setError("No providerId provided in URL.");
      setLoading(false);
      return;
    }

    const fetchProvider = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}providers/${providerId}`);
        const body = await res.json();
        if (!res.ok) {
          throw new Error(body?.error || body?.message || "Failed to fetch provider");
        }
        const pv = body?.provider ?? body;
        setProvider(pv);
      } catch (err) {
        console.error("Error fetching provider:", err);
        setError(err.message || "Error fetching provider");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  // Loading / error states
  if (loading) {
    return <div className="detail-page-intro">Loading provider…</div>;
  }

  if (error) {
    return <div className="detail-page-intro">Error: {error}</div>;
  }

  if (!provider) {
    return <div className="detail-page-intro">No provider data found.</div>;
  }

  const logoSrc = provider.image ? resolveImageUrl(provider.image) : DEFAULT_LOGO;
  const description = provider.professional_headline ?? provider.service ?? provider.notes ?? "";

  return (
    <div className="detail-page-intro">
      <div>
        <DetailCard
          logo={logoSrc}
          name={provider.name || "No name"}
          description={description}
        />
      </div>
    </div>
  );
};

export default DetailIntro;
