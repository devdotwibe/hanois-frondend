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
  const endpoint = `${API_URL}providers/update-profile/${providerId}`;

  // ✅ Helper: Normalize URLs
  const resolveImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    let base = API_URL.replace(/\/+$/, "");
    base = base.replace(/\/api\/api$/i, "/api").replace(/\/api$/i, "/api");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // ✅ Notify app that provider changed
  const notifyProviderUpdated = (providerData?: any) => {
    window.dispatchEvent(
      new CustomEvent("providerUpdated", {
        detail: { providerId, provider: providerData ?? null },
      })
    );
  };

  // ✅ Extract provider object from API response
  const extractProviderFromResponse = (data: any) => {
    if (!data) return null;
    if (data.data?.provider) return data.data.provider;
    if (data.provider) return data.provider;
    if (data.data?.id) return data.data;
    if (data.id) return data;
    return null;
  };

  // ✅ Upload image (auto-saves headline too)
  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("professional_headline", headline ?? "");

    const res = await fetch(endpoint, {
      method: "PUT",
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) throw new Error(data?.message || "Upload failed");

    const provider = extractProviderFromResponse(data);
    if (provider) {
      setImagePath(provider.image ?? null);
      setHeadline(provider.professional_headline ?? headline);
      notifyProviderUpdated(provider);
    }
  };

  // ✅ Remove image (set to null)
  const handleRemoveImage = async () => {
    if (!confirm("Remove image?")) return;
    setRemoving(true);

    const payload = {
      image: null,
      professional_headline: headline ?? "",
    };

    const res = await fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    setRemoving(false);

    if (!res.ok) throw new Error(data?.message || "Remove failed");

    const provider = extractProviderFromResponse(data);
    if (provider) {
      setImagePath(provider.image ?? null);
      setHeadline(provider.professional_headline ?? headline);
      notifyProviderUpdated(provider);
    } else {
      setImagePath(null);
      notifyProviderUpdated();
    }
  };

  // ✅ Save headline changes (auto-saves immediately)
  const handleSaveHeadline = async () => {
    setSavingHeadline(true);

    const payload = { professional_headline: headline ?? "" };
    const res = await fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    setSavingHeadline(false);

    if (!res.ok) throw new Error(data?.message || "Save headline failed");

    const provider = extractProviderFromResponse(data);
    if (provider) {
      setHeadline(provider.professional_headline ?? headline);
      setImagePath(provider.image ?? imagePath);
      notifyProviderUpdated(provider);
    }

    setEditing(false);
  };

  // ✅ Remove headline (set to null)
  const handleRemoveHeadline = async () => {
    if (!confirm("Remove headline?")) return;
    setSavingHeadline(true);

    const payload = { professional_headline: null };
    const res = await fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    setSavingHeadline(false);

    if (!res.ok) throw new Error(data?.message || "Remove headline failed");

    const provider = extractProviderFromResponse(data);
    if (provider) {
      setHeadline("");
      notifyProviderUpdated(provider);
    }
  };

  // ✅ Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file).catch((err) => {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="house-card" style={{ position: "relative" }}>
      {/* Image */}
      <div className="h-logodiv" style={{ position: "relative" }}>
        {imagePath ? (
          <div style={{ position: "relative", width: 160, height: 128 }}>
            <img
              src={resolveImageUrl(imagePath) as string}
              alt={`${name} logo`}
              width={160}
              height={128}
              style={{ objectFit: "cover" }}
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
              title="Remove image"
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
            >
              ✕
            </button>
          </div>
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
          >
            No image
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        style={{ marginTop: 10 }}
      >
        {uploading ? "Uploading..." : "Upload New Image"}
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Headline */}
      <div style={{ marginTop: 15 }}>
        <h2>{name}</h2>

        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
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
              title="Save"
            >
              ✅
            </button>
            <button onClick={() => setEditing(false)} title="Cancel">
              ✖
            </button>
            {headline && (
              <button
                onClick={() =>
                  handleRemoveHeadline().catch((err) => {
                    console.error("Remove headline error:", err);
                    alert("Failed to remove headline.");
                  })
                }
                title="Delete headline"
              >
                🗑️
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p>{headline || "No headline set"}</p>
            <button onClick={() => setEditing(true)} title="Edit headline">
              ✎
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseCard;
