"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import DetailsIntro from "../../../Componrnts/DetailsIntro";
import BudjectCalculator from "../../../Componrnts/BudjectCalculator";
import EditCard from "@/app/(provider)/provider/dashboard/Components/EditCard";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/users/project/${id}`);
        const data = await res.json();
        console.log("Fetched project data:", data);

        if (res.ok && data.data?.project) {
          setProject(data.data.project);
        } else {
          setProject(null);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="project-details">
      <div className="proj-det1">
        <DetailsIntro project={project} />
        <BudjectCalculator project={project} />
      </div>

      <div className="proj-det2">
        <EditCard project={project} />
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
