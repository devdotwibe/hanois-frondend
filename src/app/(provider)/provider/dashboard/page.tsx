"use client";

import { API_URL } from "@/config";
import React, { useState,useEffect } from 'react'

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
                    
                    <img
                      src={`https://i.pravatar.cc/40?img=${index + 1}`}
                      alt="Avatar"
                      className="w-[32px] h-[32px] rounded-full"
                    />
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
                  <td className="status-col">
                    <span
                      className={`highlightedd bg-blue ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
