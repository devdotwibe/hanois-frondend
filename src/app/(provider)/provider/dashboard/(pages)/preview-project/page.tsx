"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMG_URL } from "@/config";
import img2 from "../../../../../../../public/images/left-arrow.svg";

const PreviewProjectPage = () => {
  const router = useRouter();
  const [data, setData] = useState(null);

  // Load preview data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("projectPreview");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      router.back();
    }
  }, []);

  if (!data) return <p style={{ textAlign: "center" }}>Loading preview...</p>;

  // Extract images
  const coverImage = data.images?.find((img) => img.isCover)?.url;
  const otherImages = data.images?.filter((img) => !img.isCover);

  return (
    <div className="containers-limit detcol profile-page">
      <div className="detcol-1">
        
        {/* Back Button */}
        <button className="back-bth" onClick={() => router.back()}>
          <Image src={img2} alt="Back" width={40} height={40} />
        </button>

        {/* Cover Image */}
        {coverImage && (
          <div className="prov-pro-img">
            <img
              src={coverImage}
              alt="Cover Preview"
              style={{
                width: "100%",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

        {/* Text Details */}
        <div className="project-details detailed">
          <h2 className="project-title">{data.title}</h2>
          <p className="project-type">{data.projectType}</p>

          <h3 className="about-title">About</h3>
          <p className="about-text">{data.notes}</p>
        </div>

        {/* Other Images */}
        {otherImages?.map((img, index) => (
          <div key={index} className="prov-pro-img">
            <img
              src={img.url}
              alt="Preview Image"
              style={{
                width: "100%",
                borderRadius: "10px",
              }}
            />
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="detcol-2 after-update">
        <div className="proj-details">
          <h3 className="scope-title">Project Details</h3>

          <div className="proj-grid e-grid">

            <div className="proj-grid2">
              <div className="proj-col1">
                <p><strong>Location</strong></p>
                <p>{data.location}</p>
              </div>
            </div>

            <div className="proj-grid2">
              <div className="proj-col1">
                <p><strong>Style</strong></p>
                <p>{data.designStyle}</p>
              </div>
            </div>

            <div className="proj-grid2">
              <div className="proj-col1">
                <p><strong>Type</strong></p>
                <p>{data.projectType}</p>
              </div>
            </div>

            <div className="proj-grid2">
              <div className="proj-col1">
                <p><strong>Space Size</strong></p>
                <p>{data.landSize} m²</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default PreviewProjectPage;
