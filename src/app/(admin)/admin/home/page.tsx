"use client";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "@/config";
import "react-quill-new/dist/quill.snow.css";
import Quill from "quill";
import "./admin-home.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
Quill.import("ui/icons")["source"] = "&lt;/&gt;";

const initialHeadings = { english: ["", "", ""], arabic: ["", "", ""] };
const initialImages = ["", "", ""];

export default function HomeAdminPage() {
  const [titles, setTitles] = useState({ en: "", ar: "" });
  const [descs, setDescs] = useState({ en: "", ar: "" });
  const [headings, setHeadings] = useState(initialHeadings);
  const [images, setImages] = useState(initialImages);
  const [ids, setIds] = useState({ en: null, ar: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"], ["clean"], ["source"]
      ],
      handlers: {
        source: function () {
          const quill = this.quill;
          const editor = quill.root;
          const parent = editor.parentElement;
          const isSourceMode = parent.querySelector("textarea.source-view");
          if (isSourceMode) {
            // Exit source mode
            const html = isSourceMode.value;
            quill.root.innerHTML = html;
            isSourceMode.remove();
            quill.root.style.display = "";
            quill.enable(true);
            quill.updateContents(quill.clipboard.convert(html), "user");
          } else {
            // Enter source mode
            const textarea = document.createElement("textarea");
            textarea.className = "source-view";
            textarea.style.height = `${quill.root.scrollHeight}px`;
            textarea.value = quill.root.innerHTML;
            textarea.addEventListener("input", () => {
              quill.root.innerHTML = textarea.value;
            });
            quill.root.style.display = "none";
            quill.enable(false);
            parent.appendChild(textarea);
          }
        },
        image: function () {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.click();
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            try {
              const res = await axios.post(`${API_URL}upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              const imageUrl = res.data.url;
              const editor = this.quill;
              const range = editor.getSelection();
              editor.insertEmbed(range.index, "image", imageUrl);
            } catch {
              alert("Image upload failed");
            }
          };
        }
      }
    }
  }), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const banners = (await axios.get(`${API_URL}banner`)).data?.data?.banners || [];
        const getLang = (lang) => (lang || "").trim().toLowerCase();
        const en = banners.find(b => getLang(b.language) === "en") || {};
        const ar = banners.find(b => getLang(b.language) === "ar") || {};
        // Set titles/descriptions
        setTitles({ en: en.engtitle || "", ar: ar.arabtitle || "" });
        setDescs({ en: en.engdescription || "", ar: ar.arabdescription || "" });
        // Set headings
        setHeadings({
          english: [en.englishheading1 || "", en.englishheading2 || "", en.englishheading3 || ""],
          arabic: [ar.arabicheading1 || "", ar.arabicheading2 || "", ar.arabicheading3 || ""],
        });
        // Set images
        setImages([en.image1 || "", en.image2 || "", en.image3 || ""]);
        setIds({ en: en.id || null, ar: ar.id || null });
      } catch {
        setMessage("❌ Unable to load banner data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        engtitle: titles.en,
        engdescription: descs.en,
        arabtitle: titles.ar,
        arabdescription: descs.ar,
        englishheading1: headings.english[0],
        englishheading2: headings.english[1],
        englishheading3: headings.english[2],
        arabicheading1: headings.arabic[0],
        arabicheading2: headings.arabic[1],
        arabicheading3: headings.arabic[2],
        image1: images[0], image2: images[1], image3: images[2],
      };
      const endpoint = ids.en || ids.ar ? `${API_URL}banner/update-single` : `${API_URL}banner`;
      const method = ids.en || ids.ar ? "put" : "post";
      const res = await axios[method](endpoint, payload);
      setMessage(res.status === 200 || res.status === 201 
        ? "✅ Banner saved" 
        : "❌ Failed to save");
    } catch {
      setMessage("❌ Error");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (cb, idx) => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await axios.post(`${API_URL}upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (cb) cb(res.data);
        if (typeof idx === "number") {
          setImages(current => current.map((img, i) => i === idx ? res.data.url : img));
          setMessage(`✅ Image ${idx + 1} uploaded`);
        }
      } catch {
        setMessage(`❌ Upload image ${idx + 1} failed`);
      }
    };
  };

  // Render input fields for headings
  const renderHeadingsInputs = (label, array, index) =>
    [0, 1, 2].map(i => (
      <input key={`${label}-${i}`} type="text"
        placeholder={`${label} ${i + 1}`}
        value={array[i]}
        className={label.startsWith("Arabic") ? "text-right" : ""}
        onChange={e => {
          const newArr = [...array];
          newArr[i] = e.target.value;
          setHeadings(prev => ({ ...prev, [index]: newArr }));
        }}
      />
    ));

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      <div className="container">
        <h1>Home Page</h1>
        <form onSubmit={handleSave}>
          {/* Title & Description: English */}
          <div className="section">
            <label>Title (English)</label>
            <input type="text" value={titles.en} required onChange={e => setTitles({ ...titles, en: e.target.value })} />
            <div className="form-field">
              <label>Description (English)</label>
              <ReactQuill theme="snow" value={descs.en} onChange={v => setDescs(prev => ({ ...prev, en: v }))} modules={modules} />
            </div>
          </div>
          {/* Title & Description: Arabic */}
          <div className="section">
            <label>Title (Arabic)</label>
            <input type="text" className="text-right" value={titles.ar} onChange={e => setTitles({ ...titles, ar: e.target.value })} />
            <div className="form-field">
              <label>Description (Arabic)</label>
              <ReactQuill theme="snow" value={descs.ar} onChange={v => setDescs(prev => ({ ...prev, ar: v }))} modules={modules} />
            </div>
          </div>

          {/* Headings */}
          <div className="form-field">
            <label>English Headings</label>
            {renderHeadingsInputs("English Heading", headings.english, "english")}
            <label>Arabic Headings</label>
            {renderHeadingsInputs("Arabic Heading", headings.arabic, "arabic")}
            {/* Images */}
            {[0, 1, 2].map(i => (
              <div key={i}>
                <label>Upload Image {i + 1}</label>
                <button type="button" onClick={() => uploadFile(null, i)}>Upload</button>
                {images[i] && <img src={images[i]} alt={`Preview Image ${i + 1}`} style={{ width: "180px", borderRadius: "8px", marginTop: "8px", border: "1px solid #ccc" }} />}
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (ids.en || ids.ar ? "Updating..." : "Creating...") : (ids.en || ids.ar ? "Update Banner" : "Create Banner")}
          </button>
          {message && <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
        </form>
      </div>
    </>
  );
}
