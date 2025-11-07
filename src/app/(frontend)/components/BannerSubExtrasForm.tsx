"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { API_URL } from "@/config";
import "react-quill-new/dist/quill.snow.css";
import "../../(admin)/admin/home/admin-home.css";

// 🟩 Dynamically import Quill (avoids SSR issues)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BannerSubExtrasForm() {
  const [formData, setFormData] = useState({
    subdescription: "",
    subbuttonname: "",
    arabicsubdescription: "",
    arabicsubbuttonname: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSource, setShowSource] = useState(false);

  // 🧠 Quill Toolbar Configuration (same as before)
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
          ["codeView"], // Custom source toggle button
        ],
        handlers: {
          codeView: function () {
            setShowSource((prev) => !prev);
          },
        },
      },
    }),
    []
  );

if (typeof window !== "undefined" && window.Quill) {
  const Quill = window.Quill;
  const icons = Quill.import("ui/icons");
  icons["codeView"] = `
    <svg viewBox="0 0 18 18">
      <polyline class="ql-even" points="5 7 3 9 5 11"></polyline>
      <polyline class="ql-even" points="13 7 15 9 13 11"></polyline>
      <line class="ql-even" x1="10" x2="8" y1="5" y2="13"></line>
    </svg>`;
}

  // 🟩 Fetch existing data (on mount)
  useEffect(() => {
    const fetchSubExtras = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}banner/subextras`);
        const data = res.data?.data?.subExtras || {};
        setFormData({
          subdescription: data.subdescription || "",
          subbuttonname: data.subbuttonname || "",
          arabicsubdescription: data.arabicsubdescription || "",
          arabicsubbuttonname: data.arabicsubbuttonname || "",
        });
      } catch (err) {
        console.error("❌ Error fetching sub extras:", err);
        setMessage("❌ Failed to load banner sub extras.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubExtras();
  }, []);

  // 🟩 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟩 Handle save/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.put(`${API_URL}banner/update-subextras`, formData);

      if (res.status === 200) {
        setMessage("✅ Banner Sub Extras updated successfully!");
      } else {
        setMessage("⚠️ Update failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
      setMessage("❌ Failed to update Banner Sub Extras.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="extras-form-container">
      <form onSubmit={handleSubmit} className="extras-form">
        {/* 🟩 Sub Description (English) - ReactQuill */}
        <div className="form-field">
          <label>Sub Description (English)</label>
          {showSource ? (
            <textarea
              name="subdescription"
              value={formData.subdescription}
              onChange={(e) =>
                setFormData({ ...formData, subdescription: e.target.value })
              }
              style={{
                width: "100%",
                height: "200px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "10px",
                fontFamily: "monospace",
                backgroundColor: "#1e1e1e",
                color: "#dcdcdc",
              }}
            />
          ) : (
            <ReactQuill
              theme="snow"
              value={formData.subdescription}
              onChange={(val) =>
                setFormData({ ...formData, subdescription: val })
              }
              modules={modules}
            />
          )}
        </div>

        {/* 🟩 Sub Button Name (English) */}
        <div className="form-field">
          <label>Sub Button Name (English)</label>
          <input
            type="text"
            name="subbuttonname"
            value={formData.subbuttonname}
            onChange={handleChange}
            placeholder="Enter English sub button name"
            required
          />
        </div>

        <hr />

        {/* 🟩 Arabic Section */}
        <div className="form-field" style={{ display: "none" }} >
          <label>Sub Description (Arabic)</label>
          <input
            type="text"
            className="text-right"
            name="arabicsubdescription"
            value={formData.arabicsubdescription}
            onChange={handleChange}
            placeholder="Enter Arabic sub description"
          
          />
        </div>

        <div className="form-field" style={{ display: "none" }}>
          <label>Sub Button Name (Arabic)</label>
          <input
            type="text"
            className="text-right"
            name="arabicsubbuttonname"
            value={formData.arabicsubbuttonname}
            onChange={handleChange}
            placeholder="Enter Arabic sub button name"
           
          />
        </div>

        {/* 🟩 Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* 🟩 Status Message */}
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
    </div>
  );
}
