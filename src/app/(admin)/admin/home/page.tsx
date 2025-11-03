"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "@/config";

// Dynamically load ReactQuill editor (safe for Next.js SSR)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function HomeAdminPage({ bannerId }: { bannerId: string }) {
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
    if (!bannerId) return;

    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${API_URL}banner/${bannerId}`);
        const b = res.data.banner;
        setEngTitle(b.engtitle);
        setEngDescription(b.engdescription);
        setArabTitle(b.arabtitle);
        setArabDescription(b.arabdescription);
      } catch (error) {
        console.error("Failed to fetch banner", error);
        setMessage("❌ Failed to load banner data.");
      }
    };

    fetchBanner();
  }, [bannerId]);

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

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerId) {
      setMessage("❌ No banner ID provided.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.put(`${API_URL}banner/${bannerId}`, {
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
      setMessage("❌ Error saving.");
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
        /* Optional: direction for Arabic input fields */
        input.arabic-text {
          direction: rtl;
          text-align: right;
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">🏠 Manage Home Page Content</h1>

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
            🏷️ All Fields
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "tab2"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tab2")}
          >
            📝 Content
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
                placeholder="Enter English title"
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
              <label className="block mb-2 font-medium">العنوان العربي</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 arabic-text"
                placeholder="أدخل العنوان العربي"
                value={arabTitle}
                onChange={(e) => setArabTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="block mb-2 font-medium">الوصف العربي</label>
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
              {loading ? "Saving..." : "Save All"}
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

        {/* Tab 2 content placeholder */}
        {activeTab === "tab2" && (
          <div className="text-gray-500 italic">Content tab coming soon...</div>
        )}
      </div>
    </>
  );
}
