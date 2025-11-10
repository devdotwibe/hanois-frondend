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

  const resolveImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    let base = API_URL.replace(/\/+$/, "");
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");

    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const notifyProviderUpdated = (providerData?: any) => {
    window.dispatchEvent(
      new CustomEvent("providerUpdated", {
        detail: { providerId, provider: providerData ?? null },
      })
    );
  };

  const extractProviderFromResponse = (data: any) => {
    if (!data) return null;
    if (data.data && data.data.provider) return data.data.provider;
    if (data.provider) return data.provider;
    if (data.data && typeof data.data === "object" && data.data.id)
      return data.data;
    if (data.id) return data;
    return null;
  };

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

    if (!res.ok) {
      const text = await res.text();
      setUploading(false);
      throw new Error(text || "Upload failed");
    }

    const data = await res.json();
    const provider = extractProviderFromResponse(data);
    if (provider) {
      const newImage = provider.image ?? null;
      setImagePath(newImage);
      setHeadline(provider.professional_headline ?? headline);
      notifyProviderUpdated(provider);
    } else {
      const newImage =
        data?.data?.provider?.image ?? data?.provider?.image ?? null;
      setImagePath(newImage);
      notifyProviderUpdated();
    }
    setUploading(false);
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 👇 Instantly show the selected image before upload finishes
  const previewUrl = URL.createObjectURL(file);
  setImagePath(previewUrl);

  uploadFile(file)
    .then(() => {
      // Once upload finishes, the real server URL replaces the preview automatically
      URL.revokeObjectURL(previewUrl); // cleanup the preview
    })
    .catch((err) => {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
      // revert to previous state if upload fails
      setImagePath(initialImagePath ?? null);
    });

  if (fileInputRef.current) fileInputRef.current.value = "";
};


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

    if (!res.ok) {
      const text = await res.text();
      setRemoving(false);
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

    setRemoving(false);
  };

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

    if (!res.ok) {
      const text = await res.text();
      setSavingHeadline(false);
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
    setSavingHeadline(false);
  };

  // ✅ NEW: Remove headline (delete headline text)
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

    if (!res.ok) {
      const text = await res.text();
      setSavingHeadline(false);
      throw new Error(text || "Remove headline failed");
    }

    const data = await res.json();
    const provider = extractProviderFromResponse(data);
    if (provider) {
      setHeadline("");
      notifyProviderUpdated(provider);
    } else {
      setHeadline("");
      notifyProviderUpdated();
    }
    setSavingHeadline(false);
  };

  return (
    <div className="house-card" style={{ position: "relative" }}>
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

      <div className="house-card-info">
        <h2 className="house-card-title">{name}</h2>

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
              onClick={() => setEditing(false)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Cancel"
            >
              ✖
            </button>

            {/* 🗑 Delete headline button */}
            {headline && (
              <button
                onClick={() =>
                  handleRemoveHeadline().catch((err) => {
                    console.error("Remove headline error:", err);
                    alert("Failed to remove headline.");
                  })
                }
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                title="Delete headline"
              >
                🗑
              </button>
            )}
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
