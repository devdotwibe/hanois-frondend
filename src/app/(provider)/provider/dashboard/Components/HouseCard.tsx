"use client";
import React, { useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { API_URL } from "@/config";

type HouseCardProps = {
  logo?: string | StaticImageData;
  name: string;
  providerId?: number; // made optional
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

  // endpoint is null when providerId is not available
  const endpoint =
    providerId && typeof providerId === "number"
      ? `${API_URL}providers/update-profile/${providerId}`
      : null;

  const resolveImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    let base = API_URL.replace(/\/+$/, "");
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");

    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const notifyProviderUpdated = (providerData?: any) => {
    try {
      window.dispatchEvent(
        new CustomEvent("providerUpdated", {
          detail: { providerId, provider: providerData ?? null },
        })
      );
    } catch (e) {
      // ignore
    }
  };

  const extractProviderFromResponse = (data: any) => {
    if (!data) return null;
    if (data.data && data.data.provider) return data.data.provider;
    if (data.provider) return data.provider;
    if (data.data && typeof data.data === "object" && data.data.id) return data.data;
    if (data.id) return data;
    return null;
  };

  const cacheProvider = (provider: any) => {
    try {
      if (provider && provider.id) {
        localStorage.setItem(`provider_${provider.id}`, JSON.stringify(provider));
      }
    } catch (e) {
      // ignore storage errors
    }
  };

  const uploadFile = async (file: File) => {
    if (!endpoint) {
      alert("You must be signed in to upload an image.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("professional_headline", headline ?? "");

      const res = await fetch(endpoint, {
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
        const newImage = provider.image ?? null;
        setImagePath(newImage);
        setHeadline(provider.professional_headline ?? headline);
        cacheProvider(provider);
        notifyProviderUpdated(provider);
      } else {
        const newImage = data?.data?.provider?.image ?? data?.provider?.image ?? null;
        setImagePath(newImage);
      }
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
    if (!endpoint) {
      alert("You must be signed in to remove the image.");
      return;
    }
    if (!confirm("Remove image?")) return;
    try {
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

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Remove failed");
      }

      const data = await res.json();
      const provider = extractProviderFromResponse(data);
      if (provider) {
        setImagePath(provider.image ?? null);
        setHeadline(provider.professional_headline ?? headline);
        cacheProvider(provider);
        notifyProviderUpdated(provider);
      } else {
        setImagePath(null);
      }
    } catch (err) {
      console.error("Remove error:", err);
      alert("Failed to remove image.");
    } finally {
      setRemoving(false);
    }
  };

  const handleSaveHeadline = async () => {
    if (!endpoint) {
      alert("You must be signed in to save your headline.");
      return;
    }
    try {
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
        cacheProvider(provider);
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

  const isEditable = typeof providerId === "number" && !isNaN(providerId);

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
                disabled={removing || !isEditable}
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
                  cursor: isEditable ? "pointer" : "not-allowed",
                }}
                title={isEditable ? "Remove image" : "Sign in to remove image"}
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
              disabled={!isEditable}
            />
            <button
              onClick={handleSaveHeadline}
              disabled={savingHeadline || !isEditable}
              style={{
                border: "none",
                background: "transparent",
                cursor: isEditable ? "pointer" : "not-allowed",
              }}
              title={isEditable ? "Save" : "Sign in to save"}
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
              title={isEditable ? "Edit description" : "Sign in to edit"}
              style={{
                border: "none",
                background: "transparent",
                cursor: isEditable ? "pointer" : "not-allowed",
                fontSize: "1.1rem",
                marginLeft: "4px",
              }}
              disabled={!isEditable}
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
            disabled={uploading || !isEditable}
            title={isEditable ? "Upload new image" : "Sign in to upload"}
          >
            {uploading ? "Uploading..." : "Upload New Image"}
          </button>
        </div>

        {/* If not editable, show small hint */}
        {!isEditable && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
            Sign in to edit profile image and headline.
          </div>
        )}
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
