// src/app/(provider)/provider/dashboard/Components/Tabs.tsx
"use client";
import React, { useEffect, useState } from "react";
import ProjectComponent from "./ProjectComponent";
import { API_URL, SITE_URL } from "@/config";
import { useRouter } from "next/navigation";
import MultiSelect from "./MultiSelect";

const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },
];

const MAX_NOTES = 1024;
const DEFAULT_CURRENCY = "KD";

const Tabs: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("companyinfo");

  const handleTabClick = (tabId: string) => {
    if (tabId === "project") {
      const base = (SITE_URL || "").replace(/\/+$/, "");
      const target = `${base}/provider/dashboard/projects`;
      router.push(target);
      return;
    }
    setActiveTab(tabId);
  };

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    companyName: "",
    categories: [],
    phoneNumber: "",
    location: "",
    teamSize: "",
    notes: "",
    website: "",
    facebook: "",
    instagram: "",
    other: "",
    services: [],
    professionalHeadline: "",
    image: null,
    service_notes: "",
  });

  // single declaration of errors + status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ loading: boolean; message: string; success: boolean }>({
    loading: false,
    message: "",
    success: false,
  });

  // ensure status is cleared on first mount (prevents stray success message)
  useEffect(() => {
    setStatus({ loading: false, message: "", success: false });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, options } = e.target as any;

    if (options && name !== "services") {
      const values = Array.from(options)
        .filter((opt: any) => opt.selected)
        .map((opt: any) => opt.value);
      setFormData((s: any) => ({ ...s, [name]: values }));
      return;
    }

    if (name === "notes") {
      const trimmed = value.slice(0, MAX_NOTES);
      setFormData((s: any) => ({ ...s, notes: trimmed }));
      return;
    }

    setFormData((s: any) => ({ ...s, [name]: value }));
  };

  const handleServicesSelect = (eOrValues: any) => {
    // Accept either an event (from <select>) or an array of values (from MultiSelect)
    let values: string[] = [];

    if (!eOrValues) {
      values = [];
    } else if (Array.isArray(eOrValues)) {
      values = eOrValues;
    } else if (eOrValues.target && eOrValues.target.options) {
      values = Array.from(eOrValues.target.options)
        .filter((opt: any) => opt.selected)
        .map((opt: any) => opt.value);
    } else {
      values = [];
    }

    setFormData((s: any) => ({ ...s, services: values }));

    setSelectedServices((prev) => {
      const ids = values.map(String);
      const kept = prev.filter((p) => ids.includes(String(p.id)));

      const additions = ids
        .filter((id) => !kept.some((k) => String(k.id) === id))
        .map((id) => {
          const svc = servicesList.find((s) => String(s.id) === String(id));
          return {
            id,
            name: svc ? svc.name : "",
            cost: "",
            currency: DEFAULT_CURRENCY,
          };
        });

      return [...kept, ...additions];
    });
  };

  const handleServiceFieldChange = (index: number, key: string, value: any) => {
    setSelectedServices((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const removeService = (idToRemove: string | number) => {
    setSelectedServices((prev) => prev.filter((s) => String(s.id) !== String(idToRemove)));
    setFormData((prev: any) => ({ ...prev, services: prev.services.filter((id: any) => String(id) !== String(idToRemove)) }));
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, servRes] = await Promise.all([fetch(`${API_URL}categories`), fetch(`${API_URL}services`)]);
        const catData = await catRes.json().catch(() => ({}));
        const servData = await servRes.json().catch(() => ({}));
        const cats = Array.isArray(catData) ? catData : catData.data || [];
        const svcs = Array.isArray(servData) ? servData : servData.data || [];
        setCategoriesList(cats.map((c: any) => ({ ...c, id: String(c.id) })));
        setServicesList(svcs.map((s: any) => ({ ...s, id: String(s.id) })));
      } catch (err) {
        console.error("Error fetching categories/services:", err);
      }
    };
    fetchOptions();
  }, []);

  // load provider and provider services (watch servicesList so names are available)
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        let providerId = localStorage.getItem("providerId");
        const token = localStorage.getItem("token");
        if (!providerId && token) {
          try {
            const base64 = token.split(".")[1];
            const payload = JSON.parse(atob(base64));
            providerId = String(payload?.provider_id || payload?.id || payload?.user_id);
          } catch (e) {
            /* ignore */
          }
        }
        if (!providerId) return;

        const res = await fetch(`${API_URL}providers/${providerId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || data?.message || "Failed to fetch provider");
        const provider = data?.provider ?? data ?? {};

        const categories = Array.isArray(provider.categories_id)
          ? provider.categories_id.map(String)
          : provider.categories_id
          ? [String(provider.categories_id)]
          : [];

        const services = Array.isArray(provider.service_id)
          ? provider.service_id.map(String)
          : provider.service_id
          ? [String(provider.service_id)]
          : [];

        setFormData({
          companyName: provider.name ?? "",
          categories,
          phoneNumber: provider.phone ?? "",
          location: provider.location ?? "",
          teamSize: provider.team_size != null ? String(provider.team_size) : "",
          notes: provider.notes ?? "",
          website: provider.website ?? provider.web ?? provider.social_media ?? "",
          facebook: provider.facebook ?? "",
          instagram: provider.instagram ?? "",
          other: provider.other_link ?? provider.other ?? "",
          services,
          professionalHeadline: provider.professional_headline ?? provider.professionalHeadline ?? "",
          image: provider.image ?? null,
          service_notes: provider.service_notes ?? "",
        });

        // Fetch provider_services for this provider and merge average_cost & currency
        try {
          const svcRes = await fetch(`${API_URL}providers/all-provider-services?providerId=${providerId}`);
          const svcJson = await svcRes.json();
          if (svcRes.ok && svcJson && Array.isArray(svcJson.data)) {
            const svcMap = new Map<string, { cost: string; currency: string }>();
            svcJson.data.forEach((row: any) => {
              svcMap.set(String(row.service_id), {
                cost: row.average_cost === null ? "" : String(row.average_cost),
                currency: row.currency || DEFAULT_CURRENCY,
              });
            });

            const initialSelected = (services || []).map((sid: any) => {
              const svcMeta = servicesList.find((s) => String(s.id) === String(sid));
              const existing = svcMap.get(String(sid)) || {};
              return {
                id: String(sid),
                name: svcMeta ? svcMeta.name : "",
                cost: existing.cost ?? "",
                currency: existing.currency ?? DEFAULT_CURRENCY,
              };
            });

            setSelectedServices(initialSelected);
          }
        } catch (e) {
          console.warn("Failed to fetch provider services:", e);
        }
      } catch (err) {
        console.error("Error fetching provider:", err);
      }
    };
    fetchProvider();
  }, [servicesList]);

  useEffect(() => {
    if (!servicesList || servicesList.length === 0) return;
    if (!formData.services || formData.services.length === 0) {
      setSelectedServices([]);
      return;
    }

    setSelectedServices((prev) => {
      const prevMap = new Map(prev.map((p) => [String(p.id), p]));
      return formData.services.map((id: any) => {
        const sid = String(id);
        const svcMeta = servicesList.find((s) => String(s.id) === sid);
        const existing = prevMap.get(sid);
        return {
          id: sid,
          name: svcMeta ? svcMeta.name : existing?.name ?? "",
          cost: existing?.cost ?? "",
          currency: existing?.currency ?? DEFAULT_CURRENCY,
        };
      });
    });
  }, [servicesList, formData.services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setStatus({ loading: true, message: "", success: false });

    try {
      let providerId = localStorage.getItem("providerId");
      const token = localStorage.getItem("token");

      if (!providerId && token) {
        try {
          const base64 = token.split(".")[1];
          const payload = JSON.parse(atob(base64));
          providerId = String(payload?.provider_id || payload?.id || payload?.user_id);
        } catch (e) {}
      }

      if (!token) {
        setStatus({ loading: false, message: "You must be logged in to perform this action.", success: false });
        return;
      }

      if (!providerId) {
        setStatus({ loading: false, message: "No provider id found.", success: false });
        return;
      }

      const payload = {
        name: formData.companyName,
        phone: formData.phoneNumber,
        location: formData.location,
        team_size: formData.teamSize ? parseInt(formData.teamSize) : null,
        notes: formData.notes,
        website: formData.website,
        facebook: formData.facebook,
        instagram: formData.instagram,
        other_link: formData.other,
        categories_id: formData.categories,
        service_id: selectedServices.map((s) => s.id),
        service_details: selectedServices.map((s) => ({
          id: s.id,
          name: s.name,
          cost: s.cost,
          currency: s.currency,
        })),
        professional_headline: formData.professionalHeadline,
        service_notes: formData.service_notes,
      };

      const res = await fetch(`${API_URL}providers/${providerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Update failed");

      setStatus({ loading: false, message: "Provider updated successfully!", success: true });

      router.push(`/provider/dashboard/details?providerId=${encodeURIComponent(providerId)}`);

      setErrors({});
    } catch (err: any) {
      console.error(err);
      setStatus({ loading: false, message: err.message || "Save failed", success: false });
    }
  };

  const resolveImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    let base = API_URL.replace(/\/+$/, "");
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const notesRemaining = MAX_NOTES - (formData.notes ? formData.notes.length : 0);

  return (
    <div className="tab-wrapper1">
      {/* Sidebar Navigation */}
      <ul className="tab-nav1">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <button className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => handleTabClick(tab.id)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content-wrap">
        <div className={`tab-panel ${activeTab === "companyinfo" ? "show" : ""}`}>
          <form className="settingsform company-profile1" onSubmit={handleSubmit}>
            <div className="form-grp">
              <label>Company/Business Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter title" required />
            </div>

            <MultiSelect
              label="Company Categories"
              options={categoriesList}
              selected={formData.categories}
              onChange={(values: any[]) => setFormData((prev: any) => ({ ...prev, categories: values }))}
            />

            <div className="form-grp">
              <label>Company Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" required />
            </div>

            <div className="form-grp">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location" required />
            </div>

            <div className="form-grp">
              <label>Team Size</label>
              <input type="text" name="teamSize" value={formData.teamSize} onChange={handleChange} placeholder="Enter team size" required />
            </div>

            <div className="form-grp">
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Enter notes" required maxLength={MAX_NOTES} rows={6} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#666" }}>Add a short summary that will appear on your profile</div>
                <div style={{ fontSize: 13, color: "#333" }}>{notesRemaining} characters remaining</div>
              </div>
            </div>

            <h4 style={{ fontWeight: 600, marginTop: 24 }}>Online Presence</h4>

            <div className="form-grp">
              <label>Website</label>
              <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Enter website URL" />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Your homepage, company site or blog</div>
            </div>

            <div className="form-grp">
              <label>Facebook</label>
              <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="Enter Facebook URL" />
            </div>

            <div className="form-grp">
              <label>Instagram</label>
              <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Enter Instagram URL" />
            </div>

            <div className="form-grp">
              <label>Other</label>
              <input type="text" name="other" value={formData.other} onChange={handleChange} placeholder="Enter other social media URL" />
            </div>

            <h4 style={{ fontWeight: 600, marginTop: 24 }}>Services</h4>

            <div>
              <MultiSelect
                label="Select Services"
                options={servicesList}
                selected={formData.services}
                onChange={(values: any[]) => {
                  setFormData((prev: any) => ({ ...prev, services: values }));
                  handleServicesSelect(values);
                }}
              />

              {selectedServices.length > 0 && (
                <div className="svc-outer">
                  {selectedServices.map((svc, idx) => (
                    <div key={svc.id} className="svcrow" style={{ background: "#fff" }}>
                      <div className="svc1">
                        <input type="text" value={svc.name} readOnly style={{ padding: "10px", border: "none", background: "transparent" }} />
                      </div>

                      <div className="svc1 svc2">
                        <input type="number" placeholder="Average Cost" value={svc.cost} onChange={(e) => handleServiceFieldChange(idx, "cost", e.target.value)} style={{ padding: "10px", border: "none", background: "transparent" }} />

                        <select value={svc.currency} onChange={(e) => handleServiceFieldChange(idx, "currency", e.target.value)}>
                          <option value="KD">KD</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>

                        <button type="button" onClick={() => removeService(svc.id)} aria-label="Remove service" style={{ fontSize: 16 }} className="removeservice">
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-grp">
              <label>Service Note</label>
              <input type="text" name="service_notes" value={formData.service_notes} onChange={handleChange} placeholder="Enter Service Note" />
            </div>

            <div className="save-outer">
              <button type="submit" disabled={status.loading} className="save-btn1">
                {status.loading ? "Saving..." : "Save"}
              </button>
            </div>

            {status.message && (
              <div className="statusmsg-div1 contact-sucess" style={{ marginBottom: 12 }}>
                <p
                  style={{
                    color: status.success ? "#00a056" : "red",
                    borderColor: status.success ? "#e9f8ef" : "#ffe9e9",
                  }}
                >
                  {status.message}
                </p>
              </div>
            )}
          </form>
        </div>

        <div className={`tab-panel ${activeTab === "project" ? "show" : ""}`}>
          <ProjectComponent />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
