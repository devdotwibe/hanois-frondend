"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import Image from "next/image";
import img1 from "../../../../../../public/images/profile.png";
import { IMG_URL } from "@/config";
import { API_URL } from "@/config";


interface ProjectCardProps {
   id: number;
  title: string;
  user: string;
  services: string;
  luxury: string;
  landSize: string;
  location: string;
  description: string;
  listingStyle?: string;
  basement?: string;
  serviceNames?: string[];
  typeName?: string;

  email?: string;
  phone?: string;
  profileImage?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
  title,
  user,
  services,
  luxury,
  landSize,
  location,
  description,
  listingStyle,
  basement,
  serviceNames,
  typeName,
  email,
  phone,
  profileImage
}) => {

  const [openPopup, setOpenPopup] = useState(false);

  // Build profile image URL
  let imageUrl: any = img1;
  if (profileImage) {
    if (/^https?:\/\//i.test(profileImage)) {
      imageUrl = profileImage;
    } else {
      const cleanBase = IMG_URL.replace(/\/+$/, "");
      const cleanPath = profileImage.replace(/^\/+/, "");
      imageUrl = `${cleanBase}/uploads/${cleanPath}`;
    }
  }

const handleAddToLeads = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}providers/add-lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ work_id: id })
    });

    const data = await res.json();
    console.log("Lead response:", data);

    // Redirect only if success
    if (data.success) {
      window.location.href = "/provider/dashboard";
    }

  } catch (err) {
    console.error("Error adding to leads:", err);
  }
};



  return (
    <div className="project-card1 e-public-card">
      <div className="project-inner1">

        {/* Header */}
        <div className="project-header">
          <div className="house-card">
            <h3 className="project-title">{title}</h3>
            <p className="project-user">{user}</p>
          </div>

<           div className="house-div3">
             <button className="details-btn" onClick={() => setOpenPopup(true)}>
              Details
             </button>

            </div>




        </div>

        {/* Info */}
        <div className="project-info">
          <div className="info-left">


            <div className="col-info3">

              <div className="col-info4">
                            <p><strong>Services</strong></p>


              </div>
              <div className="col-info4">
                            <p>{services}</p>


              </div>

            </div>


            <div className="col-info3">

              <div className="col-info4">
                            <p><strong>Luxury name</strong></p>


              </div>
              <div className="col-info4">
                            <p>{luxury}</p>


              </div>

            </div>










          </div>

          <div className="info-right">

             <div className="col-info3">

              <div className="col-info4">
                            <p><strong>Land size</strong></p>

              </div>
              <div className="col-info4">
                              <p>{landSize}</p>

              </div>

            </div>


             <div className="col-info3">

              <div className="col-info4">
                            <p><strong>Location</strong></p>

              </div>
              <div className="col-info4">
                            <p>{location}</p>

              </div>

            </div>






          </div>
        </div>

        {/* Short Description */}
        <div className="project-desc">
          <p><strong>Short Description:</strong></p>
          <p>{description}</p>



        </div>

      </div>

      {/* MODAL */}
      {openPopup &&
        createPortal(
          <div className="modal-overlay proposal-popup lead-popup public-poup" onClick={() => setOpenPopup(false)}>

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

              <button className="close-btn" onClick={() => setOpenPopup(false)}></button>

              <div className="proposal-box">

                {/* STATIC DESIGN — JUST DYNAMIC VALUES INSERTED */}
                <div className="proposal-header">

                  {/* Use normal <img> to avoid domain restrictions */}
                  <img
                    src={imageUrl}
                    alt={user}
                    width={70}
                    height={70}
                    className="proposal-logo"
                  />

                  <div className="proposal-info">
                    <h3>{user}</h3>
                    <p>{email || ""}</p>
                    <p>{phone || ""}</p>
                  </div>

                  <div className="lead-btn">
                  <button
                    className="proposal-view"
                    onClick={handleAddToLeads}
                  >
                    Add to Leads <span>free of charge</span>
                  </button>


                  </div>

                </div>

                {/* DETAILS SECTION */}
                <div className="proposal-details lead-details">

                  <h4>Project Details <span>{listingStyle || "Public"}</span></h4>

                  <h5>{title}</h5>
                  <h5>About the project:</h5>

                  <div className="cont-lead">
                    <p>{description}</p>
                  </div>

                  {/* TYPE */}
                  <div className="detail-row">
                    <div className="detail-col11"><p><span>Type</span></p></div>
                    <div className="detail-col11"><p>{typeName || "N/A"}</p></div>
                  </div>

                  {/* LOCATION */}
                  <div className="detail-row">
                    <div className="detail-col11"><p><span>Location</span></p></div>
                    <div className="detail-col11"><p>{location}</p></div>
                  </div>

                  {/* LAND SIZE */}
                  <div className="detail-row">
                    <div className="detail-col11"><p><span>Land size</span></p></div>
                    <div className="detail-col11"><p>{landSize}</p></div>
                  </div>

                  {/* LUXURY */}
                  <div className="detail-row">
                    <div className="detail-col11"><p><span>Luxury level</span></p></div>
                    <div className="detail-col11"><p>{luxury}</p></div>
                  </div>

                  {/* SERVICES */}
                  <div className="detail-row">
                    <div className="detail-col11"><p><span>Services</span></p></div>
                    <div className="detail-col11">
                      <p>{serviceNames?.length ? serviceNames.join(", ") : "N/A"}</p>
                    </div>
                  </div>

                  {/* BASEMENT */}
                  <div className="detail-row">
                    <div className="detail-col11"><p><span>Basement</span></p></div>
                    <div className="detail-col11"><p>{basement || "N/A"}</p></div>
                  </div>

                </div>

              </div>
            </div>

          </div>,
          document.body
        )
      }

    </div>
  );
};

export default ProjectCard;
