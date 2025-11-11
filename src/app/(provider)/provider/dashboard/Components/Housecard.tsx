"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

type HouseCardProps = {
  logo: string | StaticImageData; 
  name: string;
  description?: string;
};

const Housecard: React.FC<HouseCardProps> = ({ logo, name, description }) => {
  return (
    <div className="house-card">
      {/* Left: Logo */}
      <div className="house-card-logo">
        <Image
          src={logo}
          alt={`${name} logo`}
          width={128}
          height={128}
          className="house-card-img"
        />
      </div>

      {/* Right: Details */}
      <div className="house-card-info">
        <h2 className="house-card-title">{name}</h2>
        {description && <p className="house-card-desc">{description}</p>}

        <button className="house-card-btn">Upload New Image</button>
      </div>
    </div>
  );
};

export default Housecard;
