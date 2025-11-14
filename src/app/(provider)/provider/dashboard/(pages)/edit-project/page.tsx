"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import uploadIcon from "../../../../../../../public/images/upload.svg";
import { API_URL, IMG_URL } from "@/config";
import DetailCard from "@/app/(directory)/provider/Components/DetailCard";

import TabBtns from "../../Components/TabBtns";
import { useRouter, useSearchParams } from "next/navigation";


import sucesstik from "../../../../../../../public/images/sucess-msg.svg"

const EditProject = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // 👈 Get project ID from URL

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
  const [imageFile, setImageFile] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [provider, setProvider] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [providerError, setProviderError] = useState(null);
  // 🟩 Load provider + token
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if (user && user.id) setProviderId(user.id);
    if (storedToken) setToken(storedToken);
  }, []);


  const fetchProviderData = async (forceRefresh = false) => {
      try {
      setLoadingProvider(true);
      setProviderError(null);


      const user = JSON.parse(localStorage.getItem("user"));
      const tokenLocal = localStorage.getItem("token");
      const idLocal = user?.id || user?.provider_id;


      if (!idLocal) {
      setProviderError("No provider ID found. Please log in again.");
      setLoadingProvider(false);
      return;
      }


      const cacheKey = `provider_${idLocal}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached && !forceRefresh) {
      try {
      const cachedData = JSON.parse(cached);
      setProvider(cachedData);
      setLoadingProvider(false);
      return;
      } catch (e) {
      console.warn("Failed to parse cached provider, fetching fresh.", e);
      }
      }


      const res = await fetch(`${API_URL}providers/${encodeURIComponent(idLocal)}`, {
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


  // 🟩 Fetch dropdown data
  const fetchDesigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/design`);
      setDesignList(res.data);
    } catch (err) {
      console.error("Error fetching design list:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`https://hanois.dotwibe.com/api/api/categories`);
      setCategoryList(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchDesigns();
    fetchCategories();
     fetchProviderData();
  }, []);

  // 🟩 Fetch existing project data
  const fetchProject = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects/${id}`);
      if (res.data.success) {
        const project = res.data.data.project;
        setFormData({
          title: project.title || "",
          notes: project.notes || "",
          projectType: project.project_type_id || "",
          location: project.location || "",
          landSize: project.land_size || "",
          designStyle: project.design_id || "",
        });
        setExistingImages(project.images || []);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  
  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  // 🟩 Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // 🟩 Handle file uploads
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImageFile((prev) => (prev ? [...prev, ...newFiles] : newFiles));
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  // 🟩 Delete existing image (from DB)
  const handleDeleteImage = async (imgId) => {
    try {
      await axios.delete(`${API_URL}/project-images/${imgId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  // 🟩 Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.notes.trim()) newErrors.notes = "Notes are required.";
    if (!formData.projectType) newErrors.projectType = "Project Type is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.landSize.trim()) newErrors.landSize = "Land Size is required.";
    if (!formData.designStyle) newErrors.designStyle = "Design Style is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🟩 Handle submit (update project)
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const formDataObj = new FormData();

    // 🟩 Basic project fields
    formDataObj.append("title", formData.title);
    formDataObj.append("notes", formData.notes);
    formDataObj.append("location", formData.location);
    formDataObj.append("land_size", formData.landSize);
    formDataObj.append("project_type_id", formData.projectType);
    formDataObj.append("design_id", formData.designStyle);

    // 🟩 Include which existing image is cover (if any)
    if (existingImages.length > 0) {
      const coverImage = existingImages.find((img) => img.is_cover);
      if (coverImage) {
        formDataObj.append("existing_cover_id", coverImage.id);
      }
    }

    // 🟩 Add newly uploaded images (if any)
    if (imageFile.length > 0) {
      imageFile.forEach((file) => {
        formDataObj.append("images", file);
        formDataObj.append("is_cover_flags[]", file.isCover ? "true" : "false");
      });
    }

    // 🟩 Send PUT-equivalent request (multipart/form-data safe)
    await axios.post(`${API_URL}/projects/${id}`, formDataObj, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    setModalVisible(true);
  } catch (err) {
    console.error("❌ Error updating project:", err);
    setMessage("❌ Failed to update project.");
  }
};


// // 🟩 Handle project delete
// const handleDelete = async () => {
//   if (!id) return alert("Invalid project ID.");

//   const confirmDelete = window.confirm("Are you sure you want to delete this project?");
//   if (!confirmDelete) return;

//   try {
//     await axios.delete(`${API_URL}/projects/${id}`, {
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//     });

//     alert("✅ Project deleted successfully!");
//     router.push("/provider/dashboard/projects");
//   } catch (err) {
//     console.error("❌ Error deleting project:", err);
//     alert("❌ Failed to delete project.");
//   }
// };




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
    provider?.professional_headline ||
    ""
    }
    />
    ) : (
    <DetailCard />
    )}      
      <TabBtns />

      <div className="">
        <div className="proj-form1 company-profile1">
          <h3>Edit Project</h3>
          <p>Update your project images and details below</p>

{/* 🟩 Combined Upload & Preview Grid */}
<div
  className="form-grp upload-area"
  
>
  {/* 🟦 Upload Box (first grid item) */}
  


  <div>




    <div
    className="upload-box"
    
    onClick={() => document.querySelector(".upload-input")?.click()}
    // onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
    // onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
  >

    <div className="cover-upload">
      <div className="img-cover-up">
              <Image src={uploadIcon} alt="Upload Icon" width={40} height={40} />


      </div>




    <h3>
      Upload an image
    </h3>
    <p>
      Browse your files to upload document
    </p>
    <span>
      Supported: JPEG, PNG
    </span>

    </div>





    

    {/* Hidden Input for Upload */}
  <input
    type="file"
    accept="image/*"
    multiple
    className="upload-input hidden"
    onChange={handleFileChange}
  />



  </div>
    
  

  

  {/* 🖼 Existing Images */}
  {existingImages.map((img, index) => (
    <div key={img.id} style={{ position: "relative" }}>
      <img
        src={`${IMG_URL}${img.image_path}`}
        alt="Project"
        
      />

      {/* 🗑 Delete Existing Image */}
      <button
        type="button"
        onClick={() => handleDeleteImage(img.id)}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
         
      
          border: "none",
          borderRadius: "50%",
          width: "22px",
          height: "22px",
          cursor: "pointer",
        }}
        className="img-onclose"
      >
        ✕
      </button>

      {/* 🌟 Set Cover */}
      <button
        type="button"
        onClick={() => {
          const updated = existingImages.map((image, i) => ({
            ...image,
            is_cover: i === index,
          }));
          setExistingImages(updated);
        }}
        className="setas-cover"
      >
        {img.is_cover ? "Cover Image" : "Set Cover"}
      </button>
    </div>
  ))}

  {/* 🆕 New Uploaded Image Previews */}
  {imageFile.map((file, index) => {
    const previewUrl = URL.createObjectURL(file);
    return (
      <div key={index} style={{ position: "relative" }}>
        <img
          src={previewUrl}
          alt="preview"
         
        />

        {/* 🗑 Remove New Image */}
        <button
          type="button"
          onClick={() =>
            setImageFile((prev) => prev.filter((_, i) => i !== index))
          }
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* 🌟 Set Cover */}
        <button
          type="button"
          onClick={() => {
            const updatedFiles = imageFile.map((f, i) =>
              Object.assign(f, { isCover: i === index })
            );
            setImageFile([...updatedFiles]);
          }}
          style={{
            position: "absolute",
            bottom: "5px",
            left: "5px",
            background: file.isCover ? "#0070f3" : "#ccc",
            color: "white",
            fontSize: "12px",
            padding: "2px 6px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {file.isCover ? "Cover Image" : "Set Cover"}
        </button>
      </div>
    );
  })}


</div>


</div>


          {/* 🟩 Form Section */}
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-grp">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" value={formData.title} onChange={handleChange} />
              {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
            </div>

            {/* Notes */}
            <div className="form-grp">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" value={formData.notes} onChange={handleChange} rows={4}></textarea>
              {errors.notes && <p style={{ color: "red" }}>{errors.notes}</p>}
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
              {errors.projectType && <p style={{ color: "red" }}>{errors.projectType}</p>}
            </div>

            {/* Location */}
            <div className="form-grp">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" value={formData.location} onChange={handleChange} />
              {errors.location && <p style={{ color: "red" }}>{errors.location}</p>}
            </div>

            {/* Land Size */}
            <div className="form-grp">
              <label htmlFor="landSize">Land Size</label>
              <input type="text" id="landSize" value={formData.landSize} onChange={handleChange} />
              {errors.landSize && <p style={{ color: "red" }}>{errors.landSize}</p>}
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
              {errors.designStyle && <p style={{ color: "red" }}>{errors.designStyle}</p>}
            </div>

            {/* Update Button */}
          <div
  className="btn-cvr"
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  }}
>
  {/* 🗑 Delete Button */}
<button
  type="button"
   className="save-btn1"
  onClick={() => setDeleteModalVisible(true)}
  
>
  Delete
</button>


  {/* 💾 Update Button */}
  <button
    type="submit"
    className="save-btn1"
   
  >
    Update
  </button>
</div>





          </form>

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
              }}

              className="project-edit-popup"
            >
              <div
                style={{
                  background: "white",
                  padding: "30px 40px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <h3 style={{ color: "green" }}>

                  <Image 
                  src={sucesstik}
                  alt="img"
                  width={40}
                  height={40}
                  />


                  
                  Project Updated!</h3>
                <p>Your project has been successfully updated.</p>
                <button
                  onClick={() => {
                    setModalVisible(false);
                    router.push("/provider/dashboard/projects");
                  }}
                  className="close-btnn1"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* 🟥 Delete Confirmation Modal */}
{deleteModalVisible && (
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
    }}
  >
    <div
      style={{
        background: "white",
        padding: "30px 40px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        width: "90%",
        maxWidth: "400px",
      }}
    >
      <h3 style={{ color: "#333" }}>Are you sure?</h3>
      <p style={{ marginTop: "10px", color: "#555" }}>
        Are you sure you want to delete this project? <br />
        This action cannot be undone.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <button
          onClick={() => setDeleteModalVisible(false)}
          style={{
            background: "#ccc",
            color: "#333",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            try {
              await axios.delete(`${API_URL}/projects/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });
              setDeleteModalVisible(false);
             
              router.push("/provider/dashboard/projects");
            } catch (err) {
              console.error("❌ Error deleting project:", err);
              alert("❌ Failed to delete project.");
            }
          }}
          style={{
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}



        </div>
      </div>
    </>
  );
};

export default EditProject;
