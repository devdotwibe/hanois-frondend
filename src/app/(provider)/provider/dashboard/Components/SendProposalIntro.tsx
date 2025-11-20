"use client";

import React, { useState } from "react";
import Image from "next/image";
import { API_URL } from "@/config";
import Image1 from "../../../../../../public/images/left-arrow.svg";
import Uploadimg from "../../../../../../public/images/upload.svg";
import { useRouter } from "next/navigation";

const SendProposalIntro = ({ work_id, user_id, provider_id }) => {

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
 const [attachments, setAttachments] = useState([]);


  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("work_id", work_id);
  formData.append("user_id", user_id);
  formData.append("provider_id", provider_id);
  formData.append("title", title);
  formData.append("budget", budget);
  formData.append("timeline", timeline);
  formData.append("description", description);

  // Multiple attachments
  attachments.forEach((file) => {
    formData.append("attachments", file);
  });

  try {
    const res = await fetch(`${API_URL}/providers/send-proposal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("Proposal sent successfully!");
      router.push("/user/providers");
    } else {
      alert(data.error || "Something went wrong");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }

  setLoading(false);
};

  return (
    <div>
      <div className="intro-tab">
        <button className="back-bth" onClick={() => router.back()}>
          <Image src={Image1} alt="Back" width={40} height={40} />
        </button>

        <h3>Send Proposal</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grp">
            <label className="dark">Proposal Title</label>
            <input
              placeholder="Proposal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-grp">
            <label className="dark">Budget</label>
            <input
              placeholder="$150,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>

          <div className="form-grp">
            <label className="dark">Timeline</label>
            <input
              placeholder="6 months"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              required
            />
          </div>

          <div className="form-grp">
            <label>Proposal Letter</label>
            <textarea
              placeholder="Proposal Letter"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <small>Brief description for your proposal</small>
          </div>

          {/* KEEP the upload UI if you want visually — but NO upload */}
        <div className="upload-doc">
<div className="form-grp upload-area">
  <div>
    <div
      className="upload-box"
      style={{
        position: "relative",
        cursor: "pointer",
      }}
    >
      <div className="cover-upload" style={{ pointerEvents: "none" }}>
        <div className="img-cover-up">
          <Image
            src={Uploadimg}
            alt="Upload Icon"
            width={40}
            height={40}
          />
        </div>

        <h3>Upload an image</h3>
        <p>Browse your files to upload document</p>
        <span>Supported Formats: JPEG, PNG, PDF, PPT</span>
      </div>

      {/* Invisible Input (Click Target) */}
      <input
  type="file"
  multiple
  accept="image/*,.pdf,.ppt,.pptx"
 onChange={(e) => setAttachments([...e.target.files])}

/>

    </div>
  </div>
</div>

</div>


          <button
            type="submit"
            disabled={loading}
            className="send-prop-btn dark-btn"
          >
            {loading ? "Sending..." : "Send Proposal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendProposalIntro;
