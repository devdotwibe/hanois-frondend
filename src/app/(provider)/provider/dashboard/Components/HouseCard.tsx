"use client";
import React, { useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { API_URL } from "@/config";

type HouseCardProps = {
  logo?: string | StaticImageData;
  name: string;
  providerId: number;
  initialDescription?: string;
  initialImagePath?: string | null;
};

const HouseCard: React.FC<HouseCardProps> = ({
  logo,
  name,
  providerId,
  initialDescription = "",
  initialImagePath = null,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // start with empty values if you don't want initial content
  const [imagePath, setImagePath] = useState<string | null>(initialImagePath || null);
  const [headline, setHeadline] = useState((initialDescription || "").trim());

  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [savingHeadline, setSavingHeadline] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const endpoint = `${API_URL}providers/update-profile/${providerId}`;

  const resolveImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    let base = API_URL.replace(/\/+$/, "");
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");

    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // helper to check whether both are present
  const hasBoth = Boolean(imagePath) && headline.trim() !== "";

  // Upload file: sends headline as well (so server can store both in one call)
  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("professional_headline", headline ?? "");

      console.log("Uploading to", endpoint);
      for (const [k, v] of formData.entries()) {
        console.log("formData:", k, v instanceof File ? v.name : v);
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Upload failed:", res.status, txt);
        throw new Error(txt);
      }

      const data = await res.json();
      const newImg = data?.data?.provider?.image ?? null;
      const newHeadline = data?.data?.provider?.professional_headline ?? headline;
      setImagePath(newImg);
      setHeadline(newHeadline ?? "");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = async () => {
    if (!confirm("Remove image?")) return;

    try {
      setRemoving(true);
      const formData = new FormData();
      // send empty image by not including an image file; your server logic should interpret this as "remove"
      // but if your server expects another flag to remove, add it (e.g., formData.append('remove_image','1'))
      formData.append("professional_headline", headline ?? "");

      const res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Remove failed:", res.status, txt);
        throw new Error(txt);
      }

      const data = await res.json();
      setImagePath(data?.data?.provider?.image ?? null);
      setHeadline(data?.data?.provider?.professional_headline ?? headline);
    } catch (err) {
      console.error("Remove error:", err);
      alert("Failed to remove image.");
    } finally {
      setRemoving(false);
    }
  };

  const handleSaveHeadline = async () => {
    try {
      setSavingHeadline(true);
      const formData = new FormData();
      formData.append("professional_headline", headline ?? "");

      const res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Save headline failed:", res.status, txt);
        throw new Error(txt);
      }

      const data = await res.json();
      setHeadline(data?.data?.provider?.professional_headline ?? headline);
      setEditing(false);
    } catch (err) {
      console.error("Save headline error:", err);
      alert("Failed to save headline.");
    } finally {
      setSavingHeadline(false);
    }
  };

  // Minimal UI (when nothing or something missing)
  if (!hasBoth) {
    return (
      <div className="house-card minimal" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2 style={{ margin: "0 0 8px 0" }}>{name}</h2>
        {/* If there is an image but no headline, show the image and keep the headline input */}
        {imagePath ? (
          <div style={{ marginBottom: 8 }}>
            <img
              src={resolveImageUrl(imagePath) as string}
              alt={`${name} logo`}
              width={160}
              height={128}
              style={{ objectFit: "cover", display: "block", borderRadius: 4 }}
            />
          </div>
        ) : (
          // placeholder box
          <div style={{
            width: 160,
            height: 128,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f6f6f6",
            marginBottom: 8,
            borderRadius: 4
          }}>
            No image
          </div>
        )}

        {/* File input + upload button */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ padding: "6px 10px", cursor: "pointer" }}
          >
            {uploading ? "Uploading..." : (imagePath ? "Change image" : "Upload Image")}
          </button>

          {imagePath && (
            <button onClick={handleRemoveImage} disabled={removing} style={{ padding: "6px 10px", cursor: "pointer" }}>
              {removing ? "Removing..." : "Remove"}
            </button>
          )}
        </div>

        {/* Headline input */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Add your title"
            style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button onClick={handleSaveHeadline} disabled={savingHeadline} style={{ padding: "6px 10px" }}>
            {savingHeadline ? "Saving..." : "Save"}
          </button>
        </div>

        <p style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
          Add both an image and a title to view the full card.
        </p>
      </div>
    );
  }

  // When both present -> show full card (image + description + edit icon + remove)
  return (
    <div className="house-card" style={{ position: "relative", padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      <div className="house-card-logo" style={{ position: "relative", display: "inline-block", marginRight: 12 }}>
        <div className="h-logodiv" style={{ position: "relative" }}>
          <div style={{ position: "relative", width: 160, height: 128 }}>
            <img
              src={resolveImageUrl(imagePath) as string}
              alt={`${name} logo`}
              width={160}
              height={128}
              className="house-card-img"
              style={{ objectFit: "cover", width: 160, height: 128, borderRadius: 4 }}
            />
          </div>

          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={removing}
            className="image-remove-btn"
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              border: "none",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              width: 28,
              height: 28,
              cursor: "pointer",
            }}
            title="Remove image"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="house-card-info" style={{ display: "inline-block", verticalAlign: "top", maxWidth: 420 }}>
        <h2 className="house-card-title" style={{ margin: "0 0 8px 0" }}>{name}</h2>

        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="house-card-desc-input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Professional headline"
              style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
            <button onClick={handleSaveHeadline} disabled={savingHeadline} title="Save" style={{ cursor: "pointer" }}>
              ✅
            </button>
            <button onClick={() => setEditing(false)} title="Cancel" style={{ cursor: "pointer" }}>
              ✖
            </button>
          </div>
        ) : (
          <>
            <p className="house-card-desc" style={{ margin: "0 0 8px 0" }}>{headline}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ padding: "6px 10px" }}>
                {uploading ? "Uploading..." : "Upload New Image"}
              </button>
              <button onClick={() => setEditing(true)} title="Edit description" style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                ✎
              </button>
            </div>
          </>
        )}
      </div>

      {/* hidden file input used for change/upload when viewing */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default HouseCard;
