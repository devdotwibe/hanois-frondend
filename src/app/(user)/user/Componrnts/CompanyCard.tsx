"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { createPortal } from "react-dom";
import img1 from "../../../../../public/images/get-listed-1.jpg"
import Link from "next/link";

interface Company {
  id?: number;
  logo?: string | StaticImageData; 
  name?: string;
  price?: string;
  date?: string;
  duration?: string;
}

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="company-card">
        <div className="company-left">
       
          {company.logo && (
            <Image
              src={company.logo}
              alt={company.name || "Company logo"}
              width={70}
              height={70}
              className="company-logo"
            />
          )}

          <div className="company-info">
            <h4>{company.name}</h4>
            <p>{company.price}</p>
          </div>
        </div>

        <div className="company-right">

            <div className="right-text">
                  {company.date && <p className="company-date">{company.date}</p>}
               {company.duration && <p className="company-duration">{company.duration}</p>}
            </div>

            <div className="with-btn">
         
          <button className="view-btn" onClick={() => setShowPopup(true)}>
            View
          </button>


        </div>
        
        

          
        </div>
        
      </div>





      {showPopup && 
      createPortal(
        <div className="modal-overlay proposal-popup" onClick={() => setShowPopup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
  <button className="close-btn" onClick={() => setShowPopup(false)}>
            
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
      </div>

      {/* Details Section */}
      <div className="proposal-details">
        <h4>Proposal Details</h4>
        <div className="detail-row">

          <div className="detail-col11">
            <p><span>Budget</span></p>
            
          </div>
          <div className="detail-col11">
               <p>$150.000</p>

          </div>

          
       
        </div>




        <div className="detail-row">

            <div className="detail-col11">
            <p><span>Timeline</span></p>
            
          </div>
          <div className="detail-col11">
            <p>56 m2</p>

          </div>


          
          
        </div>




        <div className="detail-row">

            <div className="detail-col11">
            <p><span>Date</span></p>
            
          </div>
          <div className="detail-col11">
               <p>10/10/1985</p>

          </div>



          
       
        </div>







        <div className="proposal-letter">
          <h5>Proposal Letter:</h5>
          <p>
            American Home Improvement, Inc. – it is our mission to provide the
            highest quality of service in all aspects of our business. We are
            extremely thorough in the services that we provide and aim to be
            very receptive to any client’s issues, questions or concerns and
            handle them promptly and professionally.
          </p>
        </div>

        <div className="proposal-attachment">
            <h5><strong>Attachment:</strong></h5>
         

          <Link href="/">Download attachments</Link>


        </div>
      </div>

      {/* Buttons */}
      <div className="proposal-actions">
        <button className="reject-btn">Reject</button>
        <button className="accept-btn">Accept</button>
      </div>
    </div>

          </div>
        </div>
         ,
        document.body
     


      )}




    </>
  );
};

export default CompanyCard;
