"use client";

import { API_URL, IMG_URL } from "@/config";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import img1 from "../../../../../public/images/profile.png";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Proposal Accepted":
      return "bg-green-100 text-green-700";
    case "Contacted":
      return "bg-yellow-100 text-yellow-700";
    case "Proposal Sent":
      return "bg-blue-100 text-blue-700";
    case "Proposal Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "";
  }
};

const Page = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [leadStatus, setLeadStatus] = useState("");
const [leadNote, setLeadNote] = useState("");


  /** FETCH LEADS **/
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?.id;

        if (!token || !userId) {
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

        if (data?.error === "Invalid or expired token") {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        setLeads(data?.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

const openLeadModal = (lead: any) => {
  setSelectedLead(lead);
setLeadStatus(lead?.lead_status ?? "Awaiting Review");
setLeadNote(lead?.lead_description ?? "");

  setOpenPopup(true);
};


const handleSaveLead = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/providers/update-lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lead_id: selectedLead?.lead_id || null,   // if stored in leads table
        work_id: selectedLead?.id,               // work id always present
        status: leadStatus,
      description: leadNote

      }),
    });

    const data = await res.json();
    console.log("SAVE RESPONSE:", data);

    if (data.success) {
     

      // Refresh leads immediately
      window.location.reload();
    }
  } catch (err) {
    console.error("Save error:", err);
  }
};




  return (
    <div>
      <div className="intro-tab">
        <h3>Provider Dashboard</h3>
        <p>
          Here is the list of your leads, you can check lead’s projects and
          contact with them
        </p>
      </div>

      <div className="overflow-x-auto leads-table">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="lead-col">Lead Name</th>
              <th className="project-col">Project Type</th>
              <th className="date-col">Date</th>
              <th className="email-col">Email</th>
              <th className="mob-col">Mobile</th>
              <th className="status-col">Status</th>
            </tr>
          </thead>

          <tbody>
            {leads.length > 0 &&
              leads.map((lead: any, index: number) => (
                <tr key={index}>
                  {/* Lead Name */}
                  <td className="lead-name lead-col">
                    <img
                      src={
                        lead?.user?.profile_image
                          ? `${IMG_URL}uploads/${lead.user.profile_image}`
                          : img1.src
                      }
                      alt="Avatar"
                      className="w-[32px] h-[32px] rounded-full"
                    />

                    <span className="text-gray-800 font-medium">
                      {lead?.title}
                    </span>
                  </td>

                  {/* Project Type */}
                  <td className="project-col">
                    <span className="project-type">
                      {lead?.category?.name}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="date-col">
                    {new Date(lead.created_at).toLocaleDateString("en-GB")}
                  </td>

                  {/* Email */}
                  <td className="email-col">{lead?.user?.email}</td>

                  {/* Phone */}
                  <td className="mob-col">{lead?.user?.phone || "N/A"}</td>

                  {/* Status */}
                  <td className="status-col">
                    <span
                      className={`highlightedd bg-blue ${getStatusColor(
                        lead.status
                      )}`}
                      onClick={() => openLeadModal(lead)}
                      style={{ cursor: "pointer" }}
                    >
                     {lead.status ?? "Awaiting Review"}

                    </span>
                  </td>

                  
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ------------------------------ MODAL ------------------------------ */}
      {openPopup &&
        selectedLead &&
        createPortal(
          <div
            className="modal-overlay proposal-popup lead-popup"
            onClick={() => setOpenPopup(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setOpenPopup(false)}
              ></button>

              <div className="proposal-box">
                {/* HEADER */}
                <div className="proposal-header">
                  <img
                    src={
                      selectedLead?.user?.profile_image
                        ? `${IMG_URL}uploads/${selectedLead.user.profile_image}`
                        : img1.src
                    }
                    alt={selectedLead?.user?.name}
                    width={70}
                    height={70}
                    className="proposal-logo"
                  />

                  <div className="proposal-info">
                    <h3>{selectedLead?.user?.name}</h3>
                    <p>{selectedLead?.user?.email}</p>
                    <p>{selectedLead?.user?.phone || "No phone"}</p>
                  </div>

                 {selectedLead?.proposal_id ? (
  <Link
    href={`/provider/dashboard/view-proposal?id=${selectedLead.proposal_id}`}
    className="proposal-view"
  >
    View Proposal
  </Link>
) : (
  <Link
    href={`/provider/dashboard/send-proposal?work_id=${selectedLead.id}&user_id=${selectedLead.user_id}&provider_id=${JSON.parse(localStorage.getItem("user")).id}`}
    className="proposal-view"
  >
    Send Proposal
  </Link>
)}




                </div>

                {/* DETAILS */}
                <div className="proposal-details lead-details">
                  <h4>
                    Project Details{" "}
                    <span>{selectedLead?.listing_style}</span>
                  </h4>

                  <h5>{selectedLead?.title}</h5>
                  <h5>About the project:</h5>

                  <div className="cont-lead">
                    <p>{selectedLead?.notes || "No description provided."}</p>
                  </div>

                  <div className="detail-row">
                    <div className="detail-col11">
                      <p>
                        <span>Type</span>
                      </p>
                    </div>
                    <div className="detail-col11">
                      <p>{selectedLead?.category?.name}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-col11">
                      <p>
                        <span>Location</span>
                      </p>
                    </div>
                    <div className="detail-col11">
                      <p>{selectedLead?.location}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-col11">
                      <p>
                        <span>Land size</span>
                      </p>
                    </div>
                    <div className="detail-col11">
                      <p>{selectedLead?.land_size}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-col11">
                      <p>
                        <span>Luxury level</span>
                      </p>
                    </div>
                    <div className="detail-col11">
                   <p>{selectedLead?.luxury_level_details?.name || "N/A"}</p>

                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-col11">
                      <p>
                        <span>Basement</span>
                      </p>
                    </div>
                    <div className="detail-col11">
                      <p>{selectedLead?.basement || "N/A"}</p>
                    </div>
                  </div>

                  {/* STATUS & NOTES FORM */}
                <form>
  <div className="form-grp">
    <label>Status</label>
    <select
      value={leadStatus}
      onChange={(e) => setLeadStatus(e.target.value)}
    >
      <option>Awaiting Review</option>
      <option>Proposal Sent</option>
      <option>Proposal Accepted</option>
      <option>Proposal Rejected</option>
      <option>Contacted</option>
      <option>Viewed</option>
    </select>
  </div>

  <div className="form-grp">
    <label>Notes</label>
    <textarea
      rows={4}
      placeholder="Proposal Notes"
      value={leadNote}
      onChange={(e) => setLeadNote(e.target.value)}
    ></textarea>
  </div>
</form>

                </div>

                <div className="proposal-actions">
                  <button
                    className="cancel-btn1"
                    onClick={() => setOpenPopup(false)}
                  >
                    Cancel
                  </button>
               <button className="accept-btn" onClick={handleSaveLead}>
  Save
</button>

                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Page;
