import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectList = () => {
  const data = [
    {
      title: "Kitchen Redesign",
      user: "Katy Minoug",
      services: "Architectural Services / Construction",
      luxury: "Modern, Futurism, Classic",
      landSize: "201 m²",
      location: "Kuwait",
      description:
        "I need help with redesign and renovation my old kitchen top and some floor works will be a great addition. I’m seeking for someone experienced in renovation and have some relevant project with are done.",
    },
    {
      title: "Kitchen Redesign",
      user: "Katy Minoug",
      services: "Architectural Services / Construction",
      luxury: "Modern, Futurism, Classic",
      landSize: "201 m²",
      location: "Kuwait",
      description:
        "I need help with redesign and renovation my old kitchen top and some floor works will be a great addition. I’m seeking for someone experienced in renovation and have some relevant project with are done.",
    },
  ];

  return (
    <div>

        <div className="form-grp wrap-select">
        <input
          type="text"
          placeholder="Search"
          className=""
         
        
        />
      </div>



      <div className="listing-div">

          {data.map((item, idx) => (
        <ProjectCard key={idx} {...item} />
      ))}

      </div>




    



    </div>
  );
};

export default ProjectList;
