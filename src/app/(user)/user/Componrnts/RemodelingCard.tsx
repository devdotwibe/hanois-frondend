"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import moreoptions from "../../../../../public/images/more-options-icon.svg";

type RemodelingCardProps = {
  id: number;
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  proposal?: string;
  className?: string;
}

const RemodelingCard: React.FC<RemodelingCardProps> = ({
  id,
  title,
  description,
  date,
  place,
  proposal,
  className = "",
}) => {

  const router = useRouter();

  return (
    <div
      className={`remodeling-card ${className}`}
      onClick={() => router.push(`/user/project-details/${id}`)}
      style={{ cursor: "pointer" }}
    >

      <div className="remodel-div1">
        <h4 className={title === "Private" ? "text-private" : ""}>
          {title}
        </h4>

        <button onClick={(e) => e.stopPropagation()}>
          <Image 
            src={moreoptions}
            alt="more"
            width={20}
            height={20}
            className="more-option-btn"
          />
        </button>
      </div>

      <h5>{description}</h5>

      <div className="remodel-div2">

        <div className="remodel-col1">
          <div className="re-col1"><p><span>Date added</span></p></div>
          <div className="re-col1"><p><span>{date}</span></p></div>
        </div>

        <div className="remodel-col1">
          <div className="re-col1"><p><span>Location</span></p></div>
          <div className="re-col1"><p><span>{place}</span></p></div>
        </div>

      </div>

      <div className="proposals">
        <p>{proposal}</p>
      </div>

    </div>
  );
};

export default RemodelingCard;
