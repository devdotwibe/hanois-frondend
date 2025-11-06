

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
                <form className="settingsform" >
                    <div className="form-grp">
                    <label> Company/Business Name</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                    </div>

                    <div className="form-grp">
                    <label> Company Categories</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                    </div>

                    <div className="form-grp">
                    <label> Company Phone Number</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                    </div>





                    <div className="form-grp">
                    <label> Location</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                    </div>




                   <div className="form-grp">
                    <label> Team Size</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                    </div>




                  <div className="form-grp">
                    <label> Notes</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                  </div>
                <h4>Online Presence</h4>

                  <div className="form-grp">
                    <label> Website</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                  </div>


                    <div className="form-grp">
                    <label> Facebook</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                  </div>



                    <div className="form-grp">
                    <label> Instagram</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                  </div>



                    <div className="form-grp">
                    <label> Other</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                  </div>


                <h4>Services</h4>

                    <div className="form-grp">
                    <label> Select services</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required
                    />
                  </div>

                        <button type="submit" className="btn get-sub" >
save
                        </button>

                    {/* {message && (
                    <p
                        className={`message ${
                        message.includes("✅")
                            ? "success"
                            : message.includes("⚠️")
                            ? "warning"
                            : "error"
                        }`}
                    >
                        {message}
                    </p>
                    )} */}
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
