

"use client";
import React, { useState } from "react";

const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },

];

const Tabs = () => {
  // Default active tab = first one
  const [activeTab, setActiveTab] = useState("companyinfo");

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
          <h2>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, voluptatum!</h2>
      
        </div>

        <div
          className={`tab-panel ${
            activeTab === "project" ? "show" : ""
          }`}
        >
          <h2>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, voluptatum!</h2>
       
        </div>

        



      </div>
    </div>
  );
};

export default Tabs;
