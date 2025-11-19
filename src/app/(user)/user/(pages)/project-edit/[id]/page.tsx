"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import Image from "next/image";
import arrow from "../../../../../../../public/images/left-arrow.svg";

const EditProjectPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/users/project/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const data = await res.json();

      if (res.ok && data.data?.project) {
        setProject(data.data.project);
      }

      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  // Update local project state
  const updateField = (e: any) => {
    const { name, value } = e.target;
    setProject((prev: any) => ({ ...prev, [name]: value }));
  };

  // SAVE UPDATES
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Clean object before sending to API
    const cleanProject = { ...project };

    delete cleanProject.category;
    delete cleanProject.luxury_level_details;
    delete cleanProject.service_list;
    delete cleanProject.created_at;
    delete cleanProject.status;
    delete cleanProject.id;
    delete cleanProject.user_id;

    const res = await fetch(`${API_URL}/users/project/${id}`, {
      method: "PUT",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanProject),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/user/project-details/${id}`);
    } else {
      alert(data.error || "Failed to update project");
    }
  };

  return (
    <div className="details-intro">

      {/* HEADER */}
      <div className="det-intro1">
        <button onClick={() => router.back()}>
          <Image src={arrow} alt="back" width={40} height={40} />
        </button>

        <h2>Edit – {project.title}</h2>
      </div>

      {/* TABS */}
      <ul className="tab-nav1">
        <li><span className="tab-btn">Proposals</span></li>
        <li><span className="tab-btn active">Edit Details</span></li>
      </ul>

      {/* FORM */}
      <form className="details-card" onSubmit={handleUpdate}>

        <h3 className="project-title">Edit Project</h3>
        <p className="project-status">{project.listing_style}</p>

        {/* TITLE */}
        <label className="section-title">Title</label>
        <input
          className="forminput"
          name="title"
          value={project.title}
          onChange={updateField}
        />

        {/* NOTES */}
        <label className="section-title">Brief</label>
        <textarea
          className="brief-text"
          name="notes"
          value={project.notes}
          onChange={updateField}
        />

        {/* META */}
        <div className="project-meta">

          {/* PROJECT TYPE */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Type</strong></div>
            <input
              name="project_type"
              value={project.project_type}
              onChange={updateField}
              className="forminput"
            />
          </div>

          {/* LOCATION */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Location</strong></div>
            <input
              name="location"
              value={project.location}
              onChange={updateField}
              className="forminput"
            />
          </div>

          {/* LAND SIZE */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Land size</strong></div>
            <input
              name="land_size"
              value={project.land_size}
              onChange={updateField}
              className="forminput"
            />
          </div>

          {/* LUXURY LEVEL NAME (READ ONLY) */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Luxury level</strong></div>
            <input
              className="forminput"
              value={project.luxury_level_details?.name || ""}
              readOnly
            />
          </div>

          {/* SERVICES (DISPLAY NAMES ONLY) */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Services</strong></div>

            <input
              className="forminput"
              value={project.service_list?.map(s => s.name).join(", ") || ""}
              readOnly
            />
          </div>

          {/* BASEMENT */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Basement</strong></div>
            <select
              name="basement"
              value={project.basement}
              onChange={updateField}
              className="forminput"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

        </div>

        <button className="create-btn invite-btn" type="submit">
          Save Changes
        </button>

      </form>
    </div>
  );
};

export default EditProjectPage;
