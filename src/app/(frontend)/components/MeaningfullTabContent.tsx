"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/config";

export default function MeaningfullTabContent() {
  const [card, setCard] = useState({ meaningfull: "", image: null as File | null, imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_listedmeaningfull`);
        const data = await res.json();
        if (data.success && data.data?.card) {
          setCard({
            meaningfull: data.data.card.meaningfull || "",
            image: null,
            imageUrl: data.data.card.image || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch meaningful card", err);
      }
    })();
  }, []);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCard(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("sectionKey", "get_listedmeaningfull");
      formData.append("meaningfull_1", card.meaningfull);
      if (card.image) formData.append("meaningfull_1_image", card.image);

      // debug: log entries if needed
      // for (const pair of formData.entries()) console.log(pair[0], pair[1]);

      const res = await fetch(`${API_URL}page/save`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Meaningfull card saved!");
        // refresh to load new image URL
        const refreshed = await (await fetch(`${API_URL}page/get?sectionKey=get_listedmeaningfull`)).json();
        if (refreshed.success && refreshed.data?.card) {
          setCard({
            meaningfull: refreshed.data.card.meaningfull || "",
            image: null,
            imageUrl: refreshed.data.card.image || "",
          });
        }
      } else {
        setMessage(`❌ ${data.error || "Failed to save"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error while saving");
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
          value={card.meaningfull}
          onChange={(e) => setCard(prev => ({ ...prev, meaningfull: e.target.value }))}
          required
        />
      </div>

      <div className="form-field">
        <label>Image</label>
        <input type="file" accept="image/*" onChange={onImageChange} />
        {card.image && (
          <img src={URL.createObjectURL(card.image)} alt="preview" style={{ width: 150, marginTop: 8 }} />
        )}
        {!card.image && card.imageUrl && (
          <img src={`${API_URL.replace("api/", "")}${card.imageUrl}`} alt="existing" style={{ width: 150, marginTop: 8 }} />
        )}
      </div>

      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>

      {message && <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
    </form>
  );
}
