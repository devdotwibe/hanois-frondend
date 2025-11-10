// app/(directory)/provider/dashboard/details/page.jsx  (or wherever your Details2 component lives)
"use client";
import React, { useEffect, useState } from "react";
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import StatusCard from '@/app/(directory)/Components/StatusCard'
import AboutContainer from '@/app/(directory)/service-provider-directory/Components/AboutContainer'
import ServiceDiv from '@/app/(directory)/service-provider-directory/Components/ServiceDiv'
import TorranceSlider from '@/app/(directory)/service-provider-directory/Components/TorranceSlider'
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/config";

const Details2 = () => {
  const searchParams = useSearchParams();
  const providerId = searchParams?.get("providerId");
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(Boolean(providerId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!providerId) {
      setError("No providerId provided in URL.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchProvider = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}providers/${encodeURIComponent(providerId)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || body?.message || `Failed to fetch provider ${providerId}`);
        }
        const data = await res.json();
        const p = data?.provider ?? data ?? null;
        if (!cancelled) {
          setProvider(p);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load provider");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProvider();
    return () => { cancelled = true; };
  }, [providerId]);

  if (loading) {
    return <div className="loading">Loading provider details…</div>;
  }

  if (error) {
    return <div className="error" style={{ color: "red" }}>{error}</div>;
  }

  if (!provider) {
    return <div className="no-data">Provider not found.</div>;
  }

  return (
    <div className="detcoldetail">
      <div className='detcol'>
        <div className="detcol-1">
          <DetailIntro provider={provider} />

          <AboutContainer provider={provider} />

          <BusinessInfo provider={provider} />

          <ServiceDiv provider={provider} />
        </div>

        <div className="detcol-2">
          <StatusCard  />
        </div>
      </div>

      <div className="">
        <TorranceSlider  />
      </div>
    </div>
  );
};

export default Details2;
