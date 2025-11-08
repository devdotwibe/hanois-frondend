"use client";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL ,IMG_URL} from "@/config";
import "react-quill-new/dist/quill.snow.css";
import Quill from "quill";
import "./admin-home.css";
import BannerExtrasForm from "@/app/(frontend)/components/BannerExtrasForm";
import FaqForm from "@/app/(frontend)/components/FaqForm";
import BannerSubExtrasForm from "@/app/(frontend)/components/BannerSubExtrasForm";



const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
Quill.import("ui/icons")["source"] = "&lt;/&gt;";

const initialHeadings = { english: ["", "", ""], arabic: ["", "", ""] };
const initialImages = ["", "", ""];


export default function HomeAdminPage() {
  const [activeTab, setActiveTab] = useState(1);

  // 🧠 State management
  const [titles, setTitles] = useState({ en: "", ar: "" });
  const [descs, setDescs] = useState({ en: "", ar: "" });
  const [headings, setHeadings] = useState(initialHeadings);
  const [images, setImages] = useState(initialImages);
  const [ids, setIds] = useState({ en: null, ar: null });
  const [selectedFiles, setSelectedFiles] = useState([null, null, null]);


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSource, setShowSource] = useState(false);
const modules = useMemo(
  () => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
        ["showHtml"], // 🟩 custom toggle button
      ],
      handlers: {
        showHtml: function () {
          setShowSource((prev) => !prev);
        },
      },
    },
  }),
  []
);

// 🟩 Tab 5 (Cards Section) State
const initLanguageContent = { en: "", ar: "" };
const [cards, setCards] = useState([
  { title: { ...initLanguageContent }, content: { ...initLanguageContent }, image: null, imageUrl: "" },
  { title: { ...initLanguageContent }, content: { ...initLanguageContent }, image: null, imageUrl: "" },
  { title: { ...initLanguageContent }, content: { ...initLanguageContent }, image: null, imageUrl: "" },
]);





  // 🟩 Fetch banners on mount
useEffect(() => {
  (async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}banner`);
      const banners = response.data?.data?.banners || [];

      const getLang = (lang: string) => (lang || "").trim().toLowerCase();

      // 🟩 Extract English & Arabic versions (if available)
      const en = banners.find((b) => getLang(b.language) === "en") || {};
      const ar = banners.find((b) => getLang(b.language) === "ar") || {};

      const fixImageURL = (img?: string): string => {
        if (!img) return "";
        // ✅ If image is already a full URL, use it as is.
        // ✅ Otherwise, prepend base API URL.
        return img.startsWith("http") ? img : `${IMG_URL}${img}`;
      };

      // 🟩 Set states safely
      setTitles({
        en: en.title || "",
        ar: ar.title || "",
      });

      setDescs({
        en: en.description || "",
        ar: ar.description || "",
      });

      setHeadings({
        english: [en.heading1 || "", en.heading2 || "", en.heading3 || ""],
        arabic: [ar.heading1 || "", ar.heading2 || "", ar.heading3 || ""],
      });

      // 🟩 Convert all image paths into valid URLs
      setImages([
        fixImageURL(en.image1),
        fixImageURL(en.image2),
        fixImageURL(en.image3),
      ]);

      setIds({
        en: en.id || null,
        ar: ar.id || null,
      });
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      setMessage("❌ Unable to load banner data");
    } finally {
      setLoading(false);
    }
  })();
}, []);



  // 🟩 File upload (local preview only)
const uploadFile = (idx) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.click();

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);

    setImages(prev => prev.map((img, i) => (i === idx ? localPreview : img)));

    setSelectedFiles(prev => {
      const updated = [...prev];
      updated[idx] = file;
      return updated;
    });
  };
};

const handleSave = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const formData = new FormData();

    // Append text fields
    formData.append("engtitle", titles.en);
    formData.append("engdescription", descs.en);
    formData.append("arabtitle", titles.ar);
    formData.append("arabdescription", descs.ar);

    formData.append("englishheading1", headings.english[0]);
    formData.append("englishheading2", headings.english[1]);
    formData.append("englishheading3", headings.english[2]);
    formData.append("arabicheading1", headings.arabic[0]);
    formData.append("arabicheading2", headings.arabic[1]);
    formData.append("arabicheading3", headings.arabic[2]);

    // Append files (if selected), fallback to empty string for fields not changed
    selectedFiles.forEach((file, idx) => {
      if (file) {
        formData.append(`image${idx + 1}`, file);
      } else {
        // If no new file selected, send current image URL so backend can fallback
        formData.append(`image${idx + 1}`, images[idx] || "");
      }
    });

    // Determine endpoint/method
    const endpoint = ids.en || ids.ar ? `${API_URL}banner/update-single` : `${API_URL}banner`;
    const method = ids.en || ids.ar ? "put" : "post";

    const res = await axios({
      method,
      url: endpoint,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setMessage(
      res.status === 200 || res.status === 201
        ? "✅ Banner saved successfully!"
        : "❌ Failed to save banner."
    );
  } catch (err) {
    console.error("❌ Save failed:", err);
    setMessage("❌ Something went wrong while saving.");
  } finally {
    setLoading(false);
  }
};


const handleCardsSave = async () => {
  setLoading(true);
  setMessage("");

  try {
    const formData = new FormData();
    formData.append("sectionKey", "get_banner_cards"); // You can rename if needed

    cards.forEach((card, idx) => {
      formData.append(`card_${idx + 1}_title_en`, card.title.en);
      formData.append(`card_${idx + 1}_title_ar`, card.title.ar);
      formData.append(`card_${idx + 1}_content_en`, card.content.en);
      formData.append(`card_${idx + 1}_content_ar`, card.content.ar);
      if (card.image) formData.append(`card_${idx + 1}_image`, card.image);
    });

    const res = await axios.post(`${API_URL}page/save`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setMessage(res.data.success ? "✅ Cards saved successfully!" : "❌ Failed to save cards");
  } catch (err) {
    console.error("❌ Card Save Failed:", err);
    setMessage("❌ Something went wrong while saving cards.");
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  if (activeTab === 5) {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}page/get?sectionKey=get_banner_cards`);
        if (res.data.success && Array.isArray(res.data.data?.cards)) {
          const cardsData = res.data.data.cards.map((card: any) => ({
            title: { en: card.title_en || "", ar: card.title_ar || "" },
            content: { en: card.content_en || "", ar: card.content_ar || "" },
            image: null,
            imageUrl: card.image ? (card.image.startsWith("http") ? card.image : `${IMG_URL}${card.image}`) : "",
          }));
          setCards(cardsData);
        } else {
          console.warn("⚠️ No cards data found in response");
        }
      } catch (err) {
        console.error("❌ Failed to load cards:", err);
        setMessage("❌ Unable to load existing cards data.");
      } finally {
        setLoading(false);
      }
    })();
  }
}, [activeTab]);


  const renderHeadingsInputs = (label, array, index) =>
    [0, 1, 2].map((i) => (
      <input
        key={`${label}-${i}`}
        type="text"
        placeholder={`${label} ${i + 1}`}
        value={array[i]}
        className={label.startsWith("Arabic") ? "text-right" : ""}
        onChange={(e) => {
          const newArr = [...array];
          newArr[i] = e.target.value;
          setHeadings((prev) => ({ ...prev, [index]: newArr }));
        }}
      />
    ));

  return (
    <div className="container">
      <h1>Home Page</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
       
          className={activeTab === 1 ? "tab active" : "tab"}
          onClick={() => setActiveTab(1)}
        >
          Tab 1
        </button>
        <button
        
          className={activeTab === 2 ? "tab active" : "tab"}
          onClick={() => setActiveTab(2)}
        >
          Tab 2
        </button>

      <button className={activeTab === 3 ? "tab active" : "tab"} onClick={() => setActiveTab(3)}>Tab 3</button>


      

 <button className={activeTab === 4 ? "tab active" : "tab"} onClick={() => setActiveTab(4)}>Tab 4</button>
          
   <button className={activeTab === 5 ? "tab active" : "tab"} onClick={() => setActiveTab(5)}>Tab 5</button>
      </div>

      {/* 🟩 Tab 1: Banner Form */}
      {activeTab === 1 && (
        <form onSubmit={handleSave}>
          {/* 🟩 English Title */}
<div className="section">
  <label>Header Content</label>
  <textarea
    value={titles.en}
    onChange={(e) => setTitles({ ...titles, en: e.target.value })}
    style={{
      width: "100%",
      height: "150px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      fontSize: "15px",
      lineHeight: "1.5",
      fontFamily: "Arial, sans-serif",
      resize: "vertical",
    }}
  />
</div>

{/* 🟨 Arabic Title (hidden for now) */}
<div className="section" style={{ display: "none" }}>
  <label>Title (Arabic)</label>
  <textarea
    value={titles.ar}
    onChange={(e) => setTitles({ ...titles, ar: e.target.value })}
    style={{
      width: "100%",
      height: "150px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      fontSize: "15px",
      lineHeight: "1.5",
      fontFamily: "Arial, sans-serif",
      resize: "vertical",
      direction: "rtl", // text alignment for Arabic
    }}
  />
</div>


        <div className="form-field">
  <label>Headings & images</label>

  {[0, 1, 2].map((i) => (
    <div key={i} className="heading-image-pair">
      {/* 🟩 Heading Input */}
      <input
        type="text"
        placeholder={`English Heading ${i + 1}`}
        value={headings.english[i]}
        onChange={(e) => {
          const newArr = [...headings.english];
          newArr[i] = e.target.value;
          setHeadings((prev) => ({ ...prev, english: newArr }));
        }}
      />

      {/* 🟩 Image Upload */}
      <div className="img-div">
       
        <button
          type="button"
          disabled={loading}
          onClick={() => uploadFile(i)}
        >
          Upload
        </button>
        {images[i] && (
          <img
            src={images[i]}
            alt={`Preview Image ${i + 1}`}
            style={{
              width: "180px",
              borderRadius: "8px",
              marginTop: "8px",
              border: "1px solid #ccc",
            }}
          />
        )}
      </div>
    </div>
  ))}
</div>


          <button type="submit" disabled={loading}>
            {loading
              ? ids.en || ids.ar
                ? "Saving..."
                : "Saving..."
              : ids.en || ids.ar
              ? "Save"
              : "Save"}
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

      {/* 🟩 Tab 2: Banner Extras Form */}
      {activeTab === 2 && (
        <div className="tab-content">
          <BannerExtrasForm />
        </div>
      )}



      {activeTab === 3 && (
        <div className="tab-content">
          <BannerSubExtrasForm />
        </div>
      )}





 {/* 🟩 Tab 5: Cards Section */}
{activeTab === 4 && (
  <div className="tab-content">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCardsSave();
      }}
    >
      {cards.map((card, idx) => (
        <div key={idx} className="card-section">
        

          {/* Title Fields */}
          <div className="form-field">
            <label>Title</label>
            <input
              type="text"
              value={card.title.en}
              onChange={(e) => {
                const updated = [...cards];
                updated[idx].title.en = e.target.value;
                setCards(updated);
              }}
            />
          </div>

          <div className="form-field" style={{ display: "none" }}>
            <label>Title (Arabic)</label>
            <input
              type="text"
              value={card.title.ar}
              onChange={(e) => {
                const updated = [...cards];
                updated[idx].title.ar = e.target.value;
                setCards(updated);
              }}
            />
          </div>

          {/* Content Fields */}
          <div className="form-field">
            <label>Content</label>
            <textarea
              value={card.content.en}
              onChange={(e) => {
                const updated = [...cards];
                updated[idx].content.en = e.target.value;
                setCards(updated);
              }}
            />
          </div>

          <div className="form-field" style={{ display: "none" }}>
            <label>Content (Arabic)</label>
            <textarea
              value={card.content.ar}
              onChange={(e) => {
                const updated = [...cards];
                updated[idx].content.ar = e.target.value;
                setCards(updated);
              }}
            />
          </div>

          {/* Image Upload */}
          <div className="form-field">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                const updated = [...cards];
                updated[idx].image = file;
                if (file) updated[idx].imageUrl = URL.createObjectURL(file);
                setCards(updated);
              }}
            />
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={`Card ${idx + 1}`}
                style={{
                  width: "160px",
                  height: "auto",
                  marginTop: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          </div>

          <hr />
        </div>
      ))}

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {message && (
        <p
          className={`message ${
            message.includes("✅") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  </div>
)}


{activeTab === 5 && (
  <div className="tab-content">
    <FaqForm />
  </div>
)}





    </div>
  );
}
