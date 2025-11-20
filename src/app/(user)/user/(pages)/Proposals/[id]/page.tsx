"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import arrow from "../../../../../../../public/images/left-arrow.svg";
import Link from "next/link";
import { useParams } from "next/navigation";
import { API_URL } from "@/config";
import ProposalCard from "../../../Componrnts/ProposalCard";

const ProposalsPage = () => {
  const { id } = useParams(); // project ID from URL
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/users/project/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.data?.project) {
        setProject(data.data.project);
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="proposal-page">

      <div className="det-intro1">
        <button onClick={() => history.back()}>
          <Image src={arrow} alt="Back" width={40} height={40} />
        </button>
        <h2>{project.title}</h2>
      </div>

      <ul className="tab-nav1">
        <li>
          <Link href={`/user/Proposals/${project.id}`} className="tab-btn active">
            Proposals ({project.proposals?.length || 0})
          </Link>
        </li>

        <li>
          <Link href={`/user/project-details/${project.id}`} className="tab-btn">
            Project Details
          </Link>
        </li>
      </ul>

      {/* PASS PROPOSALS TO CARD */}
      <ProposalCard proposals={project.proposals || []} />
    </div>
  );
};

export default ProposalsPage;
