"use client";
import React, { useState } from "react";

const TABS = [
  { id: "leads", label: "Leads" },
  { id: "companyprofile", label: "Company Profile" },
  { id: "payment", label: "Payment and Billing" },
  { id: "publicprojects", label: "Public Projects" },
];

const Tabs = () => {
  // Default active tab = first one
  const [activeTab, setActiveTab] = useState("leads");

  return (
    <div className="tab-wrapper">
      {/* Sidebar Navigation */}
      <ul className="tab-nav">
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

        <div className="intro-tab">
            <h3>Provider Dashboard</h3>
        <p>Here is the list of your leads, you can check lead’s projects and contact with them</p>


        </div>

        
        <div className={`tab-panel ${activeTab === "leads" ? "show" : ""}`}>
          <h2>Leads</h2>
      
        </div>

        <div
          className={`tab-panel ${
            activeTab === "companyprofile" ? "show" : ""
          }`}
        >
          <h2>Company Profile</h2>
       
        </div>

        <div className={`tab-panel ${activeTab === "payment" ? "show" : ""}`}>
          <h2>Payment and Billing</h2>
        </div>

        <div
          className={`tab-panel ${activeTab === "publicprojects" ? "show" : ""}`}
        >
          <h2>Public Projects</h2>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
