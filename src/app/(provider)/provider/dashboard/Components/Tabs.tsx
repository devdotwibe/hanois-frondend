"use client";
import React, { useState, useEffect } from "react";
import ProjectComponent from "./ProjectComponent";
import { API_URL } from "@/config";

const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },
];

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
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (options) {
      // handle multiple select
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

        if (!catRes.ok) throw new Error(catData.error || "Failed to fetch categories");
        if (!servRes.ok) throw new Error(servData.error || "Failed to fetch services");

        setCategoriesList(catData.categories || []);
        setServicesList(servData.services || []);
      } catch (err) {
        console.error("Error fetching categories/services:", err);
      }
    };

    fetchOptions();
  }, []);

  // Fetch existing provider details
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const providerId = localStorage.getItem("providerId");
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}providers/${providerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch provider");

        const provider = data.provider;

        setFormData({
          companyName: provider.name || "",
          categories: provider.categories_id || [],
          phoneNumber: provider.phone || "",
          location: provider.location || "",
          teamSize: provider.team_size ? provider.team_size.toString() : "",
          notes: provider.notes || "",
          website: provider.website || "",
          facebook: provider.facebook || "",
          instagram: provider.instagram || "",
          other: provider.other_link || "",
          services: provider.service_id || [],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProvider();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const providerId = localStorage.getItem("providerId");
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to perform this action.");
        return;
      }

      const payload = {
        name: formData.companyName,
        phone: formData.phoneNumber,
        location: formData.location,
        team_size: parseInt(formData.teamSize),
        notes: formData.notes,
        website: formData.website,
        facebook: formData.facebook,
        instagram: formData.instagram,
        other_link: formData.other,
        categories_id: formData.categories,
        service_id: formData.services,
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
      alert(err.message);
    }
  };

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

            {/* Dynamic Categories */}
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
              ></textarea>
            </div>

            <br />
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

            <br />
            <h4>Services</h4>

            {/* Dynamic Services */}
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
