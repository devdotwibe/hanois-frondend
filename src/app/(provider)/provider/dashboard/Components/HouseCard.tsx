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

  // Try a few common cookie names. If the cookie is HttpOnly you will NOT see it here.
  const getTokenFromCookies = (): string | null => {
    if (typeof document === "undefined") return null;
    const cookieString = document.cookie || "";
    if (!cookieString) return null;
    const cookieNames = ["token", "access_token", "jwt", "auth_token"];
    for (const name of cookieNames) {
      const match = cookieString.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
      if (match) return decodeURIComponent(match[1]);
    }
    return null;
  };

  const token = getTokenFromCookies();
  const endpoint = `${API_URL.replace(/\/+$/, "")}/providers/update-profile/${providerId}`;

  const resolveImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    // Ensure base ends with no trailing slash, and API root is correct
    let base = API_URL.replace(/\/+$/, "");
    // If your API_URL contains /api twice, fix it; adjust as needed
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Diagnostics helper
  const logRequestDiagnostics = (method: string, url: string, hasToken: boolean) => {
    console.info(`[HouseCard] ${method} ${url} — tokenReadable: ${hasToken}`);
    try {
      console.info("[HouseCard] document.cookie:", typeof document !== "undefined" ? document.cookie : "(server)");
    } catch (e) {
      console.info("[HouseCard] document.cookie: (unavailable)");
    }
  };

  const sendFormData = async (formData: FormData) => {
    logRequestDiagnostics("PUT", endpoint, Boolean(token));

    // Only attach Authorization header if we actually read a token from cookies.
    // If token is HttpOnly, token === null and we rely on cookies being sent via credentials: "include"
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      // DO NOT set Content-Type when sending FormData. Browser sets it automatically.
    }

    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        headers,
        credentials: "include", // ensures browser sends cookies (HttpOnly or not)
      });
    } catch (fetchErr) {
      console.error("[HouseCard] network/fetch error:", fetchErr);
      throw new Error(`Network error: ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`);
    }

    if (res.status === 401) {
      alert("Session expired. Please log in again.");
      return null;
    }

    if (!res.ok) {
      // try to get response body for debugging
      let text = "";
      try {
        text = await res.text();
      } catch (e) {
        text = `(failed reading response text)`;
      }
      console.error("[HouseCard] server error:", res.status, res.statusText, text);
      throw new Error(`Request failed: ${res.status} ${res.statusText} — ${text}`);
    }

    // parse JSON safely
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        return await res.json();
      } catch (e) {
        console.warn("[HouseCard] invalid JSON response", e);
        return null;
      }
    } else {
      // If server responds with plain text, return it
      try {
        const text = await res.text();
        return text;
      } catch {
        return null;
      }
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("professional_headline", headline ?? "");
      const data = await sendFormData(formData);
      // If the server returns the updated provider object, update UI from it
      if (data && typeof data === "object") {
        // safe path lookups
        const provider = (data as any)?.data?.provider ?? (data as any)?.provider ?? null;
        if (provider) {
          setImagePath(provider.image ?? null);
          if (provider.professional_headline) setHeadline(provider.professional_headline);
        } else {
          // fallback: if server returned image path directly
          if ((data as any)?.image) setImagePath((data as any).image);
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
      // If server expects some field to indicate removal, include it. 
      // If not, we'll just send headline (which is what your original code did).
      formData.append("professional_headline", headline ?? "");
      // Optionally some APIs expect image to be empty or a remove flag:
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
