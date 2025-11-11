"use client";

import React from 'react';
import { useRouter } from "next/navigation";

const SeekerCol = () => {
  const router = useRouter();

  const goToAddProject = () => {
    router.push("/user/add-project");
  };

  return (
    <div className="seeker-col1">

      <div className="proj-text">
        <h2>My Project</h2>
        <p>Here is the list of your projects, you can follow all updates of them</p>
      </div>

      <button
        className='new-proj'
        onClick={goToAddProject}
      >
        Add New Project
      </button>

    </div>
  )
}

export default SeekerCol;
