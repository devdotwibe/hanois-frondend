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

  // token detection (safe guard for SSR)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Prepare endpoints (normalize trailing slashes)
  const apiBase = (API_URL || "").replace(/\/+$/, "");
  const imageEndpoint = `${apiBase}/providers/update-profile/${providerId}/image`;
  const headlineEndpoint = `${apiBase}/providers/update-profile/${providerId}/headline`;

  // Resolve image path to absolute URL the same way your previous code did
  const resolveImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    let base = apiBase;
    // previous code attempted to fix duplicated '/api' segments — keep safe adjustments
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");

    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // helper to notify other parts of the app that this provider changed
  const notifyProviderUpdated = (providerData?: any) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("providerUpdated", {
        detail: { providerId, provider: providerData ?? null },
      })
    );
  };

  // helper to normalize different response shapes from backend
  const extractProviderFromResponse = (data: any) => {
    if (!data) return null;
    // try common shapes you've used
    if (data.data && data.data.provider) return data.data.provider;
    if (data.provider) return data.provider;
    if (data.data && typeof data.data === "object" && data.data.id) return data.data;
    if (data.id) return data;
    return null;
  };

  /** Upload an image file (multipart/form-data) */
  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(imageEndpoint, {
        method: "PUT",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const data = await res.json();
      const provider = extractProviderFromResponse(data);
      if (provider) {
        setImagePath(provider.image ?? null);
        setHeadline(provider.professional_headline ?? headline);
        notifyProviderUpdated(provider);
      } else {
        const newImage = data?.data?.provider?.image ?? data?.provider?.image ?? null;
        setImagePath(newImage);
        notifyProviderUpdated();
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file).catch((err) => {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Remove image via DELETE endpoint */
  const handleRemoveImage = async () => {
    if (!confirm("Remove image?")) return;
    setRemoving(true);
    try {
      const res = await fetch(imageEndpoint, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Remove failed");
      }

      const data = await res.json();
      const provider = extractProviderFromResponse(data);
      if (provider) {
        setImagePath(provider.image ?? null);
        setHeadline(provider.professional_headline ?? headline);
        notifyProviderUpdated(provider);
      } else {
        setImagePath(null);
        notifyProviderUpdated();
      }
    } catch (err) {
      console.error("Remove image error:", err);
      alert("Failed to remove image.");
    } finally {
      setRemoving(false);
    }
  };

  /** Save headline separately (JSON) */
  const handleSaveHeadline = async () => {
    setSavingHeadline(true);
    try {
      const payload = { professional_headline: headline ?? "" };

      const res = await fetch(headlineEndpoint, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Save headline failed");
      }

      const data = await res.json();
      const provider = extractProviderFromResponse(data);
      if (provider) {
        setHeadline(provider.professional_headline ?? headline);
        if (typeof provider.image !== "undefined") {
          setImagePath(provider.image ?? null);
        }
        notifyProviderUpdated(provider);
      } else {
        notifyProviderUpdated();
      }

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
                onClick={() =>
                  handleRemoveImage().catch((err) => {
                    console.error("Remove error:", err);
                    alert("Failed to remove image.");
                  })
                }
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
              onClick={() =>
                handleSaveHeadline().catch((err) => {
                  console.error("Save headline error:", err);
                  alert("Failed to save headline.");
                })
              }
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
