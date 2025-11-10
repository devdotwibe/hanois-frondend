"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "../../(admin)/admin/home/admin-home.css";

// 🟩 Load Quill dynamically (avoids SSR issues)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BannerExtrasForm() {
  const [data, setData] = useState({
    subtitle_en: "",
    subheading_en: "",
    buttonname_en: "",
    subtitle_ar: "",
    subheading_ar: "",
    buttonname_ar: "",
    subdescription_en: "",
    subbuttonname_en: "",
    subdescription_ar: "",
    subbuttonname_ar: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSource, setShowSource] = useState(false);

  // 🧠 Quill Toolbar Configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
          ["showHtml"], // custom button
        ],
        handlers: {
          showHtml: function () {
            setShowSource((prev) => !prev);
          },
        },
      },
    }),
    []
  );

  // 🟩 Fetch banner extras and subextras on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [extrasRes, subRes] = await Promise.all([
          axios.get(`${API_URL}banner/extras`),
          axios.get(`${API_URL}banner/subextras`),
        ]);

        const extras = extrasRes.data?.data?.extras || {};
        const sub = subRes.data?.data?.subExtras || {};

        setData({
          subtitle_en: extras.subtitle || "",
          subheading_en: extras.subheading || "",
          buttonname_en: extras.buttonname || "",
          subtitle_ar: extras.arabicsubtitle || "",
          subheading_ar: extras.arabicsubheading || "",
          buttonname_ar: extras.arabicbuttonname || "",
          subdescription_en: sub.subdescription || "",
          subbuttonname_en: sub.subbuttonname || "",
          subdescription_ar: sub.arabicsubdescription || "",
          subbuttonname_ar: sub.arabicsubbuttonname || "",
        });
      } catch (err) {
        console.error("❌ Failed to fetch banner extras:", err);
        setMessage("❌ Unable to load banner extras data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🟩 Save or update banner extras + subextras
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await Promise.all([
        axios.put(`${API_URL}banner/update-extras`, {
          subtitle: data.subtitle_en,
          subheading: data.subheading_en,
          buttonname: data.buttonname_en,
          arabicsubtitle: data.subtitle_ar,
          arabicsubheading: data.subheading_ar,
          arabicbuttonname: data.buttonname_ar,
        }),
        axios.put(`${API_URL}banner/update-subextras`, {
          subdescription: data.subdescription_en,
          subbuttonname: data.subbuttonname_en,
          arabicsubdescription: data.subdescription_ar,
          arabicsubbuttonname: data.subbuttonname_ar,
        }),
      ]);

      setMessage("✅ Banner Extras and Sub Extras saved successfully!");
    } catch (err) {
      console.error("❌ Save failed:", err);
      setMessage("❌ Error saving banner extras.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      {/* 🟩 ENGLISH SECTION */}
      <div className="form-section">
      

        {/* Subtitle */}
        <label>Subtitle</label>
        {showSource ? (
          <textarea
            value={data.subtitle_en}
            onChange={(e) =>
              setData({ ...data, subtitle_en: e.target.value })
            }
            style={{ width: "100%", height: "200px" }}
          />
        ) : (
          <ReactQuill
            theme="snow"
            value={data.subtitle_en}
            onChange={(val) => setData({ ...data, subtitle_en: val })}
            modules={modules}
          />
        )}

      
        <hr />

        {/* 🟩 Sub Description (merged from Tab 3) */}
        <label>Sub Description</label>
        {showSource ? (
          <textarea
            value={data.subdescription_en}
            onChange={(e) =>
              setData({ ...data, subdescription_en: e.target.value })
            }
            style={{ width: "100%", height: "200px" }}
          />
        ) : (
          <ReactQuill
            theme="snow"
            value={data.subdescription_en}
            onChange={(val) => setData({ ...data, subdescription_en: val })}
            modules={modules}
          />
        )}

    
      </div>

      {/* 🟨 ARABIC SECTION (hidden) */}
      <div className="form-section" style={{ display: "none" }}>
        <h3>Arabic Content</h3>

        <label>Subtitle (Arabic)</label>
        <ReactQuill
          theme="snow"
          value={data.subtitle_ar}
          onChange={(val) => setData({ ...data, subtitle_ar: val })}
          modules={modules}
        />

    

     

        <label>Sub Description (Arabic)</label>
        <input
          type="text"
          className="text-right"
          value={data.subdescription_ar}
          onChange={(e) =>
            setData({ ...data, subdescription_ar: e.target.value })
          }
        />

      
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
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
  );
}
