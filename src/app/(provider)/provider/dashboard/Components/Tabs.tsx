

"use client";
import React, { useState, useEffect } from "react";
import ProjectComponent from "./ProjectComponent";
const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },

];

const Tabs = () => {
  // Default active tab = first one
  const [activeTab, setActiveTab] = useState("companyinfo");

  // Inside Tabs component
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
  services: []
});

// Handle input change
const handleChange = (e) => {
  const { name, value, options } =             <select name="categories" multiple value={formData.categories} onChange={handleChange}>
              <option value="1">Tech</option>
              <option value="2">Finance</option>
              ...
            </select>
e.target;

  if (options) {
    // handle multiple select
    const values = Array.from(options).filter(opt => opt.selected).map(opt => opt.value);
    setFormData({ ...formData, [name]: values });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

// Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const providerId = "YOUR_PROVIDER_ID"; // dynamically from logged in user
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
      categories_id: formData.categories, // array
      service_id: formData.services // array
    };

    const token = localStorage.getItem("token"); // or wherever you store JWT

    const res = await fetch(`https://your-api.com/providers/${providerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Update failed");

    alert("Provider updated successfully!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

useEffect(() => {
  const fetchProvider = async () => {
    try {
      const providerId = localStorage.getItem("providerId"); // or from JWT
      const token = localStorage.getItem("token");
      const res = await fetch(`https://your-api.com/providers/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch provider");

      const provider = data.provider;

      setFormData({
        companyName: provider.name || "",
        categories: provider.categories_id || [],
        phoneNumber: provider.phone || "",
        location: provider.location || "",
        teamSize: provider.team_size || "",
        notes: provider.notes || "",
        website: provider.website || "",
        facebook: provider.facebook || "",
        instagram: provider.instagram || "",
        other: provider.other_link || "",
        services: provider.service_id || []
      });
    } catch (err) {
      console.error(err);
    }
  };

  fetchProvider();
}, []);
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
/>            </div>

            {/* Categories Dropdown (Multiple Select) */}
            <div className="form-grp">
              <label>Company Categories</label>
            <select name="categories" multiple value={formData.categories} onChange={handleChange}>
              <option value="1">Tech</option>
              <option value="2">Finance</option>
              ...
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
/>            </div>

            <div className="form-grp">
              <label>Location</label>
              <input type="text" name="location" placeholder="Enter location" required />
            </div>

            <div className="form-grp">
              <label>Team Size</label>
              <input type="text" name="teamSize" placeholder="Enter team size" required />
            </div>

            {/* Notes (Textarea) */}
            <div className="form-grp">
              <label>Notes</label>
              <textarea name="notes" placeholder="Enter notes" required></textarea>
            </div>


<br /><br />
            <h4>Online Presence</h4>

            <div className="form-grp">
              <label>Website</label>
              <input type="text" name="website" placeholder="Enter website URL" required />
            </div>

            <div className="form-grp">
              <label>Facebook</label>
              <input type="text" name="facebook" placeholder="Enter Facebook URL" required />
            </div>

            <div className="form-grp">
              <label>Instagram</label>
              <input type="text" name="instagram" placeholder="Enter Instagram URL" required />
            </div>

            <div className="form-grp">
              <label>Other</label>
              <input type="text" name="other" placeholder="Enter other social media URL" required />
            </div>
<br /><br />
            <h4>Services</h4>

            {/* Services Dropdown (Multiple Select) */}
            <div className="form-grp">
              <label>Select Services</label>
  <select name="services" multiple value={formData.services} onChange={handleChange}>
    <option value="1">Web Development</option>
    ...
  </select>
            </div>

            <button type="submit" className="btn get-sub">
              Save
            </button>
          </form>
        </div>

        <div
          className={`tab-panel ${
            activeTab === "project" ? "show" : ""
          }`}
        >
          <ProjectComponent />
       
        </div>

        



      </div>
    </div>
  );
};

export default Tabs;
