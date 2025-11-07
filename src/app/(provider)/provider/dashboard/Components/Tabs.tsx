"use client";

import React, { useState, useEffect } from "react";
import ProjectComponent from "./ProjectComponent";
import { API_URL } from "@/config"; // import your API_URL

const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("companyinfo");
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

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://hanois.dotwibe.com/api/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.categories); // Assuming the response has a `categories` array
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Data has loaded, stop loading
      }
    };
    fetchCategories();
  }, []);

  // Fetch services from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("https://hanois.dotwibe.com/api/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data.services); // Assuming the response has a `services` array
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Data has loaded, stop loading
      }
    };
    fetchServices();
  }, []);

  // Handle input change for both text and multi-select
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

  // Fetch existing provider details on mount
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const providerId = localStorage.getItem("providerId");
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}providers/${providerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Handle form submit to update provider
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const providerId = localStorage.getItem("providerId");
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to perform this action.");
        return;
      }
      const res = await fetch(`${API_URL}providers/${providerId}`, {
        method: "PUT",
        headers: {
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

  // Show loading spinner until categories and services are fetched
  if (loading) {
    return <div>Loading...</div>;
  }

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

            {/* Categories Dropdown */}
            <div className="form-grp">
              <label>Company Categories</label>
              <select
                name="categories"
                multiple
                value={formData.categories}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rest of the form... */}

            <button type="submit" className="btn get-sub">
              Save
            </button>
          </form>
        </div>

        {/* Project Tab */}
        <div className={`tab-panel ${activeTab === "project" ? "show" : ""}`}>
          <ProjectComponent />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
