"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { API_URL } from "@/config";

import "../home/admin-home.css";
import CardsTabContent from "@/app/(frontend)/components/CardsTabContent";

import HandisTabContent from "@/app/(frontend)/components/HandisTabContent";

import MeaningfullTabContent from "@/app/(frontend)/components/MeaningfullTabContent";

import HelpTabContent from "@/app/(frontend)/components/HelpTabContent";



const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type LanguageContent = { en: string; ar: string };
type Card = {
  title: LanguageContent;
  content: LanguageContent;
  image: File | null;
  imageUrl?: string; // ✅ new
};


const initLanguageContent = { en: "", ar: "" };
const initCard: Card = { title: initLanguageContent, content: initLanguageContent, image: null };

function InputField({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  required = true,
  accept,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  accept?: string;
}) {
  return (
    <div className="form-field">
      <label>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} accept={accept} />
      )}
    </div>
  );
}

export default function SimpleEditorPage() {
  const [titles, setTitles] = useState<LanguageContent>(initLanguageContent);
  const [content, setContent] = useState<LanguageContent>(initLanguageContent);
 const [cards, setCards] = useState<Card[]>(
  Array(3)
    .fill(null)
    .map(() => ({
      title: { en: "", ar: "" },
      content: { en: "", ar: "" },
      image: null,
    }))
);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
        ["source"],
      ],
    },
  }), []);

const fetchData = async (sectionKey: string) => {
  try {
    const res = await fetch(`${API_URL}page/get?sectionKey=${sectionKey}`);
    if (!res.ok) throw new Error("Network error");

    const data = await res.json();
    if (!data.success) throw new Error("API error");

    // 🟩 Case 1: Get Listed main content
    if (sectionKey === "get_listed") {
      setTitles({
        en: data.data?.title_en || "",
        ar: data.data?.title_ar || "",
      });
      setContent({
        en: data.data?.content_en || "",
        ar: data.data?.content_ar || "",
      });
    }

    // 🟩 Case 2: Banner cards (with images)
    else if (sectionKey === "get_banner_cards" && Array.isArray(data.data?.cards)) {
      setCards(
        data.data.cards.map((card: any) => ({
          title: { en: card.title_en || "", ar: card.title_ar || "" },
          content: { en: card.content_en || "", ar: card.content_ar || "" },
          image: null, // for newly uploaded images (File)
          imageUrl: card.image || "", // ✅ display previously saved backend image
        }))
      );
    }
  } catch (err) {
    console.error(`❌ Failed to fetch ${sectionKey} data`, err);
  }
};

  useEffect(() => {
    fetchData(activeTab === 1 ? "get_listed" : "get_banner_cards");
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent, isCards = false) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = `${API_URL}page/save`;
      let res, data;

      if (isCards) {
        const formData = new FormData();
        formData.append("sectionKey", "get_banner_cards");
        cards.forEach((card, idx) => {
          formData.append(`card_${idx + 1}_title_en`, card.title.en);
          formData.append(`card_${idx + 1}_title_ar`, card.title.ar);
          formData.append(`card_${idx + 1}_content_en`, card.content.en);
          formData.append(`card_${idx + 1}_content_ar`, card.content.ar);
          if (card.image) formData.append(`card_${idx + 1}_image`, card.image);
        });
        res = await fetch(url, { method: "POST", body: formData });
        data = await res.json();
      } else {
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionKey: "get_listed", titles, content }),
        });
        data = await res.json();
      }

      if (res.ok) {
        fetchData(isCards ? "get_banner_cards" : "get_listed");
        setMessage(isCards ? "✅ Cards saved successfully!" : "✅ Saved successfully!");
        if (!isCards) {
          setTitles(initLanguageContent);
          setContent(initLanguageContent);
        }
      } else {
        setMessage(`❌ ${data.error || "Failed to save"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage(isCards ? "❌ Failed to save cards" : "❌ Failed to save");
    }
    setLoading(false);
  };

  // Helper to update nested state keys for title/content in cards
  const updateCardField = (index: number, field: "title" | "content", lang: "en" | "ar", value: string) => {
    const updated = [...cards];
    updated[index][field][lang] = value;
    setCards(updated);
  };

  const updateCardImage = (index: number, file: File | null) => {
    const updated = [...cards];
    updated[index].image = file;
    setCards(updated);
  };

  return (
    <div className="container">
      <h1>Get Listed Page</h1>

      <div className="tabs">
        {[{ id: 1, label: "Get Listed Banner" }, { id: 2, label: "Get Listed Cards" },    { id: 3, label: "Get Listed Handis Cards" }, { id: 4, label: "Get Listed Meaningfull Card" },  { id: 5, label: "Get Listed Help Card" }, ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? "tab active" : "tab"}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 1 && (
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <InputField label="Title (English)" value={titles.en} onChange={(v) => setTitles({ ...titles, en: v })} />
          <InputField label="Title (Arabic)" value={titles.ar} onChange={(v) => setTitles({ ...titles, ar: v })} />
          <div className="form-field">
            <label>Content (English)</label>
            <ReactQuill
              theme="snow"
              value={content.en}
              onChange={(v) => setContent((prev) => ({ ...prev, en: v }))}
              modules={modules}
            />
          </div>
          <div className="form-field">
            <label>Content (Arabic)</label>
            <ReactQuill
              theme="snow"
              value={content.ar}
              onChange={(v) => setContent((prev) => ({ ...prev, ar: v }))}
              modules={modules}
            />
          </div>
          <button type="submit" className="btn get-sub" disabled={loading}>
            {loading ? "Saving..." : "Save Page"}
          </button>
          {message && (
            <p
              className={`message ${
                message.includes("✅") ? "success" : message.includes("⚠️") ? "warning" : "error"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      )}

{activeTab === 2 && (
  <CardsTabContent
    cards={cards}
    setCards={setCards}
    handleSubmit={(e) => handleSubmit(e, true)}
    loading={loading}
    message={message}
  />
)}

{activeTab === 3 && <HandisTabContent />}


{activeTab === 4 && <MeaningfullTabContent />}

{activeTab === 5 && <HelpTabContent />}



    </div>
  );
}
