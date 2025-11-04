"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "@/config";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import Quill from "quill";

import "./admin-home.css";

const icons = Quill.import("ui/icons");
icons["source"] = "&lt;/&gt;";

export default function HomeAdminPage() {
  // English
  const [engTitle, setEngTitle] = useState("");
  const [engDescription, setEngDescription] = useState("");

  // Arabic
  const [arabTitle, setArabTitle] = useState("");
  const [arabDescription, setArabDescription] = useState("");

  // IDs
  const [bannerEnId, setBannerEnId] = useState<number | null>(null);
  const [bannerArId, setBannerArId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Quill setup
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
        handlers: {
          source: function toggleSource() {
            const quill = this.quill;
            const editor = quill.root;
            const parent = editor.parentElement;
            const isSourceMode = parent.querySelector("textarea.source-view");

            if (isSourceMode) {
              const html = isSourceMode.value;
              quill.root.innerHTML = html;
              isSourceMode.remove();
              quill.root.style.display = "";
              quill.enable(true);
              quill.updateContents(quill.clipboard.convert(html), "user");
            } else {
              const textarea = document.createElement("textarea");
              textarea.className =
                "source-view";
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

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setMessage("");

        const res = await axios.get(`${API_URL}banner`);
        const banners = res.data?.data?.banners || res.data?.banners || [];

         console.log("📦 Banners fetched:", banners);

        const normalize = (lang: string) => (lang || "").trim().toLowerCase();

        const en = banners.find((b: any) => normalize(b.language) === "en");
        const ar = banners.find((b: any) => normalize(b.language) === "ar");

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

      } catch (err) {
        console.error("❌ Failed to fetch banners:", err);
        setMessage("❌ Unable to load banner data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

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
      };

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
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="container">
        <h1>Home Page</h1>

        <form onSubmit={handleSave}>
          <div className="section">
            <label>Title (English)</label>
            <input
              type="text"
              placeholder="Enter English title"
              value={engTitle}
              onChange={(e) => setEngTitle(e.target.value)}
              required
            />

            <div className="form-field">
              <label>Description (English)</label>
              <ReactQuill
                theme="snow"
                value={engDescription}
                onChange={setEngDescription}
                modules={modules}
              />
            </div>
          </div>

          <div className="section">
            <label>Title (Arabic)</label>
            <input
              type="text"
              className="text-right"
              value={arabTitle}
              onChange={(e) => setArabTitle(e.target.value)}
            />

            <div className="form-field">
              <label>Description (Arabic)</label>
              <ReactQuill
                theme="snow"
                value={arabDescription}
                onChange={setArabDescription}
                modules={modules}
              />
            </div>
          </div>

          <button
            type="submit"
            className="button"
            disabled={loading}
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
              className={`message ${
                message.includes("✅")
                  ? "success"
                  : message.includes("ℹ️")
                  ? "info"
                  : "error"
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
