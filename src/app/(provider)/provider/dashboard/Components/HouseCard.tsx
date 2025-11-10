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
  // NEW: show/hide static delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // remember whether there was a headline when component mounted
  const hadHeadlineInitiallyRef = useRef<boolean>(Boolean(initialDescription));
  // keep a ref to the last saved headline so "Cancel" can revert
  const prevHeadlineRef = useRef<string>(initialDescription ?? "");

  // if there's no initial description, start in editing mode (show input)
  const [editing, setEditing] = useState<boolean>(!hadHeadlineInitiallyRef.current);
  const [headline, setHeadline] = useState<string>(initialDescription ?? "");
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
    }
  };

  // helper to normalize different response shapes
  const extractProviderFromResponse = (data: any) => {
    if (!data) return null;
    if (data.data && data.data.provider) return data.data.provider;
    if (data.provider) return data.provider;
    if (data.data && typeof data.data === "object" && data.data.id) return data.data;
    if (data.id) return data;
    return null;
  };

  // Save provider to local cache so other UI can read updated values
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
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      // include headline when uploading so backend keeps it in sync
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
        // update prevHeadlineRef now that backend returned saved value
        prevHeadlineRef.current = provider.professional_headline ?? prevHeadlineRef.current;
        // after successful save, we now have a headline (if provider returned it)
        if (provider.professional_headline) hadHeadlineInitiallyRef.current = true;

        cacheProvider(provider);
        notifyProviderUpdated(provider);
      } else {
        // fallback: try other shapes
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

  // OPEN modal instead of native confirm
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  // actual deletion (called when user confirms in modal)
  const performRemoveImage = async () => {
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
        prevHeadlineRef.current = provider.professional_headline ?? prevHeadlineRef.current;
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
      closeDeleteConfirm();
    }
  };

  const handleSaveHeadline = async () => {
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
        const savedHeadline = provider.professional_headline ?? headline;
        setHeadline(savedHeadline);
        prevHeadlineRef.current = savedHeadline;
        if (savedHeadline) hadHeadlineInitiallyRef.current = true;

        if (typeof provider.image !== "undefined") {
          setImagePath(provider.image ?? null);
        }
        cacheProvider(provider);
        notifyProviderUpdated(provider);
      } else {
        prevHeadlineRef.current = headline;
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

  const handleCancelEdit = () => {
    setHeadline(prevHeadlineRef.current ?? "");
    if (hadHeadlineInitiallyRef.current) {
      setEditing(false);
    } else {
      setEditing(true);
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
                onClick={openDeleteConfirm} /* open static modal */
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
                fontSize: "1.1rem",
              }}
              title="Save"
            >
              ✅
            </button>
            <button
              onClick={handleCancelEdit}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "1.1rem",
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

        {/* Upload Button — only show when there is NO image */}
        {!imagePath && (
          <div style={{ marginTop: 10 }}>
            <button
              className="house-card-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload New Image"}
            </button>
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

      {/* ===== Static Delete Confirmation Modal ===== */}
      {showDeleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete image"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            background: "rgba(0,0,0,0.4)",
          }}
          onClick={closeDeleteConfirm} // click overlay to close
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 320,
              maxWidth: "90%",
              background: "#fff",
              borderRadius: 8,
              padding: 18,
              boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>Remove image</h3>
            <p style={{ margin: "0 0 16px 0" }}>
              Are you sure you want to remove the image? This action can be undone by uploading a new image.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={closeDeleteConfirm}
                disabled={removing}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: "#f8f8f8",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={performRemoveImage}
                disabled={removing}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: removing ? "#ccc" : "#e53935",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {removing ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===== end modal ===== */}
    </div>
  );
};

export default HouseCard;
