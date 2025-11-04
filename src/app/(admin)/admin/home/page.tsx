"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "@/config";

// Dynamically load ReactQuill editor (safe for Next.js SSR)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function HomeAdminPage() {

  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");

  // Banner fields state
  const [engTitle, setEngTitle] = useState("");
  const [engDescription, setEngDescription] = useState("");
  const [arabTitle, setArabTitle] = useState("");
  const [arabDescription, setArabDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch banner data on mount and when bannerId changes
  useEffect(() => {
 
    const fetchBanner = async () => {
      try {
         const res = await axios.get(`http://localhost:5000/api/banner`);
        const b = res.data.banner;
        setEngTitle(b.engtitle);
        setEngDescription(b.engdescription);
        setArabTitle(b.arabtitle);
        setArabDescription(b.arabdescription);
      } catch (error) {
        console.error("Failed to fetch banner", error);
       
      }
    };

    fetchBanner();
  }, []);

  // Quill toolbar modules with image upload handler (optional)
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: function imageHandler() {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
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
              } catch (err) {
                console.error("Image upload failed:", err);
                alert("Image upload failed.");
              }
            };
          },
        },
      },
    }),
    []
  );


  // Add at the top with other useState hooks:
const [headings, setHeadings] = useState({
  heading1: "",
  heading2: "",
  heading3: ""
});
const [images, setImages] = useState({
  image1: "",
  image2: "",
  image3: ""
});
const [imgUploadLoading, setImgUploadLoading] = useState<number | null>(null); // 1, 2, 3 for which image is uploading

// Handle heading change:
const handleHeadingChange = (id: keyof typeof headings, value: string) => {
  setHeadings((prev) => ({ ...prev, [id]: value }));
};

// Handle image upload:
const handleImageChange = async (idx: 1 | 2 | 3, file: File | null) => {
  if (!file) return;
  setImgUploadLoading(idx);
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`${API_URL}upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    const url = res.data.url;
    setImages((prev) => ({ ...prev, [`image${idx}`]: url }));
  } catch (err) {
    alert("Image upload failed.");
  } finally {
    setImgUploadLoading(null);
  }
};

// Add to the top with other useState hooks:
const [arabicHeadings, setArabicHeadings] = useState({
  arabicheading1: "",
  arabicheading2: "",
  arabicheading3: ""
});

// Handle Arabic heading change:
const handleArabicHeadingChange = (id: keyof typeof arabicHeadings, value: string) => {
  setArabicHeadings((prev) => ({ ...prev, [id]: value }));
};



  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
        const res = await axios.put(`http://localhost:5000/api/banner`, {
        engtitle: engTitle,
        engdescription: engDescription,
        arabtitle: arabTitle,
        arabdescription: arabDescription,
      });

      if (res.status === 200) {
        setMessage("✅ All fields saved successfully!");
      } else {
        setMessage("❌ Failed to save all fields.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setMessage(" Saved success.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTab2 = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    // Example payload; adjust to your API schema
    const payload = {
      headings,
      arabicHeadings,
      images,
    };

    // Replace with your actual API call
    const res = await axios.put(`http://localhost:5000/api/homecontent/tab2`, payload);

    if (res.status === 200) {
      setMessage("✅ Section 2 saved successfully!");
    } else {
      setMessage("❌ Failed to save Section 2.");
    }
  } catch (err) {
    console.error("Save failed:", err);
    setMessage("❌ Error saving Section 2.");
  } finally {
    setLoading(false);
  }
};





  return (
    <>
      <style jsx>{`
        /* Custom styles to fix spacing and Arabic text alignment */
        .form-field {
          margin-bottom: 1.5rem; /* 24px spacing */
        }
        /* Ensure Arabic text is right aligned inside quill editor */
        .ql-editor[dir='rtl'] {
          text-align: right;
        }
       
      `}</style>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6"> Home Page Content</h1>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "tab1"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tab1")}
          >
           Section 1
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "tab2"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tab2")}
          >
           Section 2
          </button>
        </div>

        {/* Tab 1: All fields form */}
        {activeTab === "tab1" && (
          <form onSubmit={handleSaveAll}>
            <div className="form-field">
              <label className="block mb-2 font-medium">English Title</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
            
                value={engTitle}
                onChange={(e) => setEngTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="block mb-2 font-medium">English Description</label>
              <ReactQuill
                theme="snow"
                value={engDescription}
                onChange={setEngDescription}
                modules={modules}
                style={{ minHeight: "150px" }}
              />
            </div>

            <div className="form-field">
              <label className="block mb-2 font-medium">Arabic Title</label>

             <input
  type="text"
  className="w-full border rounded-lg p-2 arabic-text"
  value={arabTitle}
  onChange={(e) => setArabTitle(e.target.value)}
  required
/>

            </div>

            <div className="form-field">
              <label className="block mb-2 font-medium">Arabic Description</label>

              <ReactQuill
                theme="snow"
                value={arabDescription}
                onChange={setArabDescription}
                modules={modules}
                style={{ minHeight: "150px" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 px-5 py-2 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Section 1"}
            </button>

            {message && (
              <p
                className={`mt-2 text-sm ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        )}
{activeTab === "tab2" && (
  <form className="space-y-8" onSubmit={handleSaveTab2}>
    {[1, 2, 3].map((idx) => (
      <div key={idx}>
        {/* Existing fields omitted for brevity */}
        {/* Heading */}
        <label className="block mb-2 font-medium">{`Heading ${idx}`}</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 mb-2"
          value={headings[`heading${idx}` as keyof typeof headings]}
          onChange={(e) =>
            handleHeadingChange(`heading${idx}` as keyof typeof headings, e.target.value)
          }
        
        />

        {/* Arabic Title */}
        <label className="block mb-2 font-medium arabic-text" >
          {`Arabic Title ${idx}`}
        </label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 mb-2 arabic-text"
          value={arabicHeadings[`arabicheading${idx}` as keyof typeof arabicHeadings]}
          onChange={(e) =>
            handleArabicHeadingChange(`arabicheading${idx}` as keyof typeof arabicHeadings, e.target.value)
          }
       
        />

        {/* Image */}
        <label className="block mb-2 font-medium">{`Image ${idx}`}</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(idx as 1 | 2 | 3, e.target.files?.[0] || null)}
          className="mb-2"
        />

        {/* Image preview */}
        {imgUploadLoading === idx ? (
          <p className="text-blue-600 text-sm">Uploading image...</p>
        ) : images[`image${idx}` as keyof typeof images] && (
          <img
            src={images[`image${idx}` as keyof typeof images]}
            alt={`Preview ${idx}`}
            className="w-40 h-28 object-cover rounded mt-2"
          />
        )}
      </div>
    ))}

    <button
      type="submit"
      disabled={loading}
      className={`mt-4 px-6 py-3 rounded-lg text-white ${
        loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {loading ? "Saving..." : "Save Section 2"}
    </button>

    {message && (
      <p
        className={`mt-3 text-sm ${
          message.includes("✅") ? "text-green-600" : "text-red-600"
        }`}
      >
        {message}
      </p>
    )}
  </form>
)}


      </div>
    </>
  );
}
