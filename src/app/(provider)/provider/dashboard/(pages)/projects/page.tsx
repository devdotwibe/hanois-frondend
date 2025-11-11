"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_URL, IMG_URL, SITE_URL } from "@/config";
// import HouseOuter from "../../Components/HouseOuter";
import TabBtns from "../../Components/TabBtns";
import TorranceCard from "../../Components/TorranceCard";
import UploadBox from "../../Components/UploadBox";
import DetailCard from "@/app/(directory)/Components/DetailCard";

const ProjectComponent = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null); // <-- provider state
  const router = useRouter();

  // 🟩 Fetch projects from API
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      if (res.data && res.data.success) {
        setProjects(res.data.data.projects || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Fetch provider info (dynamic DetailCard)
  const fetchProvider = async (providerId, token) => {
    if (!providerId) return;
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // Use the same endpoint style you provided
      const res = await fetch(`${API_URL}providers/${encodeURIComponent(providerId)}`, {
        method: "GET",
        headers, // client fetch - next.revalidate not included (client-side)
      });

      if (!res.ok) {
        console.warn("Provider fetch failed:", res.status);
        return;
      }

      const data = await res.json().catch(() => null);
      // API shape in your example returns { provider: {...} } or provider directly
      const fetchedProvider = data?.provider ?? data ?? null;
      if (fetchedProvider) {
        setProvider(fetchedProvider);
      }
    } catch (err) {
      console.error("Error fetching provider:", err);
    }
  };

  // 🟩 Load projects and provider on mount
  useEffect(() => {
    fetchProjects();

    // read provider id and token from localStorage (same pattern you used elsewhere)
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const providerId = user?.id || null;
      if (providerId) {
        fetchProvider(providerId, token);
      }
    } catch (err) {
      console.error("Error reading localStorage for provider info:", err);
    }
  }, []);

  // 🟩 Handle Add Project button
  const handleAddClick = () => {
    const base = (SITE_URL || "").replace(/\/+$/, "");
    const target = `${base}/provider/dashboard/add-project`;
    router.push(target);
  };

  // helper to build provider logo like DetailIntro
  const buildProviderLogo = (prov) => {
    const fallback = "/images/ahi-logo.jpg";
    if (!prov) return fallback;
    if (prov.image) {
      if (/^https?:\/\//i.test(prov.image)) {
        return prov.image;
      } else {
        const cleanBase = (IMG_URL || "").replace(/\/+$/, "");
        const cleanPath = prov.image.replace(/^\/+/, "");
        return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
      }
    }
    return fallback;
  };

  // if provider exists use provider data; otherwise fall back to generic text
  const detailLogo = buildProviderLogo(provider);
  const detailName = provider?.name || "Projects";
  const detailDesc =
    provider?.notes ||
    provider?.service_notes ||
    provider?.professional_headline ||
    "Your uploaded projects are listed below.";

  return (
    <div className="project-component">
      {/* Dynamic DetailCard using provider when available */}
      <DetailCard logo={detailLogo} name={detailName} description={detailDesc} />

      <TabBtns />

      {/* 🟩 Add Button */}
      <button className="add-proj" onClick={handleAddClick}>
        <span className="icon">+</span> Add Project
      </button>

      {/* 🟩 Projects Section */}
      <div className={`all-proj ${!showProjects ? "hide" : ""}`}>
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
              // 🟩 Find cover image dynamically
              const coverImgObj =
                proj.images?.find((img) => img.is_cover) || proj.images?.[0];
              const imageUrl = coverImgObj
                ? `${IMG_URL}${coverImgObj.image_path}`
                : "/images/property-img.jpg";

              return (
                <TorranceCard
                  key={proj.id}
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
