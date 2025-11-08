"use client";
import React, { useState, useEffect } from "react";
import { API_URL } from "@/config";

export default function HandisTabContent() {
  const [cards, setCards] = useState([
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" },
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing handis cards
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_listedhandis`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data.cards)) {
          setCards(
            data.data.cards.map((c) => ({
              handistitle: c.handistitle || "",
              handisbuttonname: c.handisbuttonname || "",
              image: null,
              imageUrl: c.image || "",
            }))
          );
        }
      } catch (err) {
        console.error("❌ Failed to fetch handis cards", err);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("sectionKey", "get_listedhandis");
      cards.forEach((card, i) => {
        formData.append(`handis_${i + 1}_title`, card.handistitle);
        formData.append(`handis_${i + 1}_buttonname`, card.handisbuttonname);
        if (card.image) formData.append(`handis_${i + 1}_image`, card.image);
      });

      const res = await fetch(`${API_URL}page/save`, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Handis cards saved successfully!");
      } else {
        setMessage(`❌ ${data.error || "Failed to save"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save handis cards");
    }
    setLoading(false);
  };

  const updateCardField = (i, field, value) => {
    const updated = [...cards];
    updated[i][field] = value;
    setCards(updated);
  };

  const updateCardImage = (i, file) => {
    const updated = [...cards];
    updated[i].image = file;
    setCards(updated);
  };

  return (
    <form onSubmit={handleSubmit}>
      {cards.map((card, i) => (
        <div key={i} className="card-section">
       
          <label>Title</label>
          <input
            type="text"
            value={card.handistitle}
            onChange={(e) => updateCardField(i, "handistitle", e.target.value)}
            required
          />

          <label>Button Name</label>
          <input
            type="text"
            value={card.handisbuttonname}
            onChange={(e) => updateCardField(i, "handisbuttonname", e.target.value)}
            required
          />

          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => updateCardImage(i, e.target.files?.[0] ?? null)}
          />

          {card.imageUrl && (
            <img
              src={`${API_URL.replace("api/", "")}${card.imageUrl}`}
              alt={`Handis Card ${i + 1}`}
              style={{ width: "150px", marginTop: "10px", borderRadius: "8px" }}
            />
          )}
          <hr />
        </div>
      ))}
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
      {message && (
        <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>
      )}
    </form>
  );
}
