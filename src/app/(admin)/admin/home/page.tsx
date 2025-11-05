"use client";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "@/config";
import "react-quill-new/dist/quill.snow.css";
import Quill from "quill";
import "./admin-home.css";
import BannerExtrasForm from "@/app/(frontend)/components/BannerExtrasForm";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
Quill.import("ui/icons")["source"] = "&lt;/&gt;";

const initialHeadings = { english: ["", "", ""], arabic: ["", "", ""] };
const initialImages = ["", "", ""];

export default function HomeAdminPage() {
  const [activeTab, setActiveTab] = useState(1);

  // 🧠 State management
  const [titles, setTitles] = useState({ en: "", ar: "" });
  const [descs, setDescs] = useState({ en: "", ar: "" });
  const [headings, setHeadings] = useState(initialHeadings);
  const [images, setImages] = useState(initialImages);
  const [ids, setIds] = useState({ en: null, ar: null });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🧠 Quill setup
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
          ["source"],
        ],
      },
    }),
    []
  );

  // 🟩 Fetch banners on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const banners = (await axios.get(`${API_URL}banner`)).data?.data?.banners || [];
        const getLang = (lang) => (lang || "").trim().toLowerCase();

        const en = banners.find((b) => getLang(b.language) === "en") || {};
        const ar = banners.find((b) => getLang(b.language) === "ar") || {};

        setTitles({ en: en.title || "", ar: ar.title || "" });
        setDescs({ en: en.description || "", ar: ar.description || "" });
        setHeadings({
          english: [en.heading1 || "", en.heading2 || "", en.heading3 || ""],
          arabic: [ar.heading1 || "", ar.heading2 || "", ar.heading3 || ""],
        });
        setImages([en.image1 || "", en.image2 || "", en.image3 || ""]);
        setIds({ en: en.id || null, ar: ar.id || null });
      } catch (err) {
        console.error("❌ Fetch failed:", err);
        setMessage("❌ Unable to load banner data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🟩 File upload (local preview only)
  const uploadFile = (idx) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const localPreview = URL.createObjectURL(file);
      setImages((prev) => prev.map((img, i) => (i === idx ? localPreview : img)));
    };
  };

  // 🟩 Save or update banner
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        engtitle: titles.en, // Backend expects these keys for request mapping
        engdescription: descs.en,
        arabtitle: titles.ar,
        arabdescription: descs.ar,
        englishheading1: headings.english[0],
        englishheading2: headings.english[1],
        englishheading3: headings.english[2],
        arabicheading1: headings.arabic[0],
        arabicheading2: headings.arabic[1],
        arabicheading3: headings.arabic[2],
        image1: images[0] || "",
        image2: images[1] || "",
        image3: images[2] || "",
      };

      const endpoint = ids.en || ids.ar ? `${API_URL}banner/update-single` : `${API_URL}banner`;
      const method = ids.en || ids.ar ? "put" : "post";

      const res = await axios[method](endpoint, payload);
      setMessage(
        res.status === 200 || res.status === 201
          ? "✅ Banner saved successfully!"
          : "❌ Failed to save banner."
      );
    } catch (err) {
      console.error("❌ Save failed:", err);
      setMessage("❌ Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  const renderHeadingsInputs = (label, array, index) =>
    [0, 1, 2].map((i) => (
      <input
        key={`${label}-${i}`}
        type="text"
        placeholder={`${label} ${i + 1}`}
        value={array[i]}
        className={label.startsWith("Arabic") ? "text-right" : ""}
        onChange={(e) => {
          const newArr = [...array];
          newArr[i] = e.target.value;
          setHeadings((prev) => ({ ...prev, [index]: newArr }));
        }}
      />
    ));

  return (
    <div className="container">
      <h1>Home Page</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          type="button"
          className={activeTab === 1 ? "tab active" : "tab"}
          onClick={() => setActiveTab(1)}
        >
          Tab 1
        </button>
        <button
          type="button"
          className={activeTab === 2 ? "tab active" : "tab"}
          onClick={() => setActiveTab(2)}
        >
          Tab 2
        </button>
      </div>

      {/* 🟩 Tab 1: Banner Form */}
      {activeTab === 1 && (
        <form onSubmit={handleSave}>
          <div className="section">
            <label>Title (English)</label>
            <input
              type="text"
              value={titles.en}
              required
              onChange={(e) => setTitles({ ...titles, en: e.target.value })}
            />
            <div className="form-field">
              <label>Description (English)</label>
              <ReactQuill
                theme="snow"
                value={descs.en}
                onChange={(v) => setDescs((prev) => ({ ...prev, en: v }))}
                modules={modules}
              />
            </div>
          </div>

          <div className="section">
            <label>Title (Arabic)</label>
            <input
              type="text"
              className="text-right"
              value={titles.ar}
              onChange={(e) => setTitles({ ...titles, ar: e.target.value })}
            />
            <div className="form-field">
              <label>Description (Arabic)</label>
              <ReactQuill
                theme="snow"
                value={descs.ar}
                onChange={(v) => setDescs((prev) => ({ ...prev, ar: v }))}
                modules={modules}
              />
            </div>
          </div>

          <div className="form-field">
            <label>English Headings</label>
            {renderHeadingsInputs("English Heading", headings.english, "english")}
            <label>Arabic Headings</label>
            {renderHeadingsInputs("Arabic Heading", headings.arabic, "arabic")}

            {[0, 1, 2].map((i) => (
              <div key={i}>
                <label>Upload Image {i + 1}</label>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => uploadFile(i)}
                >
                  Upload
                </button>
                {images[i] && (
                  <img
                    src={images[i]}
                    alt={`Preview Image ${i + 1}`}
                    style={{
                      width: "180px",
                      borderRadius: "8px",
                      marginTop: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? ids.en || ids.ar
                ? "Updating..."
                : "Creating..."
              : ids.en || ids.ar
              ? "Update Banner"
              : "Create Banner"}
          </button>

          {message && (
            <p
              className={`message ${
                message.includes("✅")
                  ? "success"
                  : message.includes("⚠️")
                  ? "warning"
                  : "error"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      )}

      {/* 🟩 Tab 2: Banner Extras Form */}
      {activeTab === 2 && (
        <div className="tab-content">
          <BannerExtrasForm />
        </div>
      )}
    </div>
  );
}
