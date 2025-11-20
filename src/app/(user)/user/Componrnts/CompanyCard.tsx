"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";
import { API_URL } from "@/config";

const CompanyCard = ({ proposal }: { proposal: any }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {/* CARD LIST ITEM */}
      <div className="company-card">
        <div className="company-left">
          <Image
            src="/images/default-user.png"
            alt="Provider"
            width={70}
            height={70}
            className="company-logo"
          />

          <div className="company-info">
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
                    src="/images/default-user.png"
                    alt="Provider"
                    width={70}
                    height={70}
                    className="proposal-logo"
                  />
                  <div className="proposal-info">
                    <h3>Provider #{proposal.provider_id}</h3>
                    <p>Proposal ID: {proposal.id}</p>
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
                  <div className="proposal-attachment">
                    <h5><strong>Attachments:</strong></h5>

                    {proposal.attachments?.length > 0 ? (
                      proposal.attachments.map((att: any) => (
                        <Link
                          key={att.id}
                          href={`${API_URL}/proposals/${att.attachment}`}
                          target="_blank"
                        >
                          📎 {att.attachment}
                        </Link>
                      ))
                    ) : (
                      <p>No attachments</p>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="proposal-actions">
                  <button className="reject-btn">Reject</button>
                  <button className="accept-btn">Accept</button>
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
