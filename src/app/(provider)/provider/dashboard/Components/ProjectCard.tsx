"use client";
import React from "react";

interface ProjectCardProps {
  title: string;
  user: string;
  services: string;
  luxury: string;
  landSize: string;
  location: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  user,
  services,
  luxury,
  landSize,
  location,
  description,
}) => {
  return (
    <div className="project-card1">
      <div className="project-header">
        <div>
          <h3 className="project-title">{title}</h3>
          <p className="project-user">{user}</p>
        </div>
        <button className="details-btn">Details</button>
      </div>

      <div className="project-info">
        <div className="info-left">
          <p>
            <strong>Services</strong> {services}
          </p>
          <p>
            <strong>Luxury type</strong> {luxury}
          </p>
        </div>

        <div className="info-right">
          <p>
            <strong>Land size</strong> {landSize}
          </p>
          <p>
            <strong>Location</strong> {location}
          </p>
        </div>
      </div>

      <div className="project-desc">
        <p>
          <strong>Short Description:</strong>
        </p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
