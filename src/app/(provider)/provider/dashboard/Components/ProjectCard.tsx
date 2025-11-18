"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

import Image from "next/image";
import img1 from "../../../../../../public/images/profile.png"

interface ProjectCardProps {
  title: string;
  user: string;
  services: string;
  luxury: string;
  landSize: string;
  location: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  user,
  services,
  luxury,
  landSize,
  location,
  description,
}) => {


        const [openPopup, setOpenPopup] = useState(false);

  return (

    <div className="project-card1">
      <div className="project-inner1">

        <div className="project-header">
        <div>
          <h3 className="project-title">{title}</h3>
          <p className="project-user">{user}</p>
        </div>
        <button className="details-btn" onClick={() => setOpenPopup(true)}>Details</button>
      </div>

      <div className="project-info">
        <div className="info-left">
          <p>
            <strong>Services</strong> {services}
          </p>
          <p>
            <strong>Luxury type</strong> {luxury}
          </p>
        </div>

        <div className="info-right">
          <p>
            <strong>Land size</strong> {landSize}
          </p>
          <p>
            <strong>Location</strong> {location}
          </p>
        </div>
      </div>

      <div className="project-desc">
        <p>
          <strong>Short Description:</strong>
        </p>
        <p>{description}</p>
      </div>

      </div>




       {openPopup &&
       createPortal(

        <div className="modal-overlay proposal-popup lead-popup public-poup" onClick={() => setOpenPopup(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setOpenPopup(false)}>
                </button>
            <div className="proposal-box">
              {/* Header Section */}
              <div className="proposal-header">
                <Image
                  src={img1}
                  alt="Nilson Todd"
                  width={70}
                  height={70}
                  className="proposal-logo"
                />
                <div className="proposal-info">
                  <h3>Nilson Todd</h3>
                  <p>nillson.ni@gmaim.com</p>
                  <p>+1 (866) 580-2168</p>
                </div>

                <div className="lead-btn">

                  <Link href="/" className="proposal-view ">Add to Leads <span>free of charge</span></Link>
                  <Link href="/" className="proposal-view hidden">View proposal</Link>

                </div>








              </div>

              {/* Details Section */}
              <div className="proposal-details lead-details">

                <h4>Project Details<span>Private</span> </h4>

                <h5>Building a house from the scratch</h5>
                <h5>About the project:</h5>

                <div className="cont-lead">
                  <p>American Home Improvement, Inc. – it is our mission to provide the highest quality of service in all aspects of our business. We are extremely thorough in the services that we provide and aim to be very receptive to any client’s issues, questions or concerns and handle them promptly and professionally.</p>
                </div>




                <div className="detail-row">

                  <div className="detail-col11">
                    <p><span>Type</span></p>
                  </div>
                  <div className="detail-col11">
                       <p>Housing</p>
                  </div>
                </div>

                <div className="detail-row">
                    <div className="detail-col11">
                    <p><span>Location</span></p>
                  </div>
                  <div className="detail-col11">
                    <p>New York</p>
                  </div>

                </div>

                <div className="detail-row">
                    <div className="detail-col11">
                    <p><span>Land size</span></p>
                  </div>
                  <div className="detail-col11">
                       <p>56 m2</p>
                  </div>
                </div>

                <div className="detail-row">
                    <div className="detail-col11">
                    <p><span>Luxury level</span></p>
                  </div>
                  <div className="detail-col11">
                       <p>Basic</p>
                  </div>
                </div>

                <div className="detail-row">
                    <div className="detail-col11">
                    <p><span>Basement</span></p>
                  </div>
                  <div className="detail-col11">
                       <p>Basement</p>
                  </div>
                </div>














              </div>







            </div>

                  </div>
                </div>
                 ,
                document.body








      )}




    </div>
  );
};

export default ProjectCard;
