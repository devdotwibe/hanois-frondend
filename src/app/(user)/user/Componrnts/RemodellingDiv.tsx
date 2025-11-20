"use client";

import React, { useEffect, useState } from "react";
import RemodelingCard from "./RemodelingCard";
import { API_URL } from "@/config";

type Project = {
  id: number;
  title: string | null;
  notes: string | null;
  project_type: number | null;
  location: string | null;
  land_size: string | null;
  luxury_level: number | null;
  services: number | null;
  construction_budget: string | null;
  basement: string | null;
  listing_style: string | null;
  created_at: string;
};

const RemodellingDiv = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/users/my-projects`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        });

        const data: Project[] = await res.json();
        setProjects(data);

      } catch (err) {
        console.error("Error loading projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="remodeling-div">

      {projects && projects.length > 0  && projects?.map((item: any) => (
        <RemodelingCard
          key={item.id}
            id={item.id}    
          title={item.listing_style === "public" ? "Public" : "Private"} 
          description={item.title || ""}
          date={new Date(item.created_at).toLocaleDateString()}
          place={item.location || "N/A"}
        proposal={`${item?.proposals?.length || 0} proposals`}

          className={"featured-card"} 
        />
      ))}
    </div>
  );
};

export default RemodellingDiv;
