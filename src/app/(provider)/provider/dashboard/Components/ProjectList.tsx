"use client";

import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { API_URL } from "@/config";

interface ItemType {
  id: number;
  name: string;
}

interface ProjectItem {
  id: number;
  title: string;
  notes: string;
  services: number | string;
  luxury_level: number | string;
  land_size: string;
  location: string;
  listing_style: string;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [categories, setCategories] = useState<ItemType[]>([]);
  const [servicesList, setServicesList] = useState<ItemType[]>([]);
  const [designLevels, setDesignLevels] = useState<ItemType[]>([]);

  const loadMeta = async () => {
    try {
      const [catRes, servRes, desRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/design`)
      ]);

      setCategories(await catRes.json());
      setServicesList(await servRes.json());
      setDesignLevels(await desRes.json());
    } catch (err) {
      console.error("Error loading dropdown lists", err);
    }
  };

const loadProjects = async () => {
  try {
    const res = await fetch(`${API_URL}/users/public-project`);
    const data = await res.json();

    if (Array.isArray(data)) {
      setProjects(data);
    } else if (data.success && Array.isArray(data.projects)) {
      setProjects(data.projects);
    } else {
      console.error("Unexpected response:", data);
    }
  } catch (err) {
    console.error("Error fetching public projects:", err);
  }
};


  useEffect(() => {
    loadMeta();
    loadProjects();
  }, []);

  const getServiceName = (id: string | number) => {
    const found = servicesList.find(s => s.id === Number(id));
    return found?.name || "";
  };

  const getDesignName = (id: string | number) => {
    const found = designLevels.find(d => d.id === Number(id));
    return found?.name || "";
  };

  return (
    <div className="wrapper-inputpublic">
      <div className="form-grp wrap-select">
        <input type="text" placeholder="Search" />
      </div>

      <div className="listing-div">
        {projects.map((item) => (
          <ProjectCard
            key={item.id}
            title={item.title}
            user={"User"}
            services={getServiceName(item.services)}
            luxury={getDesignName(item.luxury_level)}
            landSize={item.land_size}
            location={item.location}
            description={item.notes || ""}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
