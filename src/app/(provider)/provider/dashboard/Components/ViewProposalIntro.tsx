"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_URL, IMG_URL } from "@/config";
import { useRouter } from "next/navigation";

import BackIcon from "../../../../../../public/images/left-arrow.svg";
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

  /** Check if attachment is an image */
  const isImage = proposal.attachment
    ? /\.(jpg|jpeg|png|gif|webp)$/i.test(proposal.attachment)
    : false;

  return (
    <div>
      <div className="intro-tab">

        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <button className="back-bth" onClick={() => router.back()}>
            <Image src={BackIcon} alt="Back" width={40} height={40} />
          </button>

          <button
            className="send-prop"
            onClick={() =>
              router.push(`/provider/dashboard/edit-proposal?id=${proposal_id}`)
            }
            style={{ height: "40px" }}
          >
            Edit
          </button>
        </div>

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

        {/* READ ONLY FIELDS */}
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
            <textarea rows={4} value={proposal.description} readOnly></textarea>
          </div>

          {/* 📌 SHOW IMAGE INSTEAD OF BUTTON */}
        {/* SMALL IMAGE PREVIEW ONLY */}
<div className="form-grp">
  <label>Attachment</label>

  {proposal.attachment ? (
    <img
      src={`${IMG_URL}uploads/${proposal.attachment}`}
      alt="Attachment"
      style={{
        width: "120px",
        height: "120px",
        objectFit: "cover",
        borderRadius: "8px",
        marginTop: "10px",
        border: "1px solid #ddd"
      }}
    />
  ) : (
    <p style={{ marginTop: "10px" }}>No attachment uploaded</p>
  )}
</div>


          {/* BACK BUTTON */}
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
