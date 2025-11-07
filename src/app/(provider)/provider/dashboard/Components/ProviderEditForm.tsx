"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard"; // adjust path as needed
import { API_URL } from "@/config";

type Provider = {
  id?: number;
  name?: string;
  email?: string;
  password?: string | null;
  phone?: string | null;
  register_no?: string | null;
  location?: string | null;
  team_size?: number | null;
  service?: string | null;
  website?: string | null;
  social_media?: any; // can be text/json depending on backend
  created_at?: string | null;
  categories_id?: number[] | null;
  service_id?: number[] | null;
  notes?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  other_link?: string | null;
  image?: string | null;
  professional_headline?: string | null;
  sections?: any;
  // add any other fields saved by your DB
};

type Props = {
  providerId: string | number;
};

export default function ProviderEditForm({ providerId }: Props) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields are mirrored in local state for controlled inputs
  const [form, setForm] = useState<Provider>({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProvider = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}providers/${providerId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to fetch provider");
      }
      const data = await res.json();
      // backend returns { provider } per your controller
      const prov = data?.provider ?? data?.data?.provider ?? data;
      setProvider(prov);
      setForm({
        id: prov?.id,
        name: prov?.name ?? "",
        email: prov?.email ?? "",
        // leave password blank unless user wants to change
        password: "",
        phone: prov?.phone ?? "",
        register_no: prov?.register_no ?? "",
        location: prov?.location ?? "",
        team_size: prov?.team_size ?? null,
        service: prov?.service ?? "",
        website: prov?.website ?? "",
        social_media:
          typeof prov?.social_media === "object"
            ? JSON.stringify(prov?.social_media)
            : prov?.social_media ?? "",
        categories_id: Array.isArray(prov?.categories_id)
          ? prov.categories_id
          : prov?.categories_id
          ? String(prov.categories_id)
              .split(",")
              .map((s: string) => Number(s.trim()))
          : [],
        service_id: Array.isArray(prov?.service_id)
          ? prov.service_id
          : prov?.service_id
          ? String(prov.service_id)
              .split(",")
              .map((s: string) => Number(s.trim()))
          : [],
        notes: prov?.notes ?? "",
        facebook: prov?.facebook ?? "",
        instagram: prov?.instagram ?? "",
        other_link: prov?.other_link ?? "",
        image: prov?.image ?? null,
        professional_headline: prov?.professional_headline ?? "",
        sections: prov?.sections ?? null,
        created_at: prov?.created_at ?? null,
      });
    } catch (err: any) {
      console.error("fetchProvider error", err);
      setError(err.message || "Failed to load provider");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvider();
    // listen for providerUpdated events dispatched by HouseCard
    function onProviderUpdated(e: any) {
      const detail = e?.detail;
      if (!detail) return;
      // if event pertains to this provider, merge newest values
      if (detail.providerId === Number(providerId) || detail.provider?.id === Number(providerId)) {
        const updated = detail.provider ?? null;
        if (updated) {
          setProvider((p) => ({ ...(p ?? {}), ...updated }));
          setForm((f) => ({
            ...f,
            image: updated.image ?? f.image,
            professional_headline: updated.professional_headline ?? f.professional_headline,
          }));
        }
      }
    }
    window.addEventListener("providerUpdated", onProviderUpdated as EventListener);
    return () => {
      window.removeEventListener("providerUpdated", onProviderUpdated as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  const handleChange = (k: keyof Provider) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const v =
      e.target.type === "number" ? (e.target as HTMLInputElement).valueAsNumber : e.target.value;
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  // For array inputs (categories_id, service_id) we'll support comma-separated input
  const handleArrayChange = (k: "categories_id" | "service_id") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.trim() === "") {
      setForm((prev) => ({ ...prev, [k]: [] }));
      return;
    }
    const arr = val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (isNaN(Number(s)) ? s : Number(s)));
    setForm((prev) => ({ ...prev, [k]: arr }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Build payload: only send fields that the backend expects.
      // Don't send image here (image handled by /update-profile endpoint via HouseCard).
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone ?? null,
        register_no: form.register_no ?? null,
        location: form.location ?? null,
        team_size: form.team_size ?? null,
        service: form.service ?? null,
        website: form.website ?? null,
        // social_media stored as text/json - try to parse to JSON first
        social_media: (() => {
          if (!form.social_media) return null;
          try {
            return JSON.parse(String(form.social_media));
          } catch {
            return String(form.social_media);
          }
        })(),
        categories_id: form.categories_id ?? [],
        service_id: form.service_id ?? [],
        notes: form.notes ?? null,
        facebook: form.facebook ?? null,
        instagram: form.instagram ?? null,
        other_link: form.other_link ?? null,
        professional_headline: form.professional_headline ?? null,
        sections: form.sections ?? null,
      };

      // If password is non-empty, include to update (will be hashed server-side)
      if (form.password && String(form.password).trim() !== "") {
        payload.password = form.password;
      }

      const res = await fetch(`${API_URL}providers/${providerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to save provider");
      }

      const data = await res.json();
      const updated = data?.provider ?? data?.data?.provider ?? data;
      setProvider(updated);
      // update form with any server-canonical values
      setForm((prev) => ({
        ...prev,
        name: updated?.name ?? prev.name,
        email: updated?.email ?? prev.email,
        phone: updated?.phone ?? prev.phone,
        location: updated?.location ?? prev.location,
        team_size: updated?.team_size ?? prev.team_size,
        professional_headline: updated?.professional_headline ?? prev.professional_headline,
        image: updated?.image ?? prev.image,
      }));
      // optionally notify other parts of app
      try {
        window.dispatchEvent(
          new CustomEvent("providerUpdated", {
            detail: { providerId: updated?.id ?? providerId, provider: updated },
          })
        );
      } catch (err) {}
      alert("Provider saved successfully");
    } catch (err: any) {
      console.error("save error", err);
      setError(err.message || "Failed to save provider");
      alert("Failed to save provider: " + (err.message || "unknown error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading provider...</div>;
  if (!provider && !loading) return <div>Provider not found.</div>;

  return (
    <div className="max-w-3xl p-4 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Edit Provider #{provider?.id ?? providerId}</h1>

      {/* HouseCard (image + headline management) */}
      <div className="mb-6">
        <HouseCard
          logo={undefined}
          name={form.name ?? ""}
          providerId={Number(providerId)}
          initialDescription={form.professional_headline ?? ""}
          initialImagePath={form.image ?? null}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Business name</label>
          <input
            type="text"
            value={form.name ?? ""}
            onChange={handleChange("name")}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email ?? ""}
            onChange={handleChange("email")}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            value={form.phone ?? ""}
            onChange={handleChange("phone")}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password (leave blank to keep unchanged)</label>
          <input
            type="password"
            value={form.password ?? ""}
            onChange={handleChange("password")}
            className="mt-1 block w-full border rounded p-2"
            placeholder="New password (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Registration no</label>
          <input
            type="text"
            value={form.register_no ?? ""}
            onChange={handleChange("register_no")}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={form.location ?? ""}
            onChange={handleChange("location")}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Team size</label>
          <input
            type="number"
            value={form.team_size ?? ""}
            onChange={handleChange("team_size")}
            className="mt-1 block w-full border rounded p-2"
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Service (text)</label>
          <input
            type="text"
            value={form.service ?? ""}
            onChange={handleChange("service")}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Website</label>
          <input
            type="url"
            value={form.website ?? ""}
            onChange={handleChange("website")}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Social media (string or JSON)</label>
          <textarea
            value={String(form.social_media ?? "")}
            onChange={(e) => setForm((p) => ({ ...p, social_media: e.target.value }))}
            className="mt-1 block w-full border rounded p-2"
            rows={3}
            placeholder='e.g. {"facebook":"...","twitter":"..."} or comma-separated links'
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Categories IDs (comma separated)</label>
          <input
            type="text"
            value={Array.isArray(form.categories_id) ? (form.categories_id as any).join(",") : ""}
            onChange={handleArrayChange("categories_id")}
            className="mt-1 block w-full border rounded p-2"
            placeholder="1,2,3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Service IDs (comma separated)</label>
          <input
            type="text"
            value={Array.isArray(form.service_id) ? (form.service_id as any).join(",") : ""}
            onChange={handleArrayChange("service_id")}
            className="mt-1 block w-full border rounded p-2"
            placeholder="10,11"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            className="mt-1 block w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">Facebook</label>
            <input
              type="url"
              value={form.facebook ?? ""}
              onChange={handleChange("facebook")}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Instagram</label>
            <input
              type="url"
              value={form.instagram ?? ""}
              onChange={handleChange("instagram")}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Other link</label>
            <input
              type="url"
              value={form.other_link ?? ""}
              onChange={handleChange("other_link")}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Professional headline</label>
          <input
            type="text"
            value={form.professional_headline ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, professional_headline: e.target.value }))}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save provider"}
          </button>
          <button
            type="button"
            onClick={() => {
              // reset form to last loaded provider
              fetchProvider();
            }}
            className="px-3 py-2 border rounded"
          >
            Reset
          </button>
          {error && <div className="text-sm text-red-600 ml-4">{error}</div>}
        </div>
      </form>
    </div>
  );
}
