"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { API_URL } from "@/config";
import HtmlToggleEditor from "../../(admin)/admin/components/HtmlToggleEditor";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function HandisTabContent() {
  const [cards, setCards] = useState([
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" },
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" },
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" },
    { handistitle: "", handisbuttonname: "", image: null, imageUrl: "" }, // 🟩 4th card
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
      ],
    }),
    []
  );

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

          while (fetchedCards.length < 4) {
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
        if (i !== 3 && card.image) formData.append(`handis_${index}_image`, card.image);
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

  const updateCardField = (i: number, field: string, value: string) => {
    const updated = [...cards];
    updated[i][field] = value;
    setCards(updated);
  };

  const updateCardImage = (i: number, file: File | null) => {
    const updated = [...cards];
    updated[i].image = file;
    setCards(updated);
  };

  return (
  <form onSubmit={handleSubmit}>
  {/* 🟩 Reorder cards so 4th one appears first */}
  {[cards[3], ...cards.slice(0, 3)].map((card, i) => (
    <div key={i} className="card-section" style={{ marginBottom: "30px" }}>
     
      {/* <label>Title</label>
      <ReactQuill
        theme="snow"
        value={card.handistitle}
        onChange={(v) => {
          // If editing the first card (actually 4th in array)
          const realIndex = i === 0 ? 3 : i - 1;
          updateCardField(realIndex, "handistitle", v);
        }}
        modules={quillModules}
      /> */}

      <HtmlToggleEditor
          label="Title"
          value={card.handistitle}
            onChange={(v) => {
            const realIndex = i === 0 ? 3 : i - 1;
            updateCardField(realIndex, "handistitle", v);
          }}
      />


      {/* 🟩 Show image field for original cards 1–3 only */}
      {i !== 0 && (
        <>
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              updateCardImage(i - 1, e.target.files?.[0] ?? null)
            }
          />

          {card.imageUrl && (
            <img
              src={`${API_URL.replace("api/", "")}${card.imageUrl}`}
              alt={`Handis Card ${i}`}
              style={{
                width: "150px",
                marginTop: "10px",
                borderRadius: "8px",
                display: "block",
              }}
            />
          )}
        </>
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
