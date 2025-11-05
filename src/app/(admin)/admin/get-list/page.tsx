"use client";

import { useState, useMemo,useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Quill from "quill";
import "../home/admin-home.css";
import { API_URL } from "@/config";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function SimpleEditorPage() {
  const [titles, setTitles] = useState({ en: "", ar: "" });
  const [content, setContent] = useState({ en: "", ar: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

    useEffect(() => {
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

  return (
    <div className="container">
      <h1>New Page Editor</h1>
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
    </div>
  );
}
