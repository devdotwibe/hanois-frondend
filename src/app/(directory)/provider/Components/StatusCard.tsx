"use client";

import React from "react";
import { useRouter } from "next/navigation";

const StatusCard = () => {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/provider/dashboard/company-profile");
  };

  const handleAddProject = () => {
    router.push("/provider/dashboard/add-project");
  };

  return (
    <div className="status-card">
      <div className="project-card">
        <button className="send-btn" onClick={handleEdit}>
          Edit
        </button>

        <button className="add-btn" onClick={handleAddProject}>
          Add New Project
        </button>
      </div>
    </div>
  );
};

export default StatusCard;
