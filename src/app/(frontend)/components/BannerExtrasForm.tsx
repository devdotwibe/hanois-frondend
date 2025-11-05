"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";

export default function BannerExtrasForm() {
  const [data, setData] = useState({
    subtitle: "",
    subheading: "",
    buttonname: "",
    arabicsubtitle: "",
    arabicsubheading: "",
    arabicbuttonname: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟩 Fetch banner extras data on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // ✅ Use new API endpoint for extras only
        const res = await axios.get(`${API_URL}banner/extras`);
        const extras = res.data?.data?.extras || {};

        setData({
          subtitle: extras.subtitle || "",
          subheading: extras.subheading || "",
          buttonname: extras.buttonname || "",
          arabicsubtitle: extras.arabicsubtitle || "",
          arabicsubheading: extras.arabicsubheading || "",
          arabicbuttonname: extras.arabicbuttonname || "",
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
      const payload = { ...data };

      // ✅ Use new API endpoint for Tab 2 fields
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
        <label>Subtitle (English)</label>
        <input
          type="text"
          value={data.subtitle}
          onChange={(e) => setData({ ...data, subtitle: e.target.value })}
        />

        <label>Subheading (English)</label>
        <input
          type="text"
          value={data.subheading}
          onChange={(e) => setData({ ...data, subheading: e.target.value })}
        />

        <label>Button Name (English)</label>
        <input
          type="text"
          value={data.buttonname}
          onChange={(e) => setData({ ...data, buttonname: e.target.value })}
        />
      </div>

      <div className="form-section">
        <label>Subtitle (Arabic)</label>
        <input
          type="text"
          className="text-right"
          value={data.arabicsubtitle}
          onChange={(e) =>
            setData({ ...data, arabicsubtitle: e.target.value })
          }
        />

        <label>Subheading (Arabic)</label>
        <input
          type="text"
          className="text-right"
          value={data.arabicsubheading}
          onChange={(e) =>
            setData({ ...data, arabicsubheading: e.target.value })
          }
        />

        <label>Button Name (Arabic)</label>
        <input
          type="text"
          className="text-right"
          value={data.arabicbuttonname}
          onChange={(e) =>
            setData({ ...data, arabicbuttonname: e.target.value })
          }
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
