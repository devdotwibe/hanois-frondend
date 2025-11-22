"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import uploadIcon from "../../../../../../../public/images/upload.svg";
import sucesstik from "../../../../../../../public/images/tik.svg";
import { API_URL, IMG_URL } from "@/config";
import DetailCard from "@/app/(directory)/provider/Components/DetailCard";
import TabBtns from "../../Components/TabBtns";
import { useRouter } from "next/navigation";
import img2 from "../../../../../../../public/images/left-arrow.svg";



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

  // Provider
  const [provider, setProvider] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [providerError, setProviderError] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
const [notesCount, setNotesCount] = useState(1024);




  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("token");

      if (user?.id) setProviderId(user.id);
      if (storedToken) setToken(storedToken);
    } catch (err) {
      console.error("LOCAL STORAGE ERROR:", err);
    }
  }, []);

  const fetchProviderData = async () => {
    try {
      setLoadingProvider(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const id = user?.id || user?.provider_id;
      const tokenLocal = localStorage.getItem("token");

      if (!id) {
        setProviderError("No provider id found, login again.");
        return;
      }

      const res = await fetch(`${API_URL}providers/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenLocal ? `Bearer ${tokenLocal}` : "",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setProviderError("Cannot load provider.");
        return;
      }

      setProvider(data?.provider);
    } catch (err) {
      setProviderError("Error loading provider.");
    } finally {
      setLoadingProvider(false);
    }
  };

  const fetchDesigns = async () => {
    try {
      const res = await axios.get(`${API_URL}design`);
      setDesignList(res.data);
    } catch (err) {}
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}categories`);

      setCategoryList(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProviderData();
    fetchDesigns();
    fetchCategories();
  }, []);
const handleChange = (e) => {
  const { id, value } = e.target;

  // Notes field special case
  if (id === "notes") {
    if (value.length <= 1024) {
      setFormData((prev) => ({ ...prev, [id]: value }));
      setNotesCount(1024 - value.length);
    }
  } else {
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  setErrors((prev) => ({ ...prev, [id]: "" }));
};

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isCover: false,
    }));

    setImageFile((prev) => (prev ? [...prev, ...mapped] : mapped));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.notes.trim()) newErrors.notes = "Notes are required.";
    if (!formData.projectType) newErrors.projectType = "Project Type is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.landSize.trim()) newErrors.landSize = "Land Size is required.";
    if (!formData.designStyle) newErrors.designStyle = "Design Style is required.";
    if (!imageFile || imageFile.length === 0)
      newErrors.images = "Please upload at least one image.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const user = JSON.parse(localStorage.getItem("user"));
    const providerIdLocal = user?.id || user?.provider_id;

    if (!providerIdLocal) {
      setMessage("❌ Login again.");
      return;
    }

    if (!validateForm()) return;

    try {
      const formDataObj = new FormData();
      formDataObj.append("provider_id", providerIdLocal);
      formDataObj.append("title", formData.title);
      formDataObj.append("notes", formData.notes);
      formDataObj.append("location", formData.location);
      formDataObj.append("land_size", formData.landSize);
      formDataObj.append("project_type_id", formData.projectType);
      formDataObj.append("design_id", formData.designStyle);

      imageFile.forEach((file) => {
        formDataObj.append("images", file.file);
        formDataObj.append("is_cover_flags[]", file.isCover ? "true" : "false");
      });

      await axios.post(`${API_URL}/projects`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

    setModalVisible(true);

setTimeout(() => {
  router.push("/provider/dashboard/projects");
}, 1000);


      setFormData({
        title: "",
        notes: "",
        projectType: "",
        location: "",
        landSize: "",
        designStyle: "",
      });
      setImageFile(null);
    } catch (err) {
      setMessage("❌ Project save failed.");
    }
  };

  // --- PREVIEW COMPONENT ---
  const PreviewComponent = ({ data, images, onBack }) => {
    const coverImage = images?.find((i) => i.isCover)?.previewUrl;
    const otherImages = images?.filter((i) => !i.isCover);

    return (
      <div className="preview-wrapper">
      <button className="back-bth" onClick={onBack}>
  <Image src={img2} alt="Back" width={40} height={40} />
</button>


        {coverImage && (
          <div className="prov-pro-img">
            <img src={coverImage} className="project-img" />
          </div>
        )}

        <div className="project-details detailed">
          <h2 className="project-title">{data.title}</h2>
          <p className="project-type">{data.projectType}</p>
          <h3 className="about-title">About</h3>
          <p className="about-text">{data.notes}</p>
        </div>

        {otherImages?.map((img, idx) => (
          <div key={idx} className="prov-pro-img">
            <img src={img.previewUrl} className="project-img" />
          </div>
        ))}

        <div className="proj-details">
          <h3 className="scope-title">Project Details</h3>
          <p><strong>Location</strong> — {data.location}</p>
          <p><strong>Style</strong> — {data.designStyle}</p>
          <p><strong>Type</strong> — {data.projectType}</p>
          <p><strong>Space Size</strong> — {data.landSize} m²</p>
        </div>
      </div>
    );
  };

  // =====================
  //       RETURN
  // =====================

  return (
    <>
      {showPreview ? (
        <PreviewComponent
          data={formData}
          images={imageFile}
          onBack={() => setShowPreview(false)}
        />
      ) : (
        <>
          {loadingProvider ? (
            <p>Loading provider...</p>
          ) : providerError ? (
            <p style={{ color: "red" }}>{providerError}</p>
          ) : (
            <DetailCard
              logo={provider?.image ? `${IMG_URL}${provider.image}` : "/logo.png"}
              name={provider?.name}
              description={provider?.professional_headline}
            />
          )}

          <TabBtns />

          <div className="add-proj-up">
            {modalVisible && (
              <div className="add-proj-sucess add-sucess">
                <p>
                  <span>
                    <Image src={sucesstik} alt="img" width={18} height={18} />
                  </span>
                  Your project has been successfully saved.
                </p>
              </div>
            )}

            <div className="proj-form1 company-profile1 upload-page">
              <h3>Images</h3>
              <p>Upload your project images and details below</p>

              <div className="form-grp upload-area">
                <div>
                  <div
                    className="upload-box"
                    onClick={() => document.querySelector(".upload-input")?.click()}
                  >
                    <div className="cover-upload">
                      <div className="img-cover-up">
                        <Image src={uploadIcon} width={40} height={40} alt="" />
                      </div>
                      <h3>Upload an image</h3>
                      <p>Browse files to upload</p>
                      <span>JPEG, PNG</span>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="upload-input hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {imageFile?.map((file, index) => (
                    <div key={index}>
                      <img src={file.previewUrl} className="preview-img" />
                      <button
                        className="img-onclose"
                        type="button"
                        onClick={() =>
                          setImageFile((prev) => prev.filter((_, i) => i !== index))
                        }
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        className={`setas-cover ${file.isCover ? "cover-btn" : "set-btn"}`}

                        onClick={() => {
                          const updated = imageFile.map((f, i) =>
                            ({ ...f, isCover: i === index })
                          );
                          setImageFile(updated);
                        }}
                      >
                        {file.isCover ? "Cover Image" : "Set Cover"}

                      </button>
                    </div>
                  ))}
                </div>

                {errors.images && (
                  <p style={{ color: "red" }}>{errors.images}</p>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grp">
                  <label>Title</label>
                  <input id="title" value={formData.title} onChange={handleChange} />
                  {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
                </div>

               <div className="form-grp">
  <label>Notes</label>

  <textarea
    id="notes"
    value={formData.notes}
    maxLength={1024}
    onChange={handleChange}
  />

  {/* helper text */}
  <p style={{ fontSize: "12px", color: "#9A9A9A", marginTop: "6px" }}>
    Brief description for your profile. URLs are hyperlinked.
  </p>

  {/* character count */}
  <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
    {notesCount}
  </p>

  {errors.notes && <p style={{ color: "red" }}>{errors.notes}</p>}
</div>


                <div className="form-grp">
  <label>Project Type</label>

  <select
    id="projectType"
    value={formData.projectType}
    onChange={handleChange}
  >
    <option value="">Select</option>

    {provider?.categories_id?.map((catId) => {
      const cat = categoryList.find((c) => c.id === catId);
      if (!cat) return null;

      return (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      );
    })}
  </select>

  {errors.projectType && (
    <p style={{ color: "red" }}>{errors.projectType}</p>
  )}
</div>

                <div className="form-grp">
                  <label>Location</label>
                  <input id="location" value={formData.location} onChange={handleChange} />
                  {errors.location && <p style={{ color: "red" }}>{errors.location}</p>}
                </div>

                <div className="form-grp">
                  <label>Land Size</label>
                  <input id="landSize" value={formData.landSize} onChange={handleChange} />
                  {errors.landSize && <p style={{ color: "red" }}>{errors.landSize}</p>}
                </div>

                <div className="form-grp">
                  <label>Design Style</label>
                  <select id="designStyle" value={formData.designStyle} onChange={handleChange}>
                    <option value="">Select</option>
                    {designList.map((design) => (
                      <option key={design.id} value={design.id}>
                        {design.name}
                      </option>
                    ))}
                  </select>
                  {errors.designStyle && (
                    <p style={{ color: "red" }}>{errors.designStyle}</p>
                  )}
                </div>

                <div className="btn-cvr">
                  <button type="button" className="preview-btn dark-lined-btn" onClick={() => setShowPreview(true)}>
                    Preview
                  </button>
                  <button type="submit" className="save-btn1 dark-btn">
                    Save
                  </button>
                </div>
              </form>

              {message && (
                <p style={{ color: message.includes("❌") ? "red" : "green" }}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UploadBox;
