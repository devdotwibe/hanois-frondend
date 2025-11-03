"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "@/config";

// ✅ Load react-quill-new dynamically (safe for Next.js)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function HomeAdminPage() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");

  // ✅ Quill toolbar with image upload support
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

  // ✅ Submit handlers
  const handleSubmitTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTitle(true);
    setMessageTitle("");

    try {
      const res = await axios.post(`${API_URL}admin/home/title`, { title });
      if (res.status === 200) setMessageTitle("✅ Title saved successfully!");
      else setMessageTitle("❌ Failed to save title.");
    } catch (error) {
      console.error("Error saving title:", error);
      setMessageTitle("❌ Error saving title.");
    } finally {
      setLoadingTitle(false);
    }
  };

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingContent(true);
    setMessageContent("");

    try {
      const res = await axios.post(`${API_URL}admin/home/content`, { content });
      if (res.status === 200) setMessageContent("✅ Content saved successfully!");
      else setMessageContent("❌ Failed to save content.");
    } catch (error) {
      console.error("Error saving content:", error);
      setMessageContent("❌ Error saving content.");
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">🏠 Manage Home Page Content</h1>

      {/* ✅ Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "tab1"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("tab1")}
        >
          🏷️ Title
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

      {/* ✅ Tab 1 — Title Form */}
      {activeTab === "tab1" && (
        <form onSubmit={handleSubmitTitle} className="space-y-4">
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            placeholder="Enter home page title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            type="submit"
            disabled={loadingTitle}
            className={`mt-2 px-5 py-2 rounded-lg text-white ${
              loadingTitle ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loadingTitle ? "Saving..." : "Save Title"}
          </button>

          {messageTitle && (
            <p
              className={`mt-2 text-sm ${
                messageTitle.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {messageTitle}
            </p>
          )}
        </form>
      )}

      {/* ✅ Tab 2 — Content Form */}
      {activeTab === "tab2" && (
        <form onSubmit={handleSubmitContent} className="space-y-4">
          <label className="block mb-2 font-medium">Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your homepage content..."
            modules={modules}
            style={{ height: "250px" }}
          />

          <button
            type="submit"
            disabled={loadingContent}
            className={`mt-4 px-5 py-2 rounded-lg text-white ${
              loadingContent ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loadingContent ? "Saving..." : "Save Content"}
          </button>

          {messageContent && (
            <p
              className={`mt-2 text-sm ${
                messageContent.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {messageContent}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
