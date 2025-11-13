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
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-50 text-gray-700";
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
          console.error("User not logged in or token missing");
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

        if (!res.ok) {
          console.error("Error fetching leads:", data);
          setLoading(false);
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
    <div className="p-8">
      <div className="intro-tab mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Provider Dashboard
        </h3>
        <p className="text-gray-500 mt-1">
          Here is the list of your leads, you can check lead’s projects and
          contact with them
        </p>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-5">Lead Name</th>
              <th className="py-3 px-5">Project Type</th>
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Mobile</th>
              <th className="py-3 px-5">Status</th>
            </tr>
          </thead>
          <tbody>

              { leads && leads.length > 0 && leads?.map((lead, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-4 px-5 flex items-center space-x-3">
                    <img
                      src={`https://i.pravatar.cc/40?img=${index + 1}`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-800 font-medium">{lead?.title}</span>
                  </td>
                  <td>
                    <span className="border border-gray-400 px-3 py-1 rounded-full text-sm text-gray-700">
                      {lead?.category?.name}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-gray-700">{new Date(lead.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="py-4 px-5 text-gray-700">{lead?.user?.email}</td>
                  <td className="py-4 px-5 text-gray-700">{lead?.phone?.mobile}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
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
