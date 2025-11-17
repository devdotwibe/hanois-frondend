"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_URL, IMG_URL, SITE_URL } from "@/config";
import DetailCard from "@/app/(directory)/provider/Components/DetailCard";
import TabBtns from "../../Components/TabBtns";
import TorranceCard from "../../Components/TorranceCard";
import UploadBox from "../../Components/UploadBox";

const ProjectComponent = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Provider state for dynamic DetailCard
  const [provider, setProvider] = useState<any | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [providerError, setProviderError] = useState<string | null>(null);

  // Categories state (for DetailCard dynamic categories)
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 🟩 Fetch only this provider’s projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");
      const providerId = user?.id || user?.provider_id;

      if (!providerId) {
        setError("No provider ID found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/projects?provider_id=${providerId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data && res.data.success) {
        setProjects(res.data.data.projects || []);
      } else {
        setError("Failed to fetch your projects.");
      }
    } catch (err) {
      console.error("Error fetching provider projects:", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Fetch provider details (with simple caching)
  const fetchProviderData = async (forceRefresh = false) => {
    try {
      setLoadingProvider(true);
      setProviderError(null);

      const user = JSON.parse(localStorage.getItem("user") || "null");
      const tokenLocal = localStorage.getItem("token");
      const id = user?.id || user?.provider_id;

      if (!id) {
        setProviderError("No provider ID found. Please log in again.");
        setLoadingProvider(false);
        return;
      }

      const cacheKey = `provider_${id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached && !forceRefresh) {
        try {
          const cachedData = JSON.parse(cached);
          setProvider(cachedData);
          setLoadingProvider(false);
          return;
        } catch (e) {
          console.warn("Failed to parse cached provider, fetching fresh.", e);
        }
      }

      const res = await fetch(`${API_URL}providers/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(tokenLocal && { Authorization: `Bearer ${tokenLocal}` }),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setProviderError(body?.error || `Failed to fetch provider (${res.status})`);
        setLoadingProvider(false);
        return;
      }

      const data = await res.json();
      const providerData = data?.provider || null;
      setProvider(providerData);

      if (providerData) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(providerData));
        } catch (e) {
          console.warn("Failed to cache provider data:", e);
        }
      }
    } catch (err) {
      console.error("Error fetching provider data:", err);
      setProviderError("Failed to load provider data.");
    } finally {
      setLoadingProvider(false);
    }
  };

  // 🟩 Fetch categories once
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch(`${API_URL}categories`);
      if (!res.ok) {
        console.warn("Failed to load categories:", res.status);
        setCategories([]);
        return;
      }
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // 🟩 Load provider, projects and categories on mount
  useEffect(() => {
    fetchProviderData();
    fetchProjects();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🟩 Handle Add Project button
  const handleAddClick = () => {
    const base = (SITE_URL || "").replace(/\/+$/, "");
    const target = `/provider/dashboard/add-project`;
    router.push(target);
  };

  // Helper to build logo (supports absolute URLs)
  const buildLogoUrl = (img?: string) => {
    if (!img) return "/path/to/logo.png";
    if (/^https?:\/\//i.test(img)) return img;
    const cleanBase = (IMG_URL || "").replace(/\/+$/, "");
    const cleanPath = img.replace(/^\/+/, "");
    return `${cleanBase}/${cleanPath}`;
  };

  return (
    <div className="project-component">
      {/* Dynamic DetailCard */}
      {loadingProvider ? (
        <p>Loading provider...</p>
      ) : providerError ? (
        <p style={{ color: "red" }}>{providerError}</p>
      ) : provider ? (
        <DetailCard
          logo={buildLogoUrl(provider?.image)}
          name={provider?.name || "Unknown Provider"}
          description={provider?.professional_headline || ""}
          categories={categories}
          providerCategories={provider?.categories_id || []}
        />
      ) : (
        <DetailCard
          logo="/path/to/logo.png"
          name="Unknown Provider"
          categories={categories}
          providerCategories={[]}
        />
      )}

      <TabBtns />

      {/* 🟩 Add Button */}
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
            {projects.map((proj: any) => {
              const coverImgObj =
                proj.images?.find((img: any) => img.is_cover) || proj.images?.[0];
              const imageUrl = coverImgObj
                ? `${IMG_URL}${coverImgObj.image_path}`
                : "/images/property-img.jpg";

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
