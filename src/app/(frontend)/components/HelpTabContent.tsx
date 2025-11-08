"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/config";

export default function HelpTabContent() {
  const [card, setCard] = useState({ helptext: "", helpbuttonname: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟩 Fetch existing Help Card
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_listedhelp`);
        const data = await res.json();
        if (data.success && data.data?.card) {
          setCard({
            helptext: data.data.card.helptext || "",
            helpbuttonname: data.data.card.helpbuttonname || "",
          });
        }
      } catch (err) {
        console.error("❌ Failed to fetch help card", err);
      }
    })();
  }, []);

  // 🟩 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("sectionKey", "get_listedhelp");
      formData.append("helptext_1", card.helptext);
      formData.append("helpbuttonname_1", card.helpbuttonname);

      const res = await fetch(`${API_URL}page/save`, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Help card saved successfully!");
        // Reload updated data
        const refreshed = await (await fetch(`${API_URL}page/get?sectionKey=get_listedhelp`)).json();
        if (refreshed.success && refreshed.data?.card) {
          setCard({
            helptext: refreshed.data.card.helptext || "",
            helpbuttonname: refreshed.data.card.helpbuttonname || "",
          });
        }
      } else {
        setMessage(`❌ ${data.error || "Failed to save"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save help card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Title</label>
        <input
          type="text"
          value={card.helptext}
          onChange={(e) => setCard({ ...card, helptext: e.target.value })}
          required
        />
      </div>

      <div className="form-field">
        <label>Button Name</label>
        <input
          type="text"
          value={card.helpbuttonname}
          onChange={(e) => setCard({ ...card, helpbuttonname: e.target.value })}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {message && (
        <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>
      )}
    </form>
  );
}
