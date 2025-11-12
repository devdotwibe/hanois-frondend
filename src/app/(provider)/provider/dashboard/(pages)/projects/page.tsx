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

  // 🟩 Fetch only this provider’s projects
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

  // 🟩 Load projects on mount
  useEffect(() => {
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
            {/* 🟩 Map through projects to dynamically render DetailCard */}
            {projects.map((proj) => {
              const coverImgObj =
                proj.images?.find((img) => img.is_cover) || proj.images?.[0];
              const imageUrl = coverImgObj
                ? `${IMG_URL}${coverImgObj.image_path}`
                : "/images/property-img.jpg";

              return (
                <div key={proj.id} className="project-detail-card">
                  {/* Render the DetailCard dynamically with project data */}
                  <DetailCard
                    logo={imageUrl}  // Assuming logo or cover image is used as the "logo"
                    name={proj.title}  // Assuming the project title is used as the "name"
                    description={proj.notes}  // Assuming the project notes are the description
                  />

                  {/* Optionally, render additional project-specific details */}
                  <TorranceCard
                    id={proj.id}
                    image={imageUrl}
                    category={proj.project_type_name || "Unknown"}
                    title={proj.title}
                    description={proj.notes}
                    styleType={proj.design_name || "—"}
                    spaceSize={proj.land_size || "—"}
                    location={proj.location || "—"}
                  />
                </div>
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
