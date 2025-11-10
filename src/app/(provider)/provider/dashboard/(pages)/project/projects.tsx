"use client";
import React, { useState } from "react";
import img1 from "../../../../../../public/images/property-img.jpg";
import TorranceCard from "../../Components/TorranceCard";
import UploadBox from "../../Components/UploadBox";

const ProjectComponent = () => {
  const [showProjects, setShowProjects] = useState(true);

  const projects = [
    {
      id: 1,
      image: img1,
      category: "Housing",
      title: "Torrance 2 modern bathroom remodel",
      description:
        "Beautiful gold accents to compliment all the white tile, and a master terrace",
      styleType: "Modern",
      spaceSize: "56 m²",
      location: "New York",
    },
    {
      id: 2,
      image: img1,
      category: "Commercial",
      title: "Complete home remodeling",
      description:
        "3/4 bath with beautiful gold accents to compliment all the white tile, and a master bath terrace",
      styleType: "Modern",
      spaceSize: "56 m²",
      location: "New York",
    },
    {
      id: 3,
      image: img1,
      category: "Housing",
      title: "Torrance 2 modern bathroom remodel",
      description:
        "Beautiful gold accents to compliment all the white tile, and a master terrace",
      styleType: "Modern",
      spaceSize: "56 m²",
      location: "New York",
    },
  ];

  const handleAddClick = () => {
    setShowProjects(false);
  };

  return (
    <div className="project-component">
      <button className="add-proj" onClick={handleAddClick}>
        <span className="icon">+</span> Add Project
      </button>

      <div className={`all-proj ${!showProjects ? "hide" : ""}`}>
        <div className="torrance-div">
          {projects.map((proj) => (
            <TorranceCard
              key={proj.id}
              image={proj.image}
              category={proj.category}
              title={proj.title}
              description={proj.description}
              styleType={proj.styleType}
              spaceSize={proj.spaceSize}
              location={proj.location}
            />
          ))}
        </div>

        <div className="add-projects">
            <UploadBox />

        </div>




      </div>
    </div>
  );
};

export default ProjectComponent;
