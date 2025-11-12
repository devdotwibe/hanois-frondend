"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL, IMG_URL, SITE_URL } from "@/config";
import DetailCard from "@/app/(directory)/provider/Components/DetailCard";
import TabBtns from "../../Components/TabBtns";
import TorranceCard from "../../Components/TorranceCard";
import UploadBox from "../../Components/UploadBox";

const ProjectComponent = () => {
  const [projects, setProjects] = useState([]);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 🟩 Fetch provider details based on the providerId from the URL
  const fetchProviderData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const providerId = user?.id || user?.provider_id;

      if (!providerId) {
        setError("No provider ID found. Please log in again.");
        setLoading(false);
        return;
      }

      // Try cached data first
      const cacheKey = `provider_${providerId}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached && !forceRefresh) {
        const cachedData = JSON.parse(cached);
        setProvider(cachedData);
        setLoading(false);
        return; // Stop here, use cached version
      }

      // Otherwise, fetch fresh data
      const res = await fetch(`${API_URL}providers/${encodeURIComponent(providerId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error || `Failed to fetch provider (${res.status})`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const providerData = data?.provider || null;

      setProvider(providerData);

      // Save to cache
      if (providerData) {
        localStorage.setItem(cacheKey, JSON.stringify(providerData));
      }

    } catch (err) {
      console.error("Error fetching provider data:", err);
      setError("Failed to load provider data.");
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Fetch provider projects (same as before)
  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const providerId = user?.id || user?.provider_id;

      if (!providerId) {
        setError("No provider ID found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/projects?provider_id=${providerId}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data?.data?.projects || []);
      } else {
        setError("Failed to fetch projects.");
      }
    } catch (err) {
      console.error("Error fetching provider projects:", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Load data when the component mounts
  useEffect(() => {
    fetchProviderData();
    fetchProjects();
  }, []);

  // 🟩 Handle Add Project button
  const handleAddClick = () => {
    const base = (SITE_URL || "").replace(/\/+$/, "");
    const target = `/provider/dashboard/add-project`;
    router.push(target);
  };

  return (
    <div className="project-component">
      {/* 🟩 Dynamic DetailCard */}
      {loading ? (
        <p>Loading provider and projects...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        provider && (
          <DetailCard
            logo={provider?.image ? `${IMG_URL}${provider.image}` : "/path/to/logo.png"} // Use provider's image with IMG_URL
            name={provider?.name || "Unknown Provider"} // Use provider's name
            description={provider?.notes || provider?.service_notes || provider?.professional_headline || "No description available"} // Description from provider
          />
        )
      )}

      <TabBtns />

      {/* 🟩 Add Project Button */}
      <button className="add-proj" onClick={handleAddClick}>
        <span className="icon">+</span> Add Project
      </button>

      {/* 🟩 Projects Section */}
      <div className="all-proj">
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>Loading projects...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : projects.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No projects found. Please add one.
          </p>
        ) : (
          <div className="torrance-div">
            {projects.map((proj) => {
              const coverImgObj =
                proj.images?.find((img) => img.is_cover) || proj.images?.[0];
              const imageUrl = coverImgObj
                ? `${IMG_URL}${coverImgObj.image_path}`
                : "/images/property-img.jpg"; // Default placeholder image

              return (
                <TorranceCard
                  key={proj.id}
                  id={proj.id}
                  image={imageUrl}
                  category={proj.project_type_name || "Unknown"}
                  title={proj.title}
                  description={proj.notes}
                  styleType={proj.design_name || "—"}
                  spaceSize={proj.land_size || "—"}
                  location={proj.location || "—"}
                />
              );
            })}
          </div>
        )}

        {/* 🟩 Add Project Form */}
        <div className="add-projects">
          <UploadBox />
        </div>
      </div>
    </div>
  );
};

export default ProjectComponent;
