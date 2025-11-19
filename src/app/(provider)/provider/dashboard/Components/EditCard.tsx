"use client";
import React from "react";
import Link from "next/link";

const EditCard = ({ project }: any) => {
  return (
    <div className='editbtn-div'>
      <Link 
        href={`/user/project-edit/${project.id}`} 
        className='edit-details'
      >
        Edit
      </Link>
    </div>
  );
};

export default EditCard;
