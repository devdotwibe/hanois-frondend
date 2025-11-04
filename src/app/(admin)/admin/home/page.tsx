"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "@/config";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// 🧩 Correct: import Quill core for icon customization
import Quill from "quill"; // Import Quill core directly
import "react-quill-new/dist/quill.snow.css";

const icons = Quill.import("ui/icons");
icons["source"] = "&lt;/&gt;"; // Add a custom “<>” icon for Source mode




export default function HomeAdminPage() {
  // 🟩 English Banner Fields
  const [engTitle, setEngTitle] = useState("");
  const [engDescription, setEngDescription] = useState("");

  // 🟩 Arabic Banner Fields
  const [arabTitle, setArabTitle] = useState("");
  const [arabDescription, setArabDescription] = useState("");

  // IDs (for update mode)
  const [bannerEnId, setBannerEnId] = useState<number | null>(null);
  const [bannerArId, setBannerArId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟩 Quill setup
const modules = useMemo(() => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
      ["source"], // 🧩 Add our custom “Source” button
    ],
    handlers: {
      // 🧩 Custom source toggle button
source: function toggleSource() {
  const quill = this.quill;
  const editor = quill.root;
  const parent = editor.parentElement;

  const isSourceMode = parent.querySelector("textarea.source-view");

  if (isSourceMode) {
    // ✅ Switch back to WYSIWYG mode
    const html = isSourceMode.value;
    quill.root.innerHTML = html;
    isSourceMode.remove();
    quill.root.style.display = "";
    quill.enable(true);

    // ✅ Trigger Quill’s built-in change event to sync with ReactQuill
    quill.updateContents(quill.clipboard.convert(html), "user");
  } else {
    // ✅ Switch to HTML Source mode
    const textarea = document.createElement("textarea");
    textarea.className = "source-view w-full border rounded p-2 text-sm font-mono";
    textarea.style.height = `${quill.root.scrollHeight}px`;
    textarea.value = quill.root.innerHTML;

    // ✅ Optional: live sync (update editor as you type)
    textarea.addEventListener("input", () => {
      quill.root.innerHTML = textarea.value;
    });

    quill.root.style.display = "none";
    quill.enable(false);
    parent.appendChild(textarea);
  }
},



      // 🧩 Image upload handler (kept from your version)
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
}), []);

useEffect(() => {
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(`${API_URL}banner`);
      const banners = res.data?.data?.banners || res.data?.banners || [];

      console.log("📦 Banners fetched:", banners); // Debug log

      const en = banners.find((b: any) => b?.language?.trim().toLowerCase() === "en");
      const ar = banners.find((b: any) => b?.language?.trim().toLowerCase() === "ar");

      if (en) {
        setEngTitle(en.engtitle || "");
        setEngDescription(en.engdescription || "");
        setBannerEnId(en.id);
      }

      if (ar) {
        setArabTitle(ar.arabtitle || "");
        setArabDescription(ar.arabdescription || "");
        setBannerArId(ar.id);
      }

      // ✅ Only show this message if BOTH are missing
      if (!en && !ar) {
        setMessage("ℹ️ No existing banner found. You can create one now.");
      } else {
        setMessage(""); // ✅ Clear message if banners exist
      }
    } catch (err) {
      console.error("❌ Failed to fetch banners:", err);
      setMessage("❌ Unable to load banner data.");
    } finally {
      setLoading(false);
    }
  };

  fetchBanners();
}, []);

  // 🟩 Create or Update banners
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        engtitle: engTitle,
        engdescription: engDescription,
        arabtitle: arabTitle,
        arabdescription: arabDescription,

        engtitle_ar: engTitle,
        engdescription_ar: engDescription,
        arabtitle_ar: arabTitle,
        arabdescription_ar: arabDescription,
      };

      // If banners already exist → update, else create new
      const endpoint =
        bannerEnId || bannerArId
          ? `${API_URL}banner/update-single`
          : `${API_URL}banner`;

      const method = bannerEnId || bannerArId ? "put" : "post";

      const res =
        method === "post"
          ? await axios.post(endpoint, payload)
          : await axios.put(endpoint, payload);

      if (res.status === 200 || res.status === 201) {
        setMessage(
          bannerEnId || bannerArId
            ? "✅ Banner updated successfully!"
            : "✅ Banner created successfully!"
        );
      } else {
        setMessage("❌ Failed to save banner.");
      }
    } catch (err: any) {
      console.error("❌ Save failed:", err);
      setMessage(
        err.response?.data?.error || "❌ Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .form-field {
          margin-bottom: 1.5rem;
        }
        .ql-editor[dir="rtl"] {
          text-align: right;
        }

        .source-view {
  width: 100%;
  height: 300px;
  resize: vertical;
  border: 1px solid #ccc;
  background: #f9fafb;
  color: #333;
  font-family: monospace;
  padding: 8px;
  border-radius: 6px;
}




      `}</style>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Home Page
        </h1>

        <form onSubmit={handleSave}>
          {/* English Section */}
          <div className="border rounded-lg p-5 mb-6 shadow-sm bg-white">
           

            <div className="form-field">
              <label className="block mb-2 font-medium">Title (English)</label>
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
              <label className="block mb-2 font-medium">
                Description (English)
              </label>
              <ReactQuill
                theme="snow"
                value={engDescription}
                onChange={setEngDescription}
                modules={modules}
                style={{ minHeight: "150px" }}
              />
            </div>
          </div>

          {/* Arabic Section */}
          <div className="border rounded-lg p-5 shadow-sm bg-white">
          

            <div className="form-field">
              <label className="block mb-2 font-medium">Title (Arabic)</label>
              <input
                type="text"
              
                className="w-full border rounded-lg p-2 text-right"
             
                value={arabTitle}
                onChange={(e) => setArabTitle(e.target.value)}
               
              />
            </div>

            <div className="form-field">
              <label className="block mb-2 font-medium">
                Description (Arabic)
              </label>
              <ReactQuill
                theme="snow"
                value={arabDescription}
                onChange={setArabDescription}
                modules={modules}
                style={{ minHeight: "150px" }}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 px-6 py-2 rounded-lg text-white font-medium ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? bannerEnId || bannerArId
                ? "Updating..."
                : "Creating..."
              : bannerEnId || bannerArId
              ? "Update Banner"
              : "Create Banner"}
          </button>

          {message && (
            <p
              className={`mt-4 text-sm font-medium ${
                message.includes("✅")
                  ? "text-green-600"
                  : message.includes("ℹ️")
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
