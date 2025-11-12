"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import uploadIcon from "../../../../../../../public/images/upload.svg";
import { API_URL, IMG_URL } from "@/config";
import DetailCard from "@/app/(directory)/provider/Components/DetailCard";
import TabBtns from "../../Components/TabBtns";
import { useRouter } from "next/navigation";

const UploadBox = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    projectType: "",
    location: "",
    landSize: "",
    designStyle: "",
  });

  const [errors, setErrors] = useState({});
  const [providerId, setProviderId] = useState(null);
  const [token, setToken] = useState(null);
  const [designList, setDesignList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Provider state for dynamic DetailCard
  const [provider, setProvider] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [providerError, setProviderError] = useState(null);

  // 🟩 Load provider data and token from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("token");

      if (user && user.id) {
        setProviderId(user.id);
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Error reading localStorage:", err);
    }
  }, []);

  // 🟩 Fetch provider details (with simple caching)
  const fetchProviderData = async (forceRefresh = false) => {
    try {
      setLoadingProvider(true);
      setProviderError(null);

      const user = JSON.parse(localStorage.getItem("user"));
      const tokenLocal = localStorage.getItem("token");
      const id = user?.id || user?.provider_id;

      if (!id) {
        setProviderError("No provider ID found. Please log in again.");
        setLoadingProvider(false);
        return;
      }

      const cacheKey = `provider_${id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached && !forceRefresh) {
        try {
          const cachedData = JSON.parse(cached);
          setProvider(cachedData);
          setLoadingProvider(false);
          return;
        } catch (e) {
          // fallthrough to fetch fresh if cache is corrupt
          console.warn("Failed to parse cached provider, fetching fresh.", e);
        }
      }

      const res = await fetch(`${API_URL}providers/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(tokenLocal && { Authorization: `Bearer ${tokenLocal}` }),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setProviderError(body?.error || `Failed to fetch provider (${res.status})`);
        setLoadingProvider(false);
        return;
      }

      const data = await res.json();
      const providerData = data?.provider || null;
      setProvider(providerData);

      if (providerData) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(providerData));
        } catch (e) {
          console.warn("Failed to cache provider data:", e);
        }
      }
    } catch (err) {
      console.error("Error fetching provider data:", err);
      setProviderError("Failed to load provider data.");
    } finally {
      setLoadingProvider(false);
    }
  };

  // 🟩 Fetch design styles (from local backend)
  const fetchDesigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/design`);
      setDesignList(res.data);
    } catch (error) {
      console.error("Error fetching design list:", error);
    }
  };

  // 🟩 Fetch project categories (from live API)
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`https://hanois.dotwibe.com/api/api/categories`);
      setCategoryList(res.data);
    } catch (error) {
      console.error("Error fetching project types:", error);
    }
  };

  // 🟩 Load provider, designs and categories on mount
  useEffect(() => {
    if (providerId !== null) {
      fetchProviderData();
    } else {
      // Try fetching anyway; fetchProviderData reads localStorage internally
      fetchProviderData();
    }
    fetchDesigns();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  // 🟩 Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // clear error on change
  };

  // 🟩 Handle file change
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImageFile((prev) => (prev ? [...prev, ...newFiles] : newFiles));
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  // 🟩 Validate all fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.notes.trim()) newErrors.notes = "Notes are required.";
    if (!formData.projectType) newErrors.projectType = "Project Type is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.landSize.trim()) newErrors.landSize = "Land Size is required.";
    if (!formData.designStyle) newErrors.designStyle = "Design Style is required.";
    if (!imageFile || imageFile.length === 0) newErrors.images = "Please upload at least one image.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // returns true if no errors
  };

  // 🟩 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const user = JSON.parse(localStorage.getItem("user"));
    const providerIdLocal = user?.id || user?.provider_id;

    if (!providerIdLocal) {
      setMessage("❌ You must be logged in as a provider.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("provider_id", providerIdLocal);
      formDataObj.append("title", formData.title);
      formDataObj.append("notes", formData.notes);
      formDataObj.append("location", formData.location);
      formDataObj.append("land_size", formData.landSize);
      formDataObj.append("project_type_id", formData.projectType);
      formDataObj.append("design_id", formData.designStyle);

      if (imageFile && imageFile.length > 0) {
        imageFile.forEach((file) => {
          formDataObj.append("images", file);
          formDataObj.append("is_cover_flags[]", file.isCover ? "true" : "false");
        });
      }

      await axios.post(`${API_URL}/projects`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // 🟩 Show success modal
      setModalVisible(true);

      // Auto close after 3 seconds
      setTimeout(() => {
        setModalVisible(false);
        // optional: redirect after success
        // router.push("/provider/dashboard/projects");
      }, 3000);

      setFormData({
        title: "",
        notes: "",
        projectType: "",
        location: "",
        landSize: "",
        designStyle: "",
      });
      setImageFile(null);
      setErrors({});
    } catch (error) {
      console.error("Error saving project:", error);
      setMessage("❌ Failed to save project");
    }
  };

  return (
    <>
      {/* Dynamic DetailCard */}
      {loadingProvider ? (
        <p>Loading provider...</p>
      ) : providerError ? (
        <p style={{ color: "red" }}>{providerError}</p>
      ) : provider ? (
        <DetailCard
          logo={provider?.image ? `${IMG_URL}${provider.image}` : "/path/to/logo.png"}
          name={provider?.name || "Unknown Provider"}
          description={
            provider?.notes ||
            provider?.service_notes ||
            provider?.professional_headline ||
            "No description available"
          }
        />
      ) : (
        // fallback (should rarely render)
        <DetailCard />
      )}

      <TabBtns />

      <div className="">
        <div className="proj-form1 company-profile1 upload-page">
          <h3>Upload Project</h3>
          <p>Upload your project images and details below</p>

{/* 🟩 Upload + Preview Section */}
<div className="form-grp upload-area">
  <div>
    {/* Upload Box inside grid */}
    <div
      className="upload-box"
      onClick={() => document.querySelector(".upload-input")?.click()}
      
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
    >

      <div className="cover-upload">
        <div className="img-cover-up">
                              <Image src={uploadIcon} alt="Upload Icon" width={40} height={40} />


        </div>

        
      <h3 style={{ fontSize: "14px", marginTop: "10px" }}>Upload an image</h3>
      <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
        Browse your files to upload document
      </p>
      <span style={{ fontSize: "11px", color: "#999" }}>
        Supported Formats: JPEG, PNG
      </span>


      </div>







      <input
      type="file"
      accept="image/*"
      multiple
      className="upload-input hidden"
      onChange={handleFileChange}
    />
    </div>

    {/* Hidden File Input */}
    

    {/* Preview Grid */}
    {imageFile &&
      imageFile.length > 0 &&
      imageFile.map((file, index) => {
        const previewUrl = URL.createObjectURL(file);
        return (
          <div
            key={index}
            
          >
            <img
              src={previewUrl}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            {/* Remove Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImageFile((prev) => prev.filter((_, i) => i !== index));
              }}
              className="img-onclose"
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
            
                border: "none",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ✕
            </button>

            {/* Cover Image Button */}
            <button
              type="button"
              className="setas-cover"
              onClick={(e) => {
                e.stopPropagation();
                const updatedFiles = imageFile.map((f, i) =>
                  Object.assign(f, { isCover: i === index })
                );
                setImageFile([...updatedFiles]);
              }}
              style={{
                
              
                background: file.isCover ? "#CFCFD1" : "#ccc",
               
              
               
                cursor: "pointer",
              }}
            >
              {file.isCover ? "Cover Image" : "Set Cover"}
            </button>
          </div>
        );
      })}
  </div>

  {/* Validation Error */}
  {errors.images && (
    <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>
      {errors.images}
    </p>
  )}
</div>

          {/* 🟩 Form Section */}
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-grp">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Project Title"
              />
              {errors.title && <p style={{ color: "red", fontSize: "13px" }}>{errors.title}</p>}
            </div>

            {/* Notes */}
            <div className="form-grp">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Brief description for your project"
                rows={4}
              ></textarea>
              {errors.notes && <p style={{ color: "red", fontSize: "13px" }}>{errors.notes}</p>}
            </div>

            {/* Project Type */}
            <div className="form-grp">
              <label htmlFor="projectType">Project Type</label>
              <select id="projectType" value={formData.projectType} onChange={handleChange}>
                <option value="">Select Project Type</option>
                {categoryList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <p style={{ color: "red", fontSize: "13px" }}>{errors.projectType}</p>
              )}
            </div>

            {/* Location */}
            <div className="form-grp">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Kuwait City"
              />
              {errors.location && <p style={{ color: "red", fontSize: "13px" }}>{errors.location}</p>}
            </div>

            {/* Land Size */}
            <div className="form-grp">
              <label htmlFor="landSize">Land Size</label>
              <input
                type="text"
                id="landSize"
                value={formData.landSize}
                onChange={handleChange}
                placeholder="115 m2"
              />
              {errors.landSize && <p style={{ color: "red", fontSize: "13px" }}>{errors.landSize}</p>}
            </div>

            {/* Design Style */}
            <div className="form-grp">
              <label htmlFor="designStyle">Design Style</label>
              <select id="designStyle" value={formData.designStyle} onChange={handleChange}>
                <option value="">Select Design Style</option>
                {designList.map((design) => (
                  <option key={design.id} value={design.id}>
                    {design.name}
                  </option>
                ))}
              </select>
              {errors.designStyle && (
                <p style={{ color: "red", fontSize: "13px" }}>{errors.designStyle}</p>
              )}
            </div>

            {/* Buttons */}
            <div
              className="btn-cvr"
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button type="submit" className="save-btn1">
                Save
              </button>
            </div>
          </form>

          {/* 🟩 Message */}
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

          {/* 🟩 Success Modal */}
          {modalVisible && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                animation: "fadeIn 0.3s ease-in-out",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "30px 40px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  minWidth: "300px",
                }}
              >
                <h3 style={{ color: "green", marginBottom: "10px" }}>✅ Project Saved!</h3>
                <p>Your project has been successfully saved.</p>
                <button
                  onClick={() => {
                    setModalVisible(false);
                    router.push("/provider/dashboard/projects"); // 👈 redirect on close
                  }}
                  style={{
                    marginTop: "15px",
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadBox;
