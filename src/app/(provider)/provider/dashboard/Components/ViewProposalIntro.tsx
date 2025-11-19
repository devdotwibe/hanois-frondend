"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_URL, IMG_URL } from "@/config";
import { useRouter } from "next/navigation";

import BackIcon from "../../../../../../public/images/left-arrow.svg";
import UploadIcon from "../../../../../../public/images/upload.svg";
import ProfileImg from "../../../../../../public/images/profile.png";

const ViewProposalIntro = ({ proposal_id }) => {
  const router = useRouter();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  /** FETCH PROPOSAL DETAILS */
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/providers/view-proposal/${proposal_id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (data.success) {
          setProposal(data.data);
        }
      } catch (err) {
        console.error("Proposal fetch error:", err);
      }

      setLoading(false);
    };

    fetchProposal();
  }, [proposal_id]);

  if (loading) return <p>Loading...</p>;
  if (!proposal) return <p>No proposal found</p>;

  return (
    <div>
      <div className="intro-tab">
        <button className="back-bth" onClick={() => router.back()}>
          <Image src={BackIcon} alt="Back" width={40} height={40} />
        </button>

        {/* HEADER */}
        <div className="edit-proposal-header proposal-header">
          <Image
            src={
              proposal.user?.profile_image
                ? `${IMG_URL}uploads/${proposal.user.profile_image}`
                : ProfileImg
            }
            alt="Profile"
            width={80}
            height={80}
          />

          <div className="proposal-info">
            <h3>{proposal.user?.name}</h3>
            <p>{proposal.user?.email}</p>
            <p>{proposal.user?.phone || "No phone"}</p>
          </div>
        </div>

        {/* READ-ONLY FORM */}
        <form>
          <div className="form-grp">
            <label className="dark">Proposal Title</label>
            <input value={proposal.title} readOnly />
          </div>

          <div className="form-grp">
            <label className="dark">Budget</label>
            <input value={proposal.budget} readOnly />
          </div>

          <div className="form-grp">
            <label className="dark">Timeline</label>
            <input value={proposal.timeline} readOnly />
          </div>

          <div className="form-grp">
            <label>Proposal Letter</label>
            <textarea
              rows={4}
              value={proposal.description}
              readOnly
            ></textarea>
          </div>

          {/* Attachment Section */}
          <div className="upload-doc">
            <div className="form-grp upload-area">
              <div className="upload-box">
                <div className="cover-upload">
                  <Image src={UploadIcon} alt="Upload Icon" width={40} height={40} />
                  <h3>Attachment</h3>

                  {proposal.attachment ? (
                    <a
                      href={`${IMG_URL}proposals/${proposal.attachment}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View Attachment
                    </a>
                  ) : (
                    <p>No attachment uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/provider/dashboard")}
            className="send-prop-btn dark-btn"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default ViewProposalIntro;
