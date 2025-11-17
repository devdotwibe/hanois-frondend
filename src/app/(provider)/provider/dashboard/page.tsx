"use client";

import { API_URL ,IMG_URL} from "@/config";
import React, { useState,useEffect } from 'react'
import { createPortal } from "react-dom";
import Image from "next/image";
import img1 from "../../../../../public/images/profile.png"
import Link from "next/link";


const leads = [
  {
    name: "Mike Hanson",
    projectType: "Governmental",
    date: "06.08.2023",
    email: "mikehan21@gmail.com",
    mobile: "+1 (866) 919-2416",
    status: "Proposal Accepted",
  },
  {
    name: "Mike Hanson",
    projectType: "Governmental",
    date: "06.08.2023",
    email: "mikehan21@gmail.com",
    mobile: "+1 (866) 919-2416",
    status: "Contacted",
  },
  {
    name: "Mike Hanson",
    projectType: "Governmental",
    date: "06.08.2023",
    email: "mikehan21@gmail.com",
    mobile: "+1 (866) 919-2416",
    status: "Proposal Sent",
  },
  {
    name: "Mike Hanson",
    projectType: "Governmental",
    date: "06.08.2023",
    email: "mikehan21@gmail.com",
    mobile: "+1 (866) 919-2416",
    status: "Proposal Rejected",
  },
  {
    name: "Mike Hanson",
    projectType: "Governmental",
    date: "06.08.2023",
    email: "mikehan21@gmail.com",
    mobile: "+1 (866) 919-2416",
    status: "Viewed",
  },
  {
    name: "Mike Hanson",
    projectType: "Governmental",
    date: "06.08.2023",
    email: "mikehan21@gmail.com",
    mobile: "+1 (866) 919-2416",
    status: "Proposal Accepted",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Proposal Accepted":
      return "bg-green-100 text-green-700";
    case "Contacted":
      return "bg-yellow-100 text-yellow-700";
    case "Proposal Sent":
      return "bg-blue-100 text-blue-700";
    case "Proposal Rejected":
      return "bg-red-100 text-red-700";
    case "Viewed":
      return "";
    default:
      return "";
  }
};




const Page = () => {

  const [openPopup, setOpenPopup] = useState(false);


  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);


    useEffect(() => {

    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");

        const userData = JSON.parse(localStorage.getItem("user"));

        const userId = userData?.id;

        if (!token || !userId) {

          //  window.location.href = "/login";
          //   return;

          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/providers/get_leads`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

            
        if (data?.error === "Access token is required" || data?.error === "Invalid or expired token") {

            localStorage.removeItem("token");
        
            window.location.href = "/login";
            return;
        }

        setLeads(data?.data);

      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="">
      <div className="intro-tab">
        <h3 className="">
          Provider Dashboard
        </h3>
        <p className="">
          Here is the list of your leads, you can check lead’s projects and
          contact with them
        </p>
      </div>

      <div className="overflow-x-auto leads-table">
        <table className="border-collapse">
          <thead>
            <tr className="">
              <th className="lead-col">Lead Name</th>
              <th className="project-col">Project Type</th>
              <th className="date-col">Date</th>
              <th className="email-col">Email</th>
              <th className="mob-col">Mobile</th>
              <th className="status-col">Status</th>
            </tr>
          </thead>
          <tbody>

              { leads && leads.length > 0 && leads?.map((lead, index) => (
                <tr
                  key={index}
                  className=""
                >
                  <td className="lead-name lead-col">
                    
                    {lead?.user?.profile_image && (

                      <img
                        src={`${IMG_URL}uploads/${lead?.user?.profile_image}`}
                        alt="Avatar"
                        className="w-[32px] h-[32px] rounded-full"
                      />

                    )}

                    <span className="text-gray-800 font-medium">{lead?.title}</span>
                  </td>
                  <td className="project-col">
                    <span className="project-type">
                      {lead?.category?.name}
                    </span>
                  </td>
                  <td className="date-col">{new Date(lead.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="email-col">{lead?.user?.email}</td>
                  <td className="mob-col">{lead?.phone?.mobile}</td>


                  {/* <td className="status-col">
                    <span
                      className={`highlightedd bg-blue ${getStatusColor(
                        lead.status

                        
                      )}`

                      
                    
                    }
                    >
                      {lead.status}
                    </span>
                  </td> */}


                  <td className="status-col">
        <span
          className={`highlightedd bg-blue ${getStatusColor(lead.status)}`}
          onClick={() => setOpenPopup(true)}
          style={{ cursor: "pointer" }}
        >
          {lead.status}
        </span>
      </td>



       {openPopup &&
       createPortal(

        <div className="modal-overlay proposal-popup lead-popup" onClick={() => setOpenPopup(false)}>
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

                  <Link href="/" className="proposal-view ">Send proposal</Link>
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





                <form>

                  <div className="form-grp">
                    <label>status</label>
                    <select></select>
                  </div>


                  
                  <div className="form-grp">
                    <label>Notes</label>
                    <textarea placeholder="Proposal Letters" rows={4}></textarea>
                    <small>Breif discription for your profile, URLs are hyperlinked </small>
                  </div>







                </form>
        


        
        
                
        
                
              </div>




              <div className="proposal-actions">
                <button className="cancel-btn1">Cancel</button>
                <button className="accept-btn">Save</button></div>
        
           
            </div>
        
                  </div>
                </div>
                 ,
                document.body



       




      )}














                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
