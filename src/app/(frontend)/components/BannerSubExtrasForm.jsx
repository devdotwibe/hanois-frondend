"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import "../../(admin)/admin/home/admin-home.css";

export default function BannerSubExtrasForm() {
  const [formData, setFormData] = useState({
    subdescription: "",
    subbuttonname: "",
    arabicsubdescription: "",
    arabicsubbuttonname: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  // 🟩 Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟩 Submit updated sub extras
  const handleSubmit = async (e) => {
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
        <div className="form-field">
          <label>Sub Description (English)</label>
          <input
            type="text"
            name="subdescription"
            value={formData.subdescription}
            onChange={handleChange}
            placeholder="Enter sub description in English"
            required
          />
        </div>

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

        <div className="form-field">
          <label>Sub Description (Arabic)</label>
          <input
            type="text"
            className="text-right"
            name="arabicsubdescription"
            value={formData.arabicsubdescription}
            onChange={handleChange}
            placeholder="Enter Arabic sub description"
            required
          />
        </div>

        <div className="form-field">
          <label>Sub Button Name (Arabic)</label>
          <input
            type="text"
            className="text-right"
            name="arabicsubbuttonname"
            value={formData.arabicsubbuttonname}
            onChange={handleChange}
            placeholder="Enter Arabic sub button name"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
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
    </div>
  );
}
