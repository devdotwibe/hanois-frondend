"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";
import { IMG_URL ,API_URL } from "@/config";

const CompanyCard = ({ proposal }: { proposal: any }) => {
  const [showPopup, setShowPopup] = useState(false);

  const [status, setStatus] = useState({
  success: false,
  message: "",
});


  // safely read provider data
  const provider = proposal.provider || {};


  const handleAccept = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/providers/proposal/${proposal.id}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (data.success) {
    setStatus({
  success: true,
  message: "Proposal accepted successfully!",
});

// Close popup after 1.5 seconds
setTimeout(() => {
  setShowPopup(false);
}, 1500);

    } else {
     setStatus({
  success: false,
  message: data.error || "Failed to accept proposal",
});

    }
  } catch (err) {
    console.error("Accept error:", err);
  }
};

const handleReject = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/providers/proposal/${proposal.id}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (data.success) {
   setStatus({
  success: false,          // red message
  message: "Proposal rejected!",
});

// Close popup after 1.5 sec
setTimeout(() => {
  setShowPopup(false);
}, 1500);

    } else {
     setStatus({
  success: false,
  message: data.error || "Failed to reject proposal",
});

    }
  } catch (err) {
    console.error("Reject error:", err);
  }
};




  return (
    <>
      {/* CARD LIST ITEM */}
      <div className="company-card">
        <div className="company-left">
          <Image
  src={
    provider.image
      ? `${IMG_URL}${provider.image}`
      : "/images/default-user.png"
  }
  alt={provider.name || "Provider"}
  width={70}
  height={70}
  className="company-logo"
  unoptimized
/>


          <div className="company-info">
            {/* You can also show provider name here if you want */}
            <h4>{proposal.title}</h4>
            <p>{proposal.budget}</p>
          </div>
        </div>

        <div className="company-right">
          <div className="right-text">
            <p className="company-date">
              {new Date(proposal.created_at).toLocaleDateString()}
            </p>
            <p className="company-duration">{proposal.timeline}</p>
          </div>

          <div className="with-btn">
            <button className="view-btn" onClick={() => setShowPopup(true)}>
              View
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {showPopup &&
        createPortal(
          <div
            className="modal-overlay proposal-popup"
            onClick={() => setShowPopup(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                ✕
              </button>

              <div className="proposal-box">
                {/* Header */}
                <div className="proposal-header">
                 <Image
  src={
    provider.image
      ? `${IMG_URL}${provider.image}`
      : "/images/default-user.png"
  }
  alt={provider.name || "Provider"}
  width={70}
  height={70}
  className="company-logo"
  unoptimized
/>

                  <div className="proposal-info">
                    <h3>{provider.name || "Unknown Provider"}</h3>
                    {provider.email && <p>{provider.email}</p>}
                    {provider.phone && <p>{provider.phone}</p>}
                  </div>
                </div>

                {/* Proposal Details */}
                <div className="proposal-details">
                  <h4>Proposal Details</h4>

                  <div className="detail-row">
                    <div className="detail-col11"><span>Budget</span></div>
                    <div className="detail-col11">{proposal.budget}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-col11"><span>Timeline</span></div>
                    <div className="detail-col11">{proposal.timeline}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-col11"><span>Date</span></div>
                    <div className="detail-col11">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Proposal Letter */}
                  <div className="proposal-letter">
                    <h5>Proposal Letter:</h5>
                    <p>{proposal.description}</p>
                  </div>

                  {/* ATTACHMENTS */}
                 {/* ATTACHMENTS (Same UI as ViewProposalIntro BUT using IMG_URL) */}
<div className="proposal-attachment">
  <h5><strong>Attachments:</strong></h5>

  {proposal.attachments?.length > 0 ? (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginTop: "10px",
      }}
    >
      {proposal.attachments.map((file: any, index: number) => {
        // File full URL using IMG_URL
        const fileUrl = `${IMG_URL}proposals/${file.attachment}`;

        // Check if file is an image
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.attachment);

        return (
          <div key={index} style={{ textAlign: "center" }}>

            {isImage ? (
              <img
                src={fileUrl}
                alt="Attachment"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "8px 12px",
                  background: "#f3f3f3",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              >
                📄 {file.attachment}
              </a>
            )}

          </div>
        );
      })}
    </div>
  ) : (
    <p style={{ marginTop: "10px" }}>No attachments uploaded</p>
  )}
</div>

                </div>
{status.message && (
  <div
    className={status.success ? "contact-success" : "contact-error"}
    style={{ marginTop: "10px" }}
  >
    <p
      style={{
        color: status.success ? "green" : "red",
        fontSize: "14px",
        margin: 0,
      }}
    >
      {status.message}
    </p>
  </div>
)}



                {/* ACTION BUTTONS */}
               <div className="proposal-actions">
  <button className="reject-btn" onClick={handleReject}>
    Reject
  </button>

  <button className="accept-btn" onClick={handleAccept}>
    Accept
  </button>
</div>

              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CompanyCard;
