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
  const providerId = params?.id; // no need to keep as state unless you plan to change it

  // Provider state
  const [provider, setProvider] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categories state (moved to top-level)
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories once on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}categories`);
        if (!res.ok) {
          // optionally handle status
          return;
        }
        const data = await res.json();
        if (isMounted) setCategories(data || []);
      } catch (err) {
        // swallow or set a non-fatal error (categories not critical)
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  // Fetch provider when providerId changes
  useEffect(() => {
    if (!providerId) {
      setError("No providerId provided in URL.");
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchProvider = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
          <DetailIntro provider={provider} categories={categories} />
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
