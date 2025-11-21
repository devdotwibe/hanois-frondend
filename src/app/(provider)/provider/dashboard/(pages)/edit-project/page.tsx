"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import uploadIcon from "../../../../../../../public/images/upload.svg";
import { API_URL, IMG_URL } from "@/config";
import DetailCard from "@/app/(directory)/provider/Components/DetailCard";

import TabBtns from "../../Components/TabBtns";
import { useRouter, useSearchParams } from "next/navigation";

import sucesstik from "../../../../../../../public/images/tik.svg";

const EditProject = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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

  // ➤ PREVIEW TOGGLE
  const [showPreview, setShowPreview] = useState(false);

  const getProjectTypeName = () => {
  const item = categoryList.find(c => c.id == formData.projectType);
  return item ? item.name : "";
};

const getDesignStyleName = () => {
  const item = designList.find(d => d.id == formData.designStyle);
  return item ? item.name : "";
};



  // ------------------------------------------
  // LOAD PROVIDER DATA
  // ------------------------------------------
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
          setProvider(JSON.parse(cached));
          setLoadingProvider(false);
          return;
        } catch {}
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
      localStorage.setItem(cacheKey, JSON.stringify(providerData));
    } catch {
      setProviderError("Failed to load provider data.");
    } finally {
      setLoadingProvider(false);
    }
  };

  // ------------------------------------------
  // FETCH DESIGN + CATEGORY
  // ------------------------------------------
  const fetchDesigns = async () => {
    const res = await axios.get(`${API_URL}/design`);
    setDesignList(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`https://hanois.dotwibe.com/api/api/categories`);
    setCategoryList(res.data);
  };

  useEffect(() => {
    fetchDesigns();
    fetchCategories();
    fetchProviderData();
  }, []);

  // ------------------------------------------
  // FETCH EXISTING PROJECT
  // ------------------------------------------
  const fetchProject = async () => {
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

      // SAVE EXISTING IMAGES
      setExistingImages(project.images || []);
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  // ------------------------------------------
  // INPUT CHANGES
  // ------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isCover: false,
    }));
    setImageFile((prev) => [...prev, ...newFiles]);
  };

  // ------------------------------------------
  // DELETE EXISTING IMAGE
  // ------------------------------------------
  const handleDeleteImage = async (imgId) => {
    await axios.delete(`${API_URL}/project-images/${imgId}`);
    setExistingImages(existingImages.filter((img) => img.id !== imgId));
  };

  // ------------------------------------------
  // VALIDATE FORM
  // ------------------------------------------
  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.notes) newErrors.notes = "Notes are required.";
    if (!formData.projectType) newErrors.projectType = "Project Type is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.landSize) newErrors.landSize = "Land Size is required.";
    if (!formData.designStyle) newErrors.designStyle = "Design Style is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------------------
  // UPDATE PROJECT (SUBMIT FORM)
  // ------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataObj = new FormData();

    formDataObj.append("title", formData.title);
    formDataObj.append("notes", formData.notes);
    formDataObj.append("location", formData.location);
    formDataObj.append("land_size", formData.landSize);
    formDataObj.append("project_type_id", formData.projectType);
    formDataObj.append("design_id", formData.designStyle);

    const coverExisting = existingImages.find((img) => img.is_cover);
    if (coverExisting) {
      formDataObj.append("existing_cover_id", coverExisting.id);
    }

    imageFile.forEach((img) => {
      formDataObj.append("images", img.file);
      formDataObj.append("is_cover_flags[]", img.isCover ? "true" : "false");
    });

    await axios.post(`${API_URL}/projects/${id}`, formDataObj, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    setModalVisible(true);
  };

  // ------------------------------------------
  // PREVIEW COMPONENT
  // ------------------------------------------
  const PreviewComponent = ({ data, existingImages, newImages, onBack }) => {
    const allImages = [
      ...existingImages.map((img) => ({
        url: `${IMG_URL}${img.image_path}`,
        isCover: img.is_cover,
      })),
      ...newImages.map((img) => ({
        url: img.previewUrl,
        isCover: img.isCover,
      })),
    ];

    const coverImage = allImages.find((i) => i.isCover);
    const otherImages = allImages.filter((i) => !i.isCover);

    return (
      <div className="preview-wrapper">
        <button className="back-bth" onClick={onBack}>
          Back
        </button>

        {coverImage && (
          <div className="prov-pro-img">
            <img src={coverImage.url} className="project-img" />
          </div>
        )}

        <div className="project-details detailed">
          <h2 className="project-title">{data.title}</h2>

          <h3 className="about-title">About</h3>
          <p className="about-text">{data.notes}</p>
        </div>

        {otherImages.map((img, idx) => (
          <div key={idx} className="prov-pro-img">
            <img src={img.url} className="project-img" />
          </div>
        ))}

        <div className="proj-details">
          <h3 className="scope-title">Project Details</h3>
          <p>
            <strong>Location</strong> — {data.location}
          </p>
          <p>
         <strong>Style</strong> — {getDesignStyleName()}

          </p>
          <p>
           <strong>Type</strong> — {getProjectTypeName()}
          </p>
          <p>
            <strong>Space Size</strong> — {data.landSize} m²
          </p>
        </div>
      </div>
    );
  };

  // ------------------------------------------
  // MAIN RETURN (WITH PREVIEW)
  // ------------------------------------------
  return showPreview ? (
    <PreviewComponent
      data={formData}
      existingImages={existingImages}
      newImages={imageFile}
      onBack={() => setShowPreview(false)}
    />
  ) : (
    <>
      {/* Provider Section */}
      {loadingProvider ? (
        <p>Loading provider...</p>
      ) : providerError ? (
        <p style={{ color: "red" }}>{providerError}</p>
      ) : provider ? (
        <DetailCard
          logo={
            provider?.image ? `${IMG_URL}${provider.image}` : "/path/to/logo.png"
          }
          name={provider?.name || "Unknown Provider"}
          description={provider?.professional_headline || ""}
        />
      ) : (
        <DetailCard />
      )}

      <TabBtns />

      <div className="edit-proj-up">
        {/* Success Modal */}
        {modalVisible && (
          <div className="edit-proj-sucess add-sucess">
            <p>
              <span>
                <Image src={sucesstik} alt="img" width={18} height={18} />
              </span>
              Your project has been successfully updated.
            </p>
          </div>
        )}

        <div className="proj-form1 company-profile1">
          <h3>Edit Project</h3>

          {/* -------- Images Section -------- */}
          <div className="form-grp upload-area">
            {/* Upload */}
            <div>
              <div
                className="upload-box"
                onClick={() => document.querySelector(".upload-input")?.click()}
              >
                <div className="cover-upload">
                  <div className="img-cover-up">
                    <Image src={uploadIcon} alt="Upload" width={40} height={40} />
                  </div>
                  <h3>Upload an image</h3>
                  <p>Browse your files to upload document</p>
                  <span>Supported: JPEG, PNG</span>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="upload-input hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Existing Images */}
              {existingImages.map((img, index) => (
                <div key={img.id} style={{ position: "relative" }}>
                  <img src={`${IMG_URL}${img.image_path}`} />

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="img-onclose"
                  >
                    ✕
                  </button>

                  <button
                    type="button"
                    className="setas-cover"
                    onClick={() => {
                      const updated = existingImages.map((image, i) => ({
                        ...image,
                        is_cover: i === index,
                      }));
                      setExistingImages(updated);
                    }}
                  >
                    {img.is_cover ? "Cover Image" : "Set Cover"}
                  </button>
                </div>
              ))}

              {/* New Images */}
              {imageFile.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img src={img.previewUrl} />

                  <button
                    className="img-onclose"
                    onClick={() =>
                      setImageFile((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    ✕
                  </button>

                  <button
                    className="setas-cover"
                    onClick={() => {
                      const updated = imageFile.map((f, i) =>
                        Object.assign(f, { isCover: i === index })
                      );
                      setImageFile([...updated]);
                    }}
                    style={{
                      background: img.isCover ? "#2050f5" : "#ccc",
                    }}
                  >
                    {img.isCover ? "Cover Image" : "Set Cover"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* -------- Form Section -------- */}
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-grp">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
            </div>

            {/* Notes */}
            <div className="form-grp">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
              />
              {errors.notes && <p style={{ color: "red" }}>{errors.notes}</p>}
            </div>

            {/* Dropdowns */}
            <div className="form-grp">
              <label htmlFor="projectType">Project Type</label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={handleChange}
              >
                <option value="">Select Project Type</option>
                {categoryList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <p style={{ color: "red" }}>{errors.projectType}</p>
              )}
            </div>

            <div className="form-grp">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && (
                <p style={{ color: "red" }}>{errors.location}</p>
              )}
            </div>

            <div className="form-grp">
              <label htmlFor="landSize">Land Size</label>
              <input
                id="landSize"
                value={formData.landSize}
                onChange={handleChange}
              />
              {errors.landSize && (
                <p style={{ color: "red" }}>{errors.landSize}</p>
              )}
            </div>

            <div className="form-grp">
              <label htmlFor="designStyle">Design Style</label>
              <select
                id="designStyle"
                value={formData.designStyle}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {designList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.designStyle && (
                <p style={{ color: "red" }}>{errors.designStyle}</p>
              )}
            </div>

            {/* -------- Buttons -------- */}
            <div className="btn-cvr" style={{ display: "flex", gap: "10px" }}>
              
              {/* ➤ Preview Button */}
              <button
                type="button"
                className="preview-btn"
                onClick={() => setShowPreview(true)}
              >
                Preview
              </button>

              {/* Delete */}
              <button
                type="button"
                className="save-btn1"
                onClick={() => setDeleteModalVisible(true)}
              >
                Delete
              </button>

              {/* Update */}
              <button type="submit" className="save-btn1">
                Update
              </button>
            </div>
          </form>

          {/* Delete modal */}
          {deleteModalVisible && (
            <div className="delete-modal-bg">
              <div className="delete-modal">
                <h3>Are you sure?</h3>
                <p>This action cannot be undone.</p>

                <div className="delete-modal-buttons">
                  <button onClick={() => setDeleteModalVisible(false)}>
                    Cancel
                  </button>

                  <button
                    onClick={async () => {
                      await axios.delete(`${API_URL}/projects/${id}`);
                      router.push("/provider/dashboard/projects");
                    }}
                    className="danger-btn"
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
