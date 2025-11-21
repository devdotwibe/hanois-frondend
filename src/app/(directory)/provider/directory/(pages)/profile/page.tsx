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

  // 🟩 Fetch project details
  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects/${id}`);
      if (res.data.success) {
        setProject(res.data.data.project);
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProjectDetails();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!project) return <p style={{ textAlign: "center" }}>Project not found.</p>;

  const coverImage =
    project.images?.find((img) => img.is_cover)?.image_path || "";
  const otherImages = project.images?.filter((img) => !img.is_cover) || [];

  return (
    <div>
      <div className="containers-limit detcol profile-page">
        <div className="detcol-1">
          <button className="back-bth" onClick={() => router.back()}>
            <Image src={img2} alt="Back" width={40} height={40} />
          </button>

          {/* 🟩 Cover Image */}
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

          <div className="project-details detailed">
            <h2 className="project-title">{project.title}</h2>
            <p className="project-type">{project.project_type_name}</p>

            <h3 className="about-title">About</h3>
            <p className="about-text">{project.notes}</p>
          </div>

          {/* 🟩 Other Images */}
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

        <div className="detcol-2 after-update">

          <div className="after-update-1">
             <div className="status-card">
            <div className="project-card">
            <button
  className="send-btn"
  onClick={() => router.push(`/provider/dashboard/edit-project?id=${project?.id}`)}
>
  Edit
</button>

            </div>
          </div>

          <div className="proj-details">
            <h3 className="scope-title">Project Details</h3>

            <div className="proj-grid e-grid">


              <div className="proj-grid2">
                <div className="proj-col1">
                  <p>
                    <strong>Location</strong>
                  </p>
                  <p>{project.location}</p>
                </div>


              </div>

              <div className="proj-grid2">
                <div className="proj-col1">
                  <p>
                    <strong>Style</strong>
                  </p>
                  <p>{project.design_name}</p>
                </div>

              </div>



              <div className="proj-grid2">
                <div className="proj-col1">
                  <p>
                    <strong>Type</strong>
                  </p>
                  <p>{project.project_type_name}</p>
                </div>


              </div>

              <div className="proj-grid2">
                <div className="proj-col1">
                  <p>
                    <strong>Space Size</strong>
                  </p>
                <p>{project.land_size} m²</p>

                </div>


              </div>



            </div>
          </div>


          </div>






        </div>
      </div>
    </div>
  );
};

export default Page;
