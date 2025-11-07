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

  const [imagePath, setImagePath] = useState<string | null>(initialImagePath);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [headline, setHeadline] = useState(initialDescription);
  const [savingHeadline, setSavingHeadline] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

const IMAGE_ENDPOINT = `${API_URL}providers/update-image/${providerId}`;
const HEADLINE_ENDPOINT = `${API_URL}providers/update-headline/${providerId}`;

  const resolveImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    let base = API_URL.replace(/\/+$/, "");
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");

    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // helper to notify other parts of the app that this provider changed
  const notifyProviderUpdated = (providerData?: any) => {
    try {
      window.dispatchEvent(
        new CustomEvent("providerUpdated", {
          detail: { providerId, provider: providerData ?? null },
        })
      );
    } catch (e) {
      // ignore if dispatch fails in strange environments
      // console.warn("notifyProviderUpdated failed", e);
    }
  };

const uploadFile = async (file: File) => {
  try {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(IMAGE_ENDPOINT, {
      method: "PUT",
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    setImagePath(data?.data?.provider?.image ?? null);
    notifyProviderUpdated(data?.data?.provider);
  } catch (err) {
    console.error("Upload error:", err);
    alert("Failed to upload image.");
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
    formData.append("remove_image", "1");

    const res = await fetch(IMAGE_ENDPOINT, {
      method: "PUT",
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    setImagePath(data?.data?.provider?.image ?? null);
    notifyProviderUpdated(data?.data?.provider);
  } catch (err) {
    console.error("Remove image error:", err);
    alert("Failed to remove image.");
  } finally {
    setRemoving(false);
  }
};

const handleSaveHeadline = async () => {
  try {
    setSavingHeadline(true);
    const payload = { professional_headline: headline ?? "" };

    const res = await fetch(HEADLINE_ENDPOINT, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    setHeadline(data?.data?.provider?.professional_headline ?? headline);
    notifyProviderUpdated(data?.data?.provider);
    setEditing(false);
  } catch (err) {
    console.error("Save headline error:", err);
    alert("Failed to save headline.");
  } finally {
    setSavingHeadline(false);
  }
};


  return (
    <div className="house-card" style={{ position: "relative" }}>
      {/* Logo / Image */}
      <div className="house-card-logo" style={{ position: "relative" }}>
        <div className="h-logodiv" style={{ position: "relative" }}>
          {imagePath ? (
            <div style={{ position: "relative", width: 160, height: 128 }}>
              <img
                src={resolveImageUrl(imagePath) as string}
                alt={`${name} logo`}
                width={160}
                height={128}
                className="house-card-img"
                style={{ objectFit: "cover", width: 160, height: 128 }}
              />
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
          ) : logo ? (
            <Image
              src={logo as StaticImageData | string}
              alt={`${name} logo`}
              width={160}
              height={128}
              className="house-card-img"
            />
          ) : (
            <div
              style={{
                width: 160,
                height: 128,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f0f0f0",
              }}
              className="house-card-img"
            >
              No image
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="house-card-info">
        <h2 className="house-card-title">{name}</h2>

        {/* Headline + Edit Icon */}
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="house-card-desc-input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Professional headline"
              style={{ flex: 1 }}
            />
            <button
              onClick={handleSaveHeadline}
              disabled={savingHeadline}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Save"
            >
              ✅
            </button>
            <button
              onClick={() => {
                setEditing(false);
                // revert to last saved headline if user cancels (optional)
                // could request latest from server, but keep simple:
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Cancel"
            >
              ✖
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <p
              className="house-card-desc"
              style={{
                flex: 1,
                margin: 0,
                wordBreak: "break-word",
              }}
            >
              {headline || "No headline set"}
            </p>
            <button
              className="house-card-edit-btn"
              onClick={() => setEditing(true)}
              title="Edit description"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "1.1rem",
                marginLeft: "4px",
              }}
            >
              ✎
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div style={{ marginTop: 10 }}>
          <button
            className="house-card-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload New Image"}
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
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
