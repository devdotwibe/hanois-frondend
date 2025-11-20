'use client';

import React, { useState } from "react";
import FilterBy from "./FilterBy";
import ProjectList from "./ProjectList";

interface ServiceItem {
  id: number;
  name: string;
}

const ProjectsPage = () => {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  return (
    <>
      <FilterBy selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
      <ProjectList selectedServices={selectedServices} />
    </>
  );
};

export default ProjectsPage;
