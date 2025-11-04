"use client";
import React, { useState } from "react";

const TABS = [
  { id: "myproject", label: "My Project" },
  { id: "myaccount", label: "My Account" },
 
];

const Tabs = () => {
  // Default active tab = first one
  const [activeTab, setActiveTab] = useState("myproject");

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
      <div className="tab-content-wrap serv-seeker">

        
        
        <div className={`tab-panel ${activeTab === "myproject" ? "show" : ""}`}>
            <div className="seeker-tab-content">

                <div className="seeker-div">

                    <div className="seeker-div">
                         <div className="seeker-col1">

                            <div className="proj-text">
                                <h2>My Project</h2>
                     <p>Here is the list of your projects, you can follow all updates of them</p>

                            </div>
                    

                    <button className="new-proj">Add New Project</button>

                   </div>


                    </div>

                   

                </div>
                
                
            </div>

            
       
      
        </div>

        <div
          className={`tab-panel ${
            activeTab === "myaccount" ? "show" : ""
          }`}
        >
          <h2>My Account</h2>

          
       
        </div>

      
      </div>
    </div>
  );
};

export default Tabs;
