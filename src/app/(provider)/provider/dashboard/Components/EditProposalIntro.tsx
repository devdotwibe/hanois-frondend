"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_URL, IMG_URL } from "@/config";
import { useRouter } from "next/navigation";

import BackIcon from "../../../../../../public/images/left-arrow.svg";
import ProfileImg from "../../../../../../public/images/upload.svg";



const EditProposalIntro = ({ proposal_id }) => {
  const router = useRouter();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
 const [attachments, setAttachments] = useState([]);


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

          setTitle(data.data.title);
          setBudget(data.data.budget);
          setTimeline(data.data.timeline);
          setDescription(data.data.description);
        }
      } catch (err) {
        console.error("Proposal fetch error:", err);
      }

      setLoading(false);
    };

    fetchProposal();
  }, [proposal_id]);

  /** SUBMIT UPDATED PROPOSAL */
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("title", title);
    formData.append("budget", budget);
    formData.append("timeline", timeline);
    formData.append("description", description);

   attachments.forEach(file => {
  formData.append("attachments", file);
});

    try {
      const res = await fetch(
        `${API_URL}/providers/update-proposal/${proposal_id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Proposal updated successfully!");
        router.push("/provider/dashboard");
      } else {
        alert("Failed to update proposal");
      }
    } catch (error) {
      console.error("Update proposal error:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!proposal) return <p>No proposal found</p>;


  const deleteAttachment = async (attachmentId) => {
  const token = localStorage.getItem("token");

  if (!confirm("Are you sure you want to delete this attachment?")) return;

  try {
    const res = await fetch(`${API_URL}/providers/delete-proposal-attachment/${attachmentId}`
, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      // Remove from UI instantly
      setProposal((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((att) => att.id !== attachmentId),
      }));
    } else {
      alert("Delete failed");
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
};



  return (
    <div className="intro-tab">
      {/* TOP BAR */}
      <div
        className="top-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <button className="back-bth" onClick={() => router.back()}>
          <Image src={BackIcon} alt="Back" width={40} height={40} />
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

      {/* EDIT FORM */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-grp">
          <label className="dark">Proposal Title</label>
          <input
  value={title}
  readOnly
  disabled          // fully locks editing
  style={{ background: "#f3f3f3", cursor: "not-allowed" }}
/>

        </div>

        <div className="form-grp">
          <label className="dark">Budget</label>
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
          />
        </div>

        <div className="form-grp">
          <label className="dark">Timeline</label>
          <input
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="Timeline"
          />
        </div>

        <div className="form-grp">
          <label>Proposal Letter</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write proposal description"
          ></textarea>
        </div>

<div className="form-grp upload-area">
  <label className="dark">Existing Attachments</label>

  {/* SHOW ALL EXISTING ATTACHMENTS */}
  {proposal.attachments && proposal.attachments.length > 0 ? (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "15px",
      }}
    >
      {proposal.attachments.map((file, index) => {
        const fileUrl = `${IMG_URL}proposals/${file.attachment}`;
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.attachment);

        return (
         <div key={index} style={{ position: "relative", textAlign: "center" }}>
    
    {/* DELETE BUTTON */}
    <button
      onClick={() => deleteAttachment(file.id)}
      style={{
        position: "absolute",
        top: "-8px",
        right: "-8px",
        background: "red",
        color: "white",
        borderRadius: "50%",
        border: "none",
        width: "22px",
        height: "22px",
        cursor: "pointer",
        fontSize: "12px",
        zIndex: 10,
      }}
    >
      ✕
    </button>

    {/* IMAGE OR FILE LINK */}
    {isImage ? (
      <img
        src={fileUrl}
        alt="Attachment"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "8px",
          border: "1px solid #ddd",
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
    <p style={{ marginBottom: "10px" }}>No existing attachments</p>
  )}

  {/* UPLOAD NEW ATTACHMENT */}
  <label className="dark">Upload New Attachment</label>
  <div className="upload-box" style={{ position: "relative", cursor: "pointer" }}>
    <div className="cover-upload" style={{ pointerEvents: "none" }}>
      <div className="img-cover-up">
        <Image src={ProfileImg} alt="Upload Icon" width={40} height={40} />
      </div>

      <h3>Upload a file</h3>
      <p>Browse your files to upload document</p>
      <span>Supported Formats: JPEG, PNG, PDF, DOC, PPT</span>
    </div>

    {/* Invisible File Input */}
<input
  type="file"
  multiple
  accept="image/*,.pdf,.ppt,.pptx,.doc,.docx"
onChange={(e) => {
  const files = Array.from(e.target.files);

  const processed = files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
  }));

  setAttachments((prev) => [...prev, ...processed]);
}}

      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0,
        cursor: "pointer",
        zIndex: 10,
      }}
    />

   



  </div>

   {attachments.length > 0 && (
  <div style={{ marginTop: "15px" }}>
    <h4>New Uploads</h4>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {attachments.map((item, index) => {
        const isImage = item.file.type.startsWith("image/");

        return (
          <div key={index} style={{ position: "relative" }}>
            {/* delete button */}
            <button
              onClick={() => {
                const updated = [...attachments];
                updated.splice(index, 1);
                setAttachments(updated);
              }}
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                border: "none",
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {/* Preview */}
            {isImage ? (
              <img
                src={item.preview}
                alt="Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            ) : (
              <div
                style={{
                  padding: "8px",
                  background: "#eee",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                📄 {item.file.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

</div>

        {/* SUBMIT BUTTON */}
        <button
          type="button"
          onClick={handleUpdate}
          className="send-prop-btn dark-btn"
        >
          Update Proposal
        </button>

        <button
          type="button"
          onClick={() => router.push("/provider/dashboard")}
          className="send-prop-btn secondary-btn"
          style={{ marginTop: "10px", background: "#ccc", color: "#000" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProposalIntro;
