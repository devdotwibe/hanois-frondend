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

    // Append multiple files
    attachments.forEach((item) => {
      formData.append("attachments", item.file);
    });

    try {
      const res = await fetch(`${API_URL}/providers/send-proposal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
          {/* Title */}
          <div className="form-grp">
            <label className="dark">Proposal Title</label>
            <input
              placeholder="Proposal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Budget */}
          <div className="form-grp">
            <label className="dark">Budget</label>
            <input
              placeholder="$150,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>

          {/* Timeline */}
          <div className="form-grp">
            <label className="dark">Timeline</label>
            <input
              placeholder="6 months"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              required
            />
          </div>

          {/* Description */}
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

          {/* Upload Section */}
          <div className="upload-doc">
            <div className="form-grp upload-area">
              <div>
                <div
                  className="upload-box"
                  onClick={() => document.getElementById("fileUploader").click()}
                  style={{ position: "relative", cursor: "pointer" }}
                >
                  <div className="cover-upload">
                    <div className="img-cover-up">
                      <Image src={Uploadimg} alt="Upload" width={40} height={40} />
                    </div>
                    <h3>Upload an image</h3>
                    <p>Browse your files to upload document</p>
                    <span>Supported Formats: JPEG, PNG, PDF, PPT</span>
                  </div>

                  {/* HIDDEN INPUT */}
                  <input
                    id="fileUploader"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.ppt,.pptx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);

                      const previews = files.map((file) => ({
                        file,
                        preview: URL.createObjectURL(file),
                      }));

                      setAttachments((prev) => [...prev, ...previews]);
                    }}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* PREVIEW LIST */}
            <div className="preview-list" style={{ marginTop: "15px" }}>
              {attachments.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "inline-block",
                    marginRight: "10px",
                    position: "relative",
                  }}
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      const updated = [...attachments];
                      updated.splice(index, 1);
                      setAttachments(updated);
                    }}
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      border: "none",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    ✕
                  </button>

                  {/* Preview Image */}
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
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
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
