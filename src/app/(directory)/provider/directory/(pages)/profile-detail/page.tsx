"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_URL, IMG_URL } from "@/config";
import img2 from "../../../../../../../public/images/left-arrow.svg";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // 👈 get id from URL

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]); // 🟩 all projects for dropdown

  // 🟩 Fetch single project
  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects/${id}`);
      if (res.data.success) setProject(res.data.data.project);
    } catch (err) {
      console.error("Error fetching project details:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Fetch all projects for dropdown
  const fetchAllProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      if (res.data.success) setAllProjects(res.data.data.projects || []);
    } catch (err) {
      console.error("Error fetching all projects:", err);
    }
  };

  // 🟩 Fetch data on load
  useEffect(() => {
    if (id) fetchProjectDetails();
    fetchAllProjects();
  }, [id]);

  // 🟩 Handle project selection → redirect
  const handleProjectSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      router.push(`/provider/directory/profile-detail?id=${selectedId}`);
    }
  };

  // 🟩 Loading or error states
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!project) return <p style={{ textAlign: "center" }}>Project not found.</p>;

  const coverImage =
    project.images?.find((img) => img.is_cover)?.image_path || "";
  const otherImages = project.images?.filter((img) => !img.is_cover) || [];

  return (
    <div className="containers-limit detcol profile-page">
      {/* ====================== LEFT SECTION ====================== */}
      <div className="detcol-1">
        {/* 🔙 Back Button */}
        <button className="back-bth" onClick={() => router.back()}>
          <Image src={img2} alt="Back" width={40} height={40} />
        </button>

        {/* 🖼️ Cover Image */}
        {coverImage && (
          <div className="prov-pro-img">
            <Image
              src={`${IMG_URL}${coverImage}`}
              alt="Project Cover"
              width={600}
              height={400}
              className="project-img"
            />
          </div>
        )}

        {/* 🧾 Project Info */}
        <div className="project-details">
          <h2 className="project-title">{project.title}</h2>
          <p className="project-type">{project.project_type_name}</p>

          <h3 className="about-title">About</h3>
          <p className="about-text">{project.notes}</p>
        </div>

        {/* 🖼️ Additional Images */}
        {otherImages.map((img) => (
          <div key={img.id} className="prov-pro-img">
            <Image
              src={`${IMG_URL}${img.image_path}`}
              alt="Project Image"
              width={700}
              height={500}
              className="project-img"
            />
          </div>
        ))}
      </div>

      {/* ====================== RIGHT SIDEBAR ====================== */}
      <div className="detcol-2">
        {/* 🧩 Status Section */}
        <div className="status-card">
          <h3 className="scope-title">Status</h3>
          <p style={{ color: "#555", fontWeight: "500", marginBottom: "10px" }}>
            American House Improvements Inc.
          </p>

          <label
            htmlFor="projectSelect"
            style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}
          >
            Select Project
          </label>

          {/* 🟩 Dynamic Dropdown with Auto Redirect */}
          <select
            id="projectSelect"
            onChange={handleProjectSelect}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              marginBottom: "15px",
            }}
            value={id || ""}
          >
            <option value="">-- Select a Project --</option>
            {allProjects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.title}
              </option>
            ))}
          </select>

          <p
            style={{
              marginTop: "10px",
              textAlign: "center",
              color: "#2b52ff",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() => router.push("/provider/dashboard/add-project")}
          >
            Add New Project
          </p>
        </div>

        {/* 🧩 Scope Section */}
        <div className="scope-card">
          <h3 className="scope-title">Scope</h3>
          <div className="scope-items">
            {[
              "Architecture and Interior Design",
              "Landscape Design",
              "Building Engineering",
            ].map((scope, i) => (
              <div
                key={i}
                style={{
                  background: "#f8f9fb",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                {scope}
              </div>
            ))}
          </div>
        </div>

        {/* 🧩 Project Details Section */}
        <div className="proj-details">
          <h3 className="scope-title">Project Details</h3>

          <div className="proj-grid">
            <div className="proj-grid2">
              <div className="proj-col1">
                <p><strong>Location</strong></p>
                <p>{project.location}</p>
              </div>

              <div className="proj-col1">
                <p><strong>Style</strong></p>
                <p>{project.design_name}</p>
              </div>
            </div>

            <div className="proj-grid2">
              <div className="proj-col1">
                <p><strong>Type</strong></p>
                <p>{project.project_type_name}</p>
              </div>

              <div className="proj-col1">
                <p><strong>Space Size</strong></p>
                <p>{project.land_size}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
