"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";

const HouseOuter: React.FC = () => {
  const [providerData, setProviderData] = useState<any>(null);

  useEffect(() => {
    let providerId: number | null = null;
    let data: any = null;

    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      providerId = Number(parsed?.id || parsed?.provider_id || parsed?.user_id) || null;
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        const base64 = token.split(".")[1];
        const payload = JSON.parse(atob(base64));
        providerId = Number(payload?.provider_id || payload?.id || payload?.user_id) || null;
      }
    }

    if (providerId) {
      const cached = localStorage.getItem(`provider_${providerId}`);
      if (cached) data = JSON.parse(cached);
    }

    if (data) setProviderData(data);
  }, []);

  if (!providerData) return null;

  return (
    <div>
      <HouseCard
        providerId={providerData.id}
        name={providerData.name || ""}
        initialDescription={providerData.professional_headline || ""}
        initialImagePath={providerData.image || null}
      />
    </div>
  );
};

export default HouseOuter;
