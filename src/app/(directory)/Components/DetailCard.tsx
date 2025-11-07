


"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

type DetailCardProps = {
  logo: string | StaticImageData; 
  name: string;
  description?: string;
};

const DetailCard: React.FC<DetailCardProps> = ({ logo, name, description }) => {
  return (
    <div className="house-card detail-card">

        
   
      <div className="house-card-logo">

        <div className="h-logodiv">
             <Image
          src={logo}
          alt={`${name} logo`}
          width={180}
          height={128}
          className="house-card-img"
        />

        </div>
       
      </div>

     
      <div className="house-card-info">


        <div className="outline-row">
             <div className="outline-items">

            <p>Architecture</p>

        </div>

        <div className="outline-items">

            <p>Interior</p>

        </div>

        </div>

       



        <h2 className="house-card-title">{name}</h2>
        {description && <p className="house-card-desc">{description}</p>}

      </div>
    </div>
  );
};

export default DetailCard;
