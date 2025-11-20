"use client";
import React from "react";
import Image from "next/image";
import arrow from "../../../../../public/images/left-arrow.svg";
import Link from "next/link";

const DetailsIntro = ({ project }: any) => {

  return (
    <div className="details-intro">

      <div className="det-intro1">

        {/* BACK TO DASHBOARD */}
        <Link href="/user/dashboard">
          <Image 
            src={arrow}
            alt="back"
            width={40}
            height={40}
            style={{ cursor: "pointer" }}
          />
        </Link>

        <h2>{project.title}</h2>
      </div>

      <ul className="tab-nav1">
        <li><Link href="/user/Proposals" className="tab-btn">Proposals</Link></li>
        <li>
          <Link 
            href={`/user/project-details/${project.id}`} 
            className="tab-btn active"
          >
            Project Details
          </Link>
        </li>
      </ul>

      <div className="details-card">

        <h3 className="project-title">{project.title}</h3>
        <p className="project-status">{project.listing_style}</p>

        <h4 className="section-title">Brief</h4>
        <p className="brief-text">{project.notes}</p>

        <div className="project-meta">

          {/* TYPE */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Type</strong></div>
            {project.category?.name || project.project_type}
          </div>

          {/* LOCATION */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Location</strong></div>
            {project.location}
          </div>

          {/* LAND SIZE */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Land size</strong></div>
            {project.land_size}
          </div>

          {/* LUXURY LEVEL */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Luxury level</strong></div>
            {project.luxury_level_details?.name || project.luxury_level}
          </div>

          {/* SERVICES */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Services</strong></div>
            {project.service_list?.map(s => s.name).join(", ") || "—"}
          </div>

          {/* BASEMENT */}
          <div className="proj-meta1">
            <div className="proj-metacol"><strong>Basement</strong></div>
            {project.basement === "yes" ? "Yes" : "No"}
          </div>

        </div>
      </div>

    </div>
  );
};

export default DetailsIntro;
