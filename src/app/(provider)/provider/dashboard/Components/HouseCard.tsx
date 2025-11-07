"use client";
import React, { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { API_URL } from "@/config";

type Provider = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  register_no?: string;
  location?: string;
  team_size?: number | null;
  service?: string;
  website?: string;
  social_media?: string;
  image?: string | null;
  professional_headline?: string | null;
  notes?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  other_link?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

type HouseCardProps = {
  logo?: string | StaticImageData;
  providerId: number;
  provider: Provider;
};

const HouseCard: React.FC<HouseCardProps> = ({ logo, providerId, provider }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // initialize from provider prop
  const [imagePath, setImagePath] = useState<string | null>(provider.image ?? null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingHeadline, setSavingHeadline] = useState(false);

  // profile fields
  const [name, setName] = useState(provider.name ?? "");
  const [email, setEmail] = useState(provider.email ?? "");
  const [phone, setPhone] = useState(provider.phone ?? "");
  const [registerNo, setRegisterNo] = useState(provider.register_no ?? "");
  const [location, setLocation] = useState(provider.location ?? "");
  const [teamSize, setTeamSize] = useState<number | "">(
    provider.team_size ?? ""
  );
  const [service, setService] = useState(provider.service ?? "");
  const [website, setWebsite] = useState(provider.website ?? "");
  const [socialMedia, setSocialMedia] = useState(provider.social_media ?? "");
  const [headline, setHeadline] = useState(provider.professional_headline ?? "");
  const [notes, setNotes] = useState(provider.notes ?? "");
  const [facebook, setFacebook] = useState(provider.facebook ?? "");
  const [instagram, setInstagram] = useState(provider.instagram ?? "");
  const [otherLink, setOtherLink] = useState(provider.other_link ?? "");

  useEffect(() => {
    // If provider prop changes, sync local state (useful when HouseOuter fetches fresh)
    setImagePath(provider.image ?? null);
    setName(provider.name ?? "");
    setEmail(provider.email ?? "");
    setPhone(provider.phone ?? "");
    setRegisterNo(provider.register_no ?? "");
    setLocation(provider.location ?? "");
    setTeamSize(provider.team_size ?? "");
    setService(provider.service ?? "");
    setWebsite(provider.website ?? "");
    setSocialMedia(provider.social_media ?? "");
    setHeadline(provider.professional_headline ?? "");
    setNotes(provider.notes ?? "");
    setFacebook(provider.facebook ?? "");
    setInstagram(provider.instagram ?? "");
    setOtherLink(provider.other_link ?? "");
  }, [provider]);

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
    try {
      window.dispatchEvent(
        new CustomEvent("providerUpdated", {
          detail: { providerId, provider: providerData ?? null },
        })
      );
      // update local cache
      if (providerId) {
        try {
          localStorage.setItem(`provider_${providerId}`, JSON.stringify(providerData ?? {}));
        } catch (e) {}
      }
    } catch (e) {
      // ignore
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
      const newImage = data?.data?.provider?.image ?? null;
      setImagePath(newImage);
      setHeadline(data?.data?.provider?.professional_headline ?? headline);
      notifyProviderUpdated(data?.data?.provider);
      alert("Image uploaded.");
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
      formData.append("professional_headline", headline ?? "");

      const res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Remove failed");
      }
      const data = await res.json();
      setImagePath(data?.data?.provider?.image ?? null);
      setHeadline(data?.data?.provider?.professional_headline ?? headline);
      notifyProviderUpdated(data?.data?.provider);
      alert("Image removed.");
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
      setHeadline(data?.data?.provider?.professional_headline ?? headline);
      if (typeof data?.data?.provider?.image !== "undefined") {
        setImagePath(data?.data?.provider?.image ?? null);
      }
      notifyProviderUpdated(data?.data?.provider);
      setEditing(false);
      alert("Headline saved.");
    } catch (err) {
      console.error("Save headline error:", err);
      alert("Failed to save headline.");
    } finally {
      setSavingHeadline(false);
    }
  };

  // Save the full profile fields (JSON payload)
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      const payload: any = {
        name,
        email,
        phone,
        register_no: registerNo,
        location,
        team_size: teamSize === "" ? null : Number(teamSize),
        service,
        website,
        social_media: socialMedia,
        professional_headline: headline ?? "",
        notes,
        facebook,
        instagram,
        other_link: otherLink,
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
        throw new Error(text || "Save profile failed");
      }
      const data = await res.json();
      // sync with server response if provided
      const p = data?.data?.provider ?? {};
      setName(p.name ?? name);
      setEmail(p.email ?? email);
      setPhone(p.phone ?? phone);
      setRegisterNo(p.register_no ?? registerNo);
      setLocation(p.location ?? location);
      setTeamSize(p.team_size ?? teamSize);
      setService(p.service ?? service);
      setWebsite(p.website ?? website);
      setSocialMedia(p.social_media ?? socialMedia);
      setHeadline(p.professional_headline ?? headline);
      setNotes(p.notes ?? notes);
      setFacebook(p.facebook ?? facebook);
      setInstagram(p.instagram ?? instagram);
      setOtherLink(p.other_link ?? otherLink);
      if (typeof p.image !== "undefined") {
        setImagePath(p.image ?? null);
      }
      notifyProviderUpdated(p);
      alert("Profile saved.");
    } catch (err) {
      console.error("Save profile error:", err);
      alert("Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="house-card" style={{ position: "relative", display: "flex", gap: 16 }}>
      {/* Left: Image */}
      <div style={{ minWidth: 180 }}>
        <div style={{ position: "relative" }}>
          {imagePath ? (
            <div style={{ position: "relative", width: 160, height: 128 }}>
              <img
                src={resolveImageUrl(imagePath) as string}
                alt={`${name} logo`}
                width={160}
                height={128}
                className="house-card-img"
                style={{ objectFit: "cover", width: 160, height: 128, borderRadius: 8 }}
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
                borderRadius: 8,
              }}
              className="house-card-img"
            >
              No image
            </div>
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          <button
            className="house-card-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload New Image"}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Right: Form */}
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>{name || "Unnamed provider"}</h2>
        <div style={{ marginBottom: 8, color: "#666" }}>
          <small>Provider ID: {providerId} • Created: {provider.created_at ? new Date(provider.created_at).toLocaleString() : "—"}</small>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <label style={{ display: "block", fontSize: 12 }}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Register No</label>
            <input value={registerNo} onChange={(e) => setRegisterNo(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Team size</label>
            <input
              type="number"
              value={teamSize as any}
              onChange={(e) => setTeamSize(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Service</label>
            <input value={service} onChange={(e) => setService(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Website</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: 12 }}>Social media (free-form)</label>
            <input value={socialMedia} onChange={(e) => setSocialMedia(e.target.value)} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: 12 }}>Professional headline</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={headline} onChange={(e) => setHeadline(e.target.value)} style={{ flex: 1 }} />
              <button onClick={handleSaveHeadline} disabled={savingHeadline} title="Save headline">✅</button>
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: 12 }}>Notes</label>
            <textarea value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Facebook</label>
            <input value={facebook ?? ""} onChange={(e) => setFacebook(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12 }}>Instagram</label>
            <input value={instagram ?? ""} onChange={(e) => setInstagram(e.target.value)} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: 12 }}>Other link</label>
            <input value={otherLink ?? ""} onChange={(e) => setOtherLink(e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={handleSaveProfile} disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save profile"}
          </button>
          <button
            onClick={() => {
              // revert local inputs to original provider values
              setName(provider.name ?? "");
              setEmail(provider.email ?? "");
              setPhone(provider.phone ?? "");
              setRegisterNo(provider.register_no ?? "");
              setLocation(provider.location ?? "");
              setTeamSize(provider.team_size ?? "");
              setService(provider.service ?? "");
              setWebsite(provider.website ?? "");
              setSocialMedia(provider.social_media ?? "");
              setHeadline(provider.professional_headline ?? "");
              setNotes(provider.notes ?? "");
              setFacebook(provider.facebook ?? "");
              setInstagram(provider.instagram ?? "");
              setOtherLink(provider.other_link ?? "");
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
