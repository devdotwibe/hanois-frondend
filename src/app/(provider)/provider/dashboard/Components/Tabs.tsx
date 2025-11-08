"use client";
import React, { useState, useEffect } from "react";
import ProjectComponent from "./ProjectComponent";
import { API_URL } from "@/config";

const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },
];

const MAX_NOTES = 1024;
const DEFAULT_CURRENCY = "KD";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("companyinfo");
  const [categoriesList, setCategoriesList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

  // map of provider_service entries by service_id -> { average_cost, currency, service_note, service_name }
  const [providerServicesMap, setProviderServicesMap] = useState({});

  // selectedServices: array of { id, name, cost, currency, service_note }
  const [selectedServices, setSelectedServices] = useState([]);

  const [formData, setFormData] = useState({
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
    services: [], // array of service ids (strings)
    professionalHeadline: "",
    image: null,
  });

  // Added: errors + status state (shows success/error messages)
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, message: "", success: false });

  // Generic handleChange (keeps support for multiple selects like categories)
  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (options && name !== "services") {
      // for multi-selects (categories), except services which we handle separately
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData((s) => ({ ...s, [name]: values }));
      return;
    }

    if (name === "notes") {
      const trimmed = value.slice(0, MAX_NOTES);
      setFormData((s) => ({ ...s, notes: trimmed }));
      return;
    }

    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Services select change handler (creates/updates service cards)
  const handleServicesSelect = (e) => {
    const values = Array.from(e.target.options)
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);

    setFormData((s) => ({ ...s, services: values }));

    // ensure selectedServices reflects chosen IDs, preserve existing entries where possible
    setSelectedServices((prev) => {
      const ids = values.map(String);
      // Keep existing that are still selected
      const kept = prev.filter((p) => ids.includes(String(p.id)));

      // Add any new ones
      const additions = ids
        .filter((id) => !kept.some((k) => String(k.id) === id))
        .map((id) => {
          const svc = servicesList.find((s) => String(s.id) === String(id));
          // if providerServicesMap has data, use it
          const ps = providerServicesMap[String(id)];
          return {
            id,
            name: svc ? svc.name : (ps?.service_name ?? ""),
            cost: ps?.average_cost != null ? String(ps.average_cost) : "",
            currency: ps?.currency ?? DEFAULT_CURRENCY,
            service_note: ps?.service_note ?? "",
          };
        });

      return [...kept, ...additions];
    });
  };

  const handleServiceFieldChange = (index, key, value) => {
    setSelectedServices((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const removeService = (idToRemove) => {
    setSelectedServices((prev) => prev.filter((s) => String(s.id) !== String(idToRemove)));
    setFormData((prev) => ({ ...prev, services: prev.services.filter((id) => String(id) !== String(idToRemove)) }));
  };

  // Fetch categories & services lists
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          fetch(`${API_URL}categories`),
          fetch(`${API_URL}services`),
        ]);
        const catData = await catRes.json();
        const servData = await servRes.json();
        const cats = Array.isArray(catData) ? catData : catData.data || [];
        const svcs = Array.isArray(servData) ? servData : servData.data || [];
        // normalize ids to strings to avoid type mismatch with form state
        setCategoriesList(cats.map(c => ({ ...c, id: String(c.id) })));
        setServicesList(svcs.map(s => ({ ...s, id: String(s.id) })));
      } catch (err) {
        console.error("Error fetching categories/services:", err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch provider details and provider_services, populate form
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
          } catch (e) { /* ignore */ }
        }
        if (!providerId) return;

        // fetch provider
        const res = await fetch(`${API_URL}providers/${providerId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || data?.message || "Failed to fetch provider");
        const provider = data?.provider ?? data ?? {};

        // Normalize categories/service ids to strings to match options
        const categories = Array.isArray(provider.categories_id)
          ? provider.categories_id.map(String)
          : provider.categories_id ? [String(provider.categories_id)] : [];

        const services = Array.isArray(provider.service_id)
          ? provider.service_id.map(String)
          : provider.service_id ? [String(provider.service_id)] : [];

        setFormData((prev) => ({
          ...prev,
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
        }));

        // fetch provider_services
        try {
          const svcRes = await fetch(`${API_URL}providers/all-provider-services?providerId=${providerId}`);
          const svcJson = await svcRes.json();
          if (svcRes.ok && Array.isArray(svcJson.data)) {
            // build map keyed by service_id (string)
            const map = {};
            svcJson.data.forEach((item) => {
              const sid = String(item.service_id ?? item.serviceId ?? item.id ?? "");
              map[sid] = {
                average_cost: item.average_cost != null ? String(item.average_cost) : "",
                currency: item.currency ?? DEFAULT_CURRENCY,
                service_note: item.service_note ?? "",
                service_name: item.service_name ?? "",
              };
            });
            setProviderServicesMap(map);

            // initialize selectedServices using services list + providerServicesMap
            setSelectedServices((prev) => {
              const prevMap = new Map(prev.map((p) => [String(p.id), p]));
              const result = (services || []).map((sid) => {
                const sidStr = String(sid);
                const ps = map[sidStr];
                const svcMeta = servicesList.find((s) => String(s.id) === sidStr);
                const existing = prevMap.get(sidStr);
                return {
                  id: sidStr,
                  name: svcMeta ? svcMeta.name : (ps?.service_name ?? existing?.name ?? ""),
                  cost: existing?.cost ?? (ps?.average_cost ?? ""),
                  currency: existing?.currency ?? (ps?.currency ?? DEFAULT_CURRENCY),
                  service_note: existing?.service_note ?? (ps?.service_note ?? ""),
                };
              });
              return result;
            });
          }
        } catch (err) {
          console.error("Error fetching provider_services:", err);
        }

      } catch (err) {
        console.error("Error fetching provider:", err);
      }
    };
    fetchProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When servicesList or formData.services or providerServicesMap change, initialize selectedServices (preserve any existing cost/currency if ids match)
  useEffect(() => {
    if (!servicesList || servicesList.length === 0) return;
    if (!formData.services || formData.services.length === 0) {
      setSelectedServices([]);
      return;
    }

    setSelectedServices((prev) => {
      // create map of existing entered values so we preserve cost/currency if possible
      const prevMap = new Map(prev.map((p) => [String(p.id), p]));

      return formData.services.map((id) => {
        const sid = String(id);
        const svcMeta = servicesList.find((s) => String(s.id) === sid);
        const existing = prevMap.get(sid);
        const ps = providerServicesMap[sid];
        return {
          id: sid,
          name: svcMeta ? svcMeta.name : existing?.name ?? ps?.service_name ?? "",
          cost: existing?.cost ?? (ps?.average_cost ?? ""),
          currency: existing?.currency ?? (ps?.currency ?? DEFAULT_CURRENCY),
          service_note: existing?.service_note ?? (ps?.service_note ?? ""),
        };
      });
    });
  }, [servicesList, formData.services, providerServicesMap]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // clear previous messages
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
        // send service ids & details
        service_id: selectedServices.map((s) => s.id),
        service_details: selectedServices.map((s) => ({
          id: s.id,
          name: s.name,
          // include both keys so backend accepts either
          cost: s.cost === "" ? null : s.cost,
          average_cost: s.cost === "" ? null : s.cost,
          currency: s.currency,
          note: s.service_note ?? null,
          service_note: s.service_note ?? null,
        })),
        professional_headline: formData.professionalHeadline,
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

      // replaced alert with status message div
      setStatus({ loading: false, message: "Provider updated successfully!", success: true });

      // optional: clear errors
      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, message: err.message || "Save failed", success: false });
    }
  };

  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    // fixed regex: added the missing closing slash before the $
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
            <button
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content-wrap">
        <div className={`tab-panel ${activeTab === "companyinfo" ? "show" : ""}`}>
          <form className="settingsform" onSubmit={handleSubmit}>

            <div className="form-grp">
              <label>Company/Business Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter title"
                required
              />
            </div>

            <div className="form-grp">
              <label>Company Categories</label>
              <select
                name="categories"
                multiple
                value={formData.categories}
                onChange={handleChange}
              >
                {categoriesList.length > 0 ? (
                  categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading categories...</option>
                )}
              </select>
            </div>

            <div className="form-grp">
              <label>Company Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-grp">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-grp">
              <label>Team Size</label>
              <input
                type="text"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                placeholder="Enter team size"
                required
              />
            </div>

            <div className="form-grp">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter notes"
                required
                maxLength={MAX_NOTES}
                rows={6}
              ></textarea>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#666" }}>Add a short summary that will appear on your profile</div>
                <div style={{ fontSize: 13, color: "#333" }}>{notesRemaining} characters remaining</div>
              </div>
            </div>

            <h4 style={{ fontWeight: 600, marginTop: 24  }}>Online Presence</h4>

            <div className="form-grp">
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Your homepage, company site or blog</div>
            </div>

            <div className="form-grp">
              <label>Facebook</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Enter Facebook URL"
              />
            </div>

            <div className="form-grp">
              <label>Instagram</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Enter Instagram URL"
              />
            </div>

            <div className="form-grp">
              <label>Other</label>
              <input
                type="text"
                name="other"
                value={formData.other}
                onChange={handleChange}
                placeholder="Enter other social media URL"
              />
            </div>

            <h4 style={{ fontWeight: 600,  marginTop: 24  }} >Services</h4>

            <div className="form-grp">
              <label>Select Services</label>
              <select
                name="services"
                multiple
                value={formData.services}
                onChange={handleServicesSelect}
              >
                {servicesList.length > 0 ? (
                  servicesList.map((serv) => (
                    <option key={serv.id} value={serv.id}>
                      {serv.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading services...</option>
                )}
              </select>

              {/* Selected service cards */}
              {selectedServices.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {selectedServices.map((svc, idx) => (
                    <div
                      key={svc.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 160px 90px 36px",
                        gap: 8,
                        alignItems: "center",
                        border: "1px solid #e6e9ee",
                        padding: 12,
                        borderRadius: 6,
                        marginBottom: 10,
                        background: "#fff"
                      }}
                    >
                      {/* service name (pre-filled/readOnly) */}
                      <input
                        type="text"
                        value={svc.name}
                        readOnly
                        style={{ padding: "10px", border: "none", background: "transparent" }}
                      />

                      {/* cost input */}
                      <input
                        type="number"
                        placeholder="Average Cost"
                        value={svc.cost}
                        onChange={(e) => handleServiceFieldChange(idx, "cost", e.target.value)}
                        style={{ padding: "10px", border: "none", background: "transparent" }}
                      />

                      {/* currency select */}
                      <select
                        value={svc.currency}
                        onChange={(e) => handleServiceFieldChange(idx, "currency", e.target.value)}
                        style={{ padding: "8px" }}
                      >
                        <option value="KD">KD</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>

                      {/* remove button */}
                      <button
                        type="button"
                        onClick={() => removeService(svc.id)}
                        aria-label="Remove service"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: "none",
                          background: "#f0f2f5",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                      >
                        ×
                      </button>

                      {/* service note spans full width under the row (use gridColumn to span) */}
                      <input
                        type="text"
                        value={svc.service_note ?? ""}
                        placeholder="Service note (optional)"
                        onChange={(e) => handleServiceFieldChange(idx, "service_note", e.target.value)}
                        style={{
                          gridColumn: "1 / -1",
                          marginTop: 8,
                          padding: "8px 10px",
                          border: "1px solid #e6e9ee",
                          borderRadius: 6,
                          background: "#fafafa"
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-grp">
              <label>Service Note</label>
              <input
                type="text"
                name="servicenote"
                placeholder="Enter Service Note"
              />
            </div>

            <div style={{ textAlign: "right", marginTop: "32px" }}>
              <button
                type="submit"
                disabled={status.loading}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 85px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: status.loading ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s ease",
                  opacity: status.loading ? 0.8 : 1,
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#0069d9")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
              >
                {status.loading ? "Saving..." : "Save"}
              </button>
            </div>

            {/* status message (success / error) */}
            {status.message && (
              <div className="login-success contact-sucess" style={{ marginBottom: 12 }}>
                <p style={{ color: status.success ? "green" : "red", margin: 0 }}>{status.message}</p>
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
