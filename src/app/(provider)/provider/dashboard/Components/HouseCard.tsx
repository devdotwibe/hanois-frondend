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

  // Read token from cookie at call time (fresh). This will return null if cookie not present.
  const readTokenCookie = (): string | null => {
    if (typeof document === "undefined") return null;
    const cookieString = document.cookie || "";
    const match = cookieString.match(/(?:^|;\s*)token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const endpoint = `${API_URL.replace(/\/+$/, "")}/providers/update-profile/${providerId}`;

  const resolveImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    let base = API_URL.replace(/\/+$/, "");
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Diagnostics helper
  const logRequestDiagnostics = (method: string, url: string, tokenPresent: boolean) => {
    console.info(`[HouseCard] ${method} ${url} — tokenCookiePresent: ${tokenPresent}`);
    try {
      console.info("[HouseCard] document.cookie:", document.cookie);
    } catch {
      console.info("[HouseCard] document.cookie: (unavailable)");
    }
  };

  const sendFormData = async (formData: FormData) => {
    const token = readTokenCookie(); // read fresh each request
    logRequestDiagnostics("PUT", endpoint, Boolean(token));

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        headers,
        credentials: "include",
      });
    } catch (fetchErr) {
      console.error("[HouseCard] network error:", fetchErr);
      throw new Error(`Network error: ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`);
    }

    if (res.status === 401) {
      // helpful console details for debugging
      console.warn("[HouseCard] 401 from server. Check that backend accepts Authorization header or cookie-based auth.");
      const body = await res.text().catch(() => "(no body)");
      console.warn("[HouseCard] server body:", body);
      alert("Session expired or unauthorized. Please log in again.");
      return null;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "(unable to read body)");
      console.error("[HouseCard] server error:", res.status, res.statusText, body);
      throw new Error(`Request failed: ${res.status} ${res.statusText} — ${body}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json().catch(() => null);
    } else {
      return res.text().catch(() => null);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("professional_headline", headline ?? "");
      const data = await sendFormData(formData);
      if (data && typeof data === "object") {
        const provider = (data as any)?.data?.provider ?? (data as any)?.provider ?? null;
        if (provider) {
          setImagePath(provider.image ?? null);
          if (provider.professional_headline) setHeadline(provider.professional_headline);
        } else if ((data as any)?.image) {
          setImagePath((data as any).image);
        }
      }
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
      formData.append("professional_headline", headline ?? "");
      // If backend expects an explicit removal flag, append it here:
      // formData.append("remove_image", "1");
      const data = await sendFormData(formData);
      if (data && typeof data === "object") {
        const provider = (data as any)?.data?.provider ?? null;
        if (provider) {
          setImagePath(provider.image ?? null);
          if (provider.professional_headline) setHeadline(provider.professional_headline);
        }
      }
    } catch (err) {
      console.error("Remove error:", err);
      alert("Failed to remove image. See console for details.");
    } finally {
      setRemoving(false);
    }
  };

  const handleSaveHeadline = async () => {
    try {
      setSavingHeadline(true);
      const formData = new FormData();
      formData.append("professional_headline", headline ?? "");
      const data = await sendFormData(formData);
      if (data && typeof data === "object") {
        const provider = (data as any)?.data?.provider ?? null;
        if (provider && provider.professional_headline) {
          setHeadline(provider.professional_headline);
        }
      }
      setEditing(false);
    } catch (err) {
      console.error("Save headline error:", err);
      alert("Failed to save headline. See console for details.");
    } finally {
      setSavingHeadline(false);
    }
  };

  return (
    <div className="house-card" style={{ position: "relative" }}>
      <div className="house-card-logo" style={{ position: "relative" }}>
        <div className="h-logodiv">
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
            </div>
          ) : logo ? (
            <Image src={logo} alt={`${name} logo`} width={160} height={128} className="house-card-img" />
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

          {imagePath && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={removing}
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
          </div>
        ) : (
          <>
            <p className="house-card-desc">{headline}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button className="house-card-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload New Image"}
              </button>
              <button
                className="house-card-edit-btn"
                onClick={() => setEditing(true)}
                title="Edit description"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ✎
              </button>
            </div>
          </>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
    </div>
  );
};

export default HouseCard;
