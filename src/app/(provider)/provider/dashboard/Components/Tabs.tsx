"use client";
import React, { useState, useEffect } from "react";
import ProjectComponent from "./ProjectComponent";
import { API_URL } from "@/config";

const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },
];

const MAX_NOTES = 1024;

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("companyinfo");
  const [categoriesList, setCategoriesList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

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
    services: [],
    professionalHeadline: "",
    image: null,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (options) {
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData((s) => ({ ...s, [name]: values }));
      return;
    }

    // Enforce max length for notes and show decreasing counter
    if (name === "notes") {
      const trimmed = value.slice(0, MAX_NOTES);
      setFormData((s) => ({ ...s, notes: trimmed }));
      return;
    }

    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Fetch categories & services
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          fetch(`${API_URL}categories`),
          fetch(`${API_URL}services`),
        ]);

        const catData = await catRes.json();
        const servData = await servRes.json();

        setCategoriesList(Array.isArray(catData) ? catData : catData.data || []);
        setServicesList(Array.isArray(servData) ? servData : servData.data || []);
      } catch (err) {
        console.error("Error fetching categories/services:", err);
      }
    };

    fetchOptions();
  }, []);

  // Fetch provider details and populate form
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
          } catch (e) {}
        }

        if (!providerId) return;

        const res = await fetch(`${API_URL}providers/${providerId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || data?.message || "Failed to fetch provider");

        const provider = data?.provider ?? data ?? {};

        setFormData({
          companyName: provider.name ?? "",
          categories: Array.isArray(provider.categories_id)
            ? provider.categories_id
            : provider.categories_id
            ? [provider.categories_id]
            : [],
          phoneNumber: provider.phone ?? "",
          location: provider.location ?? "",
          teamSize:
            typeof provider.team_size === "number"
              ? String(provider.team_size)
              : provider.team_size ?? "",
          notes: provider.notes ?? "",
          website: provider.website ?? provider.web ?? "",
          facebook: provider.facebook ?? "",
          instagram: provider.instagram ?? "",
          other: provider.other_link ?? provider.other ?? "",
          services: Array.isArray(provider.service_id)
            ? provider.service_id
            : provider.service_id
            ? [provider.service_id]
            : [],
          professionalHeadline: provider.professional_headline ?? "",
          image: provider.image ?? null,
        });
      } catch (err) {
        console.error("Error fetching provider:", err);
      }
    };

    fetchProvider();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert("You must be logged in to perform this action.");
        return;
      }

      if (!providerId) {
        alert("No provider id found.");
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
        service_id: formData.services,
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
      if (!res.ok) throw new Error(data.error || "Update failed");

      alert("Provider updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Save failed");
    }
  };

  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    let base = API_URL.replace(/\/+$, "");
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <label style={{ fontWeight: 600 }}>Brief description for your profile</label>
                  <div style={{ fontSize: 12, color: '#666' }}>Add a short summary that will appear on your profile</div>
                </div>
                <div style={{ fontSize: 13, color: '#333' }}>{notesRemaining} characters remaining</div>
              </div>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter notes"
                required
                maxLength={MAX_NOTES}
                rows={6}
              ></textarea>
            </div>

            <h4>Online Presence</h4>

            <div className="form-grp">
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
              />
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

            <h4>Services</h4>

            <div className="form-grp">
              <label>Select Services</label>
              <select
                name="services"
                multiple
                value={formData.services}
                onChange={handleChange}
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
            </div>

            <button type="submit" className="btn get-sub">
              Save
            </button>
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
