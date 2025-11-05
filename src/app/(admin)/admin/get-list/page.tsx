"use client";

import { useState, useMemo,useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Quill from "quill";
import "../home/admin-home.css";
import { API_URL } from "@/config";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type LanguageContent = { en: string; ar: string };

type Card = {
  title: LanguageContent;
  content: LanguageContent;
  image: File | null;
};
export default function SimpleEditorPage() {
  const [titles, setTitles] = useState({ en: "", ar: "" });
  const [content, setContent] = useState({ en: "", ar: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
   const [activeTab, setActiveTab] = useState(1);

    const [cards, setCards] = useState<Card[]>([
        { title: { en: "", ar: "" }, content: { en: "", ar: "" }, image: null },
        { title: { en: "", ar: "" }, content: { en: "", ar: "" }, image: null },
        { title: { en: "", ar: "" }, content: { en: "", ar: "" }, image: null },
    ]);

  const modules = useMemo(
    () => ({
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
    }),
    []
  );

    const fetchPage = async () => {
        try {
            const res = await fetch(`${API_URL}page/get?sectionKey=get_listed`);
            if (res.ok) {
            const data = await res.json();

            if (data.success) {

                setTitles({ en: data?.data?.title_en || "", ar: data?.data?.title_ar || "" });
                setContent({ en: data?.data?.content_en || "", ar: data?.data?.content_ar || "" });
            }
            }
        } catch (err) {
            console.error("Failed to fetch page data", err);
        }
    };

    useEffect(() => {

        fetchPage();

    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
        const res = await fetch(`${API_URL}page/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            sectionKey: "get_listed",
            titles,
            content,
            }),
        });

        const data = await res.json();

        if (res.ok) {

            fetchPage();

            setMessage("✅ Saved successfully!");

            setTitles({ en: "", ar: "" });
            setContent({ en: "", ar: "" });
        } else {
            setMessage(`❌ ${data.error || "Failed to save"}`);
        }
        } catch (err) {
        console.error(err);
        setMessage("❌ Failed to save");
        }

        setLoading(false);
    };

    const fetchCards = async () => {
        try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_banner_cards`);
        if (res.ok) {
            const data = await res.json();
            if (data.success && data.data?.cards) {
            const fetchedCards = data.data.cards.map((card: any) => ({
                title: { en: card.title_en || "", ar: card.title_ar || "" },
                content: { en: card.content_en || "", ar: card.content_ar || "" },
                image: null, // Images will be handled separately
            }));
            setCards(fetchedCards);
            }
        }
        } catch (err) {
        console.error("Failed to fetch cards data", err);
        }
    };

    useEffect(() => {
        if (activeTab === 1) fetchPage();
        if (activeTab === 2) fetchCards();
    }, [activeTab]);



      const handleSubmitCards = async (e: React.FormEvent) => {

            e.preventDefault();
            setLoading(true);
            setMessage("");

            try {
            const formData = new FormData();
            formData.append("sectionKey", "get_banner_cards");

            cards.forEach((card, index) => {
                formData.append(`card_${index + 1}_title_en`, card.title.en);
                formData.append(`card_${index + 1}_title_ar`, card.title.ar);
                formData.append(`card_${index + 1}_content_en`, card.content.en);
                formData.append(`card_${index + 1}_content_ar`, card.content.ar);
                if (card.image) formData.append(`card_${index + 1}_image`, card.image);
            });

            const res = await fetch(`${API_URL}page/save`, { method: "POST", body: formData });
            const data = await res.json();

            if (res.ok) {
                fetchCards();
                setMessage("✅ Cards saved successfully!");
            } else setMessage(`❌ ${data.error || "Failed to save"}`);
            } catch (err) {
            console.error(err);
            setMessage("❌ Failed to save cards");
            }

            setLoading(false);
        };

  return (
    <div className="container">

      <h1>Get Listed Page</h1>


       <div className="tabs">

            <button
                type="button"
                className={activeTab === 1 ? "tab active" : "tab"}
                onClick={() => setActiveTab(1)}
                >
                Get Listed Banner
            </button>

            <button
            type="button"
            className={activeTab === 2 ? "tab active" : "tab"}
            onClick={() => setActiveTab(2)}
            >
            Get Listed Cards
            </button>

      </div>

        {activeTab === 1 && (

                <form onSubmit={handleSubmit}>


                    <div className="form-field">
                    <label> Title (English)</label>
                    <input
                        type="text"
                        value={titles.en}
                        onChange={(e) => setTitles({ ...titles, en: e.target.value })}
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                    </div>

                    <div className="form-field">
                    <label> Title (Arabic)</label>
                    <input
                        type="text"
                        value={titles.ar}
                        name="title"
                        onChange={(e) => setTitles({ ...titles, ar: e.target.value })}
                        placeholder="Enter title"
                        required
                    />
                    </div>

                    <div className="form-field">
                    <label> Content (English)</label>
                    <ReactQuill
                        theme="snow"
                        value={content.en}
                        onChange={(v) => setContent((prev) => ({ ...prev, en: v }))}
                        modules={modules}
                        placeholder=""
                    />
                    </div>

                    <div className="form-field">
                    <label> Content (Arabic)</label>
                    <ReactQuill
                        theme="snow"
                        value={content.ar}
                        onChange={(v) => setContent((prev) => ({ ...prev, ar: v }))}
                        modules={modules}
                        placeholder=""
                    />
                    </div>

                        <button type="submit" className="btn get-sub" disabled={loading}>

                        {loading ? "Saving..." : "Save Page"}
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

        )}

        {activeTab === 2 && (

            <form onSubmit={handleSubmitCards}>

                {cards.map((card, index) => (
                    <div key={index} className="card-section">
                    <h3>Card {index + 1}</h3>

                    <div className="form-field">
                        <label>Title (English)</label>
                        <input
                        type="text"
                        value={card.title.en}
                        onChange={(e) => {
                            const updated = [...cards];
                            updated[index].title.en = e.target.value;
                            setCards(updated);
                        }}
                        required
                        />
                    </div>

                    <div className="form-field">
                        <label>Title (Arabic)</label>
                        <input
                        type="text"
                        value={card.title.ar}
                        onChange={(e) => {
                            const updated = [...cards];
                            updated[index].title.ar = e.target.value;
                            setCards(updated);
                        }}
                        required
                        />
                    </div>

                    <div className="form-field">
                        <label>Content (English)</label>
                        <textarea
                        value={card.content.en}
                        onChange={(e) => {
                            const updated = [...cards];
                            updated[index].content.en = e.target.value;
                            setCards(updated);
                        }}
                        required
                        />
                    </div>

                    <div className="form-field">
                        <label>Content (Arabic)</label>
                        <textarea
                        value={card.content.ar}
                        onChange={(e) => {
                            const updated = [...cards];
                            updated[index].content.ar = e.target.value;
                            setCards(updated);
                        }}
                        required
                        />
                    </div>

                    <div className="form-field">
                        <label>Image</label>
                        <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const updated = [...cards];
                            updated[index].image = e.target.files?.[0] || null;
                            setCards(updated);
                        }}
                        />
                    </div>

                    <hr />
                    </div>
                ))}

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Cards"}
                </button>
                {message && <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
                </form>

        )}   
      
    </div>
  );
}
