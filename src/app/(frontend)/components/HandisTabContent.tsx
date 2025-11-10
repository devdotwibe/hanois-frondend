"use client";
import React, { useState, useEffect } from "react";
import { API_URL } from "@/config";

export default function HandisTabContent() {
  const [cards, setCards] = useState([
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" },
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" },
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" }, // 🟩 Added 3rd card
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟩 Fetch existing handis cards
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_listedhandis`);
        const data = await res.json();
if (data.success && Array.isArray(data.data.cards)) {
  const fetchedCards = data.data.cards.map((c: any) => ({
    handistitle: c.handistitle || "",
    handisbuttonname: c.handisbuttonname || "",
    image: null,
    imageUrl: c.image || "",
  }));

  // 🟩 Ensure there are always 3 cards
  while (fetchedCards.length < 3) {
    fetchedCards.push({
      handistitle: "",
      handisbuttonname: "",
      image: null,
      imageUrl: "",
    });
  }

  setCards(fetchedCards);
}

      } catch (err) {
        console.error("❌ Failed to fetch handis cards", err);
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
      formData.append("sectionKey", "get_listedhandis");

      cards.forEach((card, i) => {
        const index = i + 1;
        formData.append(`handis_${index}_title`, card.handistitle);
        formData.append(`handis_${index}_buttonname`, card.handisbuttonname);
        if (card.image) formData.append(`handis_${index}_image`, card.image);
      });

      const res = await fetch(`${API_URL}page/save`, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.success) {
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

  // 🟩 Update card field
  const updateCardField = (i: number, field: string, value: string) => {
    const updated = [...cards];
    updated[i][field] = value;
    setCards(updated);
  };

  // 🟩 Update card image
  const updateCardImage = (i: number, file: File | null) => {
    const updated = [...cards];
    updated[i].image = file;
    setCards(updated);
  };

  return (
    <form onSubmit={handleSubmit}>
      {cards.map((card, i) => (
        <div key={i} className="card-section" style={{ marginBottom: "20px" }}>
        
          <label>Title</label>
          <input
            type="text"
            value={card.handistitle}
            onChange={(e) => updateCardField(i, "handistitle", e.target.value)}
            required
          />


          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => updateCardImage(i, e.target.files?.[0] ?? null)}
          />

          {/* Display existing image */}
          {card.imageUrl && (
            <img
              src={`${API_URL.replace("api/", "")}${card.imageUrl}`}
              alt={`Handis Card ${i + 1}`}
              style={{
                width: "150px",
                marginTop: "10px",
                borderRadius: "8px",
                display: "block",
              }}
            />
          )}
          <hr />
        </div>
      ))}

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {message && (
        <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
