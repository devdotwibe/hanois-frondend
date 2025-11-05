"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";

export default function BannerExtrasForm() {
  const [data, setData] = useState({
    subtitle_en: "",
    subheading_en: "",
    buttonname_en: "",
    subtitle_ar: "",
    subheading_ar: "",
    buttonname_ar: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟩 Fetch banner extras data on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}banner/extras`);
        const extras = res.data?.data?.extras || {};

        setData({
          subtitle_en: extras.subtitle || "",
          subheading_en: extras.subheading || "",
          buttonname_en: extras.buttonname || "",
          subtitle_ar: extras.arabicsubtitle || "",
          subheading_ar: extras.arabicsubheading || "",
          buttonname_ar: extras.arabicbuttonname || "",
        });
      } catch (err) {
        console.error("❌ Failed to fetch banner extras:", err);
        setMessage("❌ Unable to load banner extras data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🟩 Save or update banner extras
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        subtitle: data.subtitle_en,
        subheading: data.subheading_en,
        buttonname: data.buttonname_en,
        arabicsubtitle: data.subtitle_ar,
        arabicsubheading: data.subheading_ar,
        arabicbuttonname: data.buttonname_ar,
      };

      const res = await axios.put(`${API_URL}banner/update-extras`, payload);

      if (res.status === 200) {
        setMessage("✅ Extras saved successfully!");
      } else {
        setMessage("❌ Failed to save extras.");
      }
    } catch (err) {
      console.error("❌ Save failed:", err);
      setMessage("❌ Error saving extras.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <h2>Banner Extras (Tab 2)</h2>

      <div className="form-section">
        <h3>English Content</h3>

        <label>Subtitle (English)</label>
        <input
          type="text"
          value={data.subtitle_en}
          onChange={(e) => setData({ ...data, subtitle_en: e.target.value })}
        />

        <label>Subheading (English)</label>
        <input
          type="text"
          value={data.subheading_en}
          onChange={(e) => setData({ ...data, subheading_en: e.target.value })}
        />

        <label>Button Name (English)</label>
        <input
          type="text"
          value={data.buttonname_en}
          onChange={(e) => setData({ ...data, buttonname_en: e.target.value })}
        />
      </div>

      <div className="form-section">
        <h3>Arabic Content</h3>

        <label>Subtitle (Arabic)</label>
        <input
          type="text"
          className="text-right"
          value={data.subtitle_ar}
          onChange={(e) => setData({ ...data, subtitle_ar: e.target.value })}
        />

        <label>Subheading (Arabic)</label>
        <input
          type="text"
          className="text-right"
          value={data.subheading_ar}
          onChange={(e) => setData({ ...data, subheading_ar: e.target.value })}
        />

        <label>Button Name (Arabic)</label>
        <input
          type="text"
          className="text-right"
          value={data.buttonname_ar}
          onChange={(e) => setData({ ...data, buttonname_ar: e.target.value })}
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
  );
}
