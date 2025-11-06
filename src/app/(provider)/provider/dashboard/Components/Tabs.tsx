"use client";
import React, { useState } from "react";
import ProjectComponent from "./ProjectComponent";

const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },
];

const Tabs = () => {
  // Default active tab = first one
  const [activeTab, setActiveTab] = useState("companyinfo");

  // State to track selected categories and services
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  // Handle change for multi-select dropdown
  const handleCategoriesChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedCategories(selectedOptions);
  };

  const handleServicesChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedServices(selectedOptions);
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

        {/* Company Information Tab */}
        <div className={`tab-panel ${activeTab === "companyinfo" ? "show" : ""}`}>
          <form className="settingsform">
            <div className="form-grp">
              <label>Company/Business Name</label>
              <input type="text" name="companyName" placeholder="Enter title" required />
            </div>

            {/* Categories Dropdown (Multiple Select) */}
            <div className="form-grp">
              <label>Company Categories</label>
              <select
                name="categories"
                multiple
                required
                value={selectedCategories}
                onChange={handleCategoriesChange}
                style={{ width: "100%", height: "100px" }} // Ensure dropdown looks proper
              >
                <option value="tech">Tech</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>

            <div className="form-grp">
              <label>Company Phone Number</label>
              <input type="text" name="phoneNumber" placeholder="Enter phone number" required />
            </div>

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

            <h4>Services</h4>

            {/* Services Dropdown (Multiple Select) */}
            <div className="form-grp">
              <label>Select Services</label>
              <select
                name="services"
                multiple
                required
                value={selectedServices}
                onChange={handleServicesChange}
                style={{ width: "100%", height: "100px" }} // Ensure dropdown looks proper
              >
                <option value="webDevelopment">Web Development</option>
                <option value="appDevelopment">App Development</option>
                <option value="seo">SEO</option>
                <option value="marketing">Marketing</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>

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
