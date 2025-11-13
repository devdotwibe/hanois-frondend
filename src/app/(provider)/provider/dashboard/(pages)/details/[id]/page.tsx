"use client";
import React, { useEffect, useState } from "react";
import BusinessInfo from '@/app/(directory)/provider/Components/BusinessInfo';
import DetailIntro from '@/app/(directory)/provider/Components/DetailIntro';
import StatusCard from '@/app/(directory)/provider/Components/StatusCard';
import AboutContainer from '@/app/(directory)/provider/directory/Components/AboutContainer';
import ServiceDiv from '@/app/(directory)/provider/directory/Components/ServiceDiv';
import TorranceSlider from '@/app/(directory)/provider/directory/Components/TorranceSlider';
import { useParams } from "next/navigation";
import { API_URL } from "@/config";

export default function DetailsPage() {
  const params = useParams(); 
  
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   const [providerId, setproviderId] = useState(params?.id);

  useEffect(() => {
    if (!providerId) {
      setError("No providerId provided in URL.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProvider = async () => {
      try {

        const token = localStorage.getItem("token");

        if (!token) {
          if (isMounted) {
            setError("Access token is required");
            setLoading(false);
          }
          return;
        }

        const res = await fetch(`${API_URL}providers/${providerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {

          if (isMounted) setError(data?.error || `Failed to fetch provider (${res.status})`);
        } else {
          if (isMounted) setProvider(data?.provider ?? data ?? null);
        }
      } catch (err) {

        if (isMounted) setError(`Error loading provider: ${String(err)}`);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProvider();

    return () => { isMounted = false; };
    
  }, [providerId]);

  if (loading) return <div>Loading provider...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!provider) return <div>No provider data found.</div>;

  return (
    <div className="detcoldetail">
      <div className='detcol'>
        <div className="detcol-1">
          <DetailIntro provider={provider} />
          <AboutContainer provider={provider} />
          <BusinessInfo provider={provider} />
          <ServiceDiv provider={provider} />
        </div>

        <div className="detcol-2 after-edit">
          <StatusCard />
        </div>
      </div>

      <div className="">
        <TorranceSlider />
      </div>
    </div>
  );
}
