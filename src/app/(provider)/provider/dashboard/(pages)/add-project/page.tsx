"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import uploadIcon from "../../../../../../../public/images/upload.svg";
import { API_URL } from "@/config";
import HouseOuter from "../../Components/HouseOuter";

const UploadBox = () => {
  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    projectType: "",
    location: "",
    landSize: "",
    designStyle: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  // handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // handle image upload
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // handle save
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Step 1: Create project record
      const projectRes = await axios.post(`${API_URL}/projects`, {
        provider_id: 1, // replace with logged-in provider ID
        title: formData.title,
        notes: formData.notes,
        location: formData.location,
        land_size: formData.landSize,
      });

      const projectId = projectRes.data?.project?.id;

      // Step 2: Upload image if selected
      if (imageFile && projectId) {
        const imgForm = new FormData();
        imgForm.append("image", imageFile);
        imgForm.append("project_id", projectId);
        imgForm.append("provider_id", 1); // replace with real provider

        await axios.post(`${API_URL}/project-images`, imgForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setMessage("✅ Project saved successfully!");
      setFormData({
        title: "",
        notes: "",
        projectType: "",
        location: "",
        landSize: "",
        designStyle: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error saving project:", error);
      setMessage("❌ Failed to save project");
    }
  };

  return (
    <>
      <HouseOuter />
      <div className="containers">
        <div className="form-c">
          <h3>Upload Project</h3>
          <p>Upload your project images and details below</p>

          {/* Upload Section */}
          <div
            className="form-grp upload-area"
            style={{ textAlign: "center", marginBottom: "30px" }}
          >
            <div
              className="upload-box"
              style={{
                border: "2px dashed #d1d5db",
                borderRadius: "10px",
                padding: "40px 20px",
                background: "#fafafa",
                cursor: "pointer",
              }}
              onClick={() =>
                document.querySelector(".upload-input")?.click()
              }
            >
              <Image
                src={uploadIcon}
                alt="Upload Icon"
                width={40}
                height={40}
                style={{ margin: "0 auto 10px" }}
              />
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                Upload an image
              </h3>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                Browse your files to upload document
              </p>
              <span style={{ color: "#999", fontSize: "13px" }}>
                Supported Formats: JPEG, PNG
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="upload-input hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-grp">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Experts"
              />
            </div>

            <div className="form-grp">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Brief description for your project"
                rows={4}
              ></textarea>
              <small>Brief description for your profile. URLs are hyperlinked.</small>
            </div>

            <div className="form-grp">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Kuwait City"
              />
            </div>

            <div className="form-grp">
              <label htmlFor="landSize">Land Size</label>
              <input
                type="text"
                id="landSize"
                value={formData.landSize}
                onChange={handleChange}
                placeholder="115 m2"
              />
            </div>

            <div
              className="btn-cvr"
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                className="login-btn contact"
                style={{ background: "transparent", color: "red" }}
              >
                Delete
              </button>
              <button
                type="button"
                className="login-btn contact"
                style={{ background: "#f0f0f0", color: "#000" }}
              >
                Preview
              </button>
              <button type="submit" className="login-btn contact">
                Save
              </button>
            </div>
          </form>

          {message && (
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: message.includes("✅") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadBox;
