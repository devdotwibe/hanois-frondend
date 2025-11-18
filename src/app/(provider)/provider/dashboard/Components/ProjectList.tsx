"use client";

import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { API_URL } from "@/config";

interface ServiceItem {
  id: number;
  name: string;
}

interface CategoryItem {
  id: number;
  name: string;
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profile_image: string | null;
}


interface LuxuryLevelDetails {
  id: number;
  name: string;
  quality: number;
  cost: number;
  rate: number;
}


interface ProjectItem {
  id: number;
  user_id: number;
  title: string;
  notes: string | null;
  project_type: number | null;
  location: string | null;
  land_size: string;
  luxury_level_details?: LuxuryLevelDetails | null;
  luxury_level: number | null;
  service_ids: number[] | null;
  basement: string | null;
  listing_style: string;
  build_area: number | null;
  cost_finsh: number | null;
  suggest_cost: number | null;
  total_cost: number | null;
  status: string | null;

  user: UserItem | null;
  category: CategoryItem | null;
  service_list: ServiceItem[];
  
}

const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [leadIds, setLeadIds] = useState<number[]>([]);

  /** 🔹 Load provider lead work_ids */
  const loadLeadIds = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/providers/lead-work-ids`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setLeadIds(data.workIds || []);
      }
    } catch (err) {
      console.error("Error loading lead IDs:", err);
    }
  };

  /** 🔹 Load public projects */
  const loadProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/users/public-project`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (err) {
      console.error("Error fetching public projects:", err);
    }
  };

  useEffect(() => {
    loadProjects();
    loadLeadIds();
  }, []);

  return (
    <div className="wrapper-inputpublic">
      <div className="form-grp wrap-select">
        <input type="text" placeholder="Search" />
      </div>

      <div className="listing-div">
        {projects
          .filter((item) => !leadIds.includes(item.id)) // 🔥 filter leads
          .map((item) => (
            <ProjectCard
              id={item.id}
              key={item.id}
              title={item.title}
              user={item.user?.name || "Unknown User"}
              services={item.service_list?.map((s) => s.name).join(", ")}
              luxury={item.luxury_level_details?.name || "N/A"}  
              landSize={item.land_size}
              location={item.location || "N/A"}
              description={item.notes || ""}
              listingStyle={item.listing_style}
              basement={item.basement || "N/A"}
              typeName={item.category?.name || "N/A"}
              serviceNames={item.service_list?.map((s) => s.name) || []}
              email={item.user?.email}
              phone={item.user?.phone || ""}
              profileImage={item.user?.profile_image || ""}
            />
          ))}
      </div>
    </div>
  );
};

export default ProjectList;
