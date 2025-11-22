// import React from 'react'

// const TabMain = () => {
//   return (
//     <div>TabMain</div>
//   )
// }

// export default TabMain

"use client";
import React, { useState } from "react";
import Image from "next/image";
import imgupload from "../../../../public/images/upload.svg"

const TABS = [
  { id: "leads", label: "Leads" },
  { id: "companyprofile", label: "Company Profile" },

];

const TabMain = () => {
  // Default active tab = first one
  const [activeTab, setActiveTab] = useState("leads");

  return (
    <div className="tab-wrapper7">
      {/* Sidebar Navigation */}
      <ul className="tab-nav4">
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
      <div className="tab-content-wrap2">



        <div className={`tab-panel ${activeTab === "leads" ? "show" : ""}`}>
          <h2>Create new post</h2>

         <form>
          <div className="form-grp">
            <label>Post Content</label>
            <textarea></textarea>
          </div>





<div className="upload-box e-upload" >

  <div className="cover-upload" >

    <div className="img-cover-up" >

      <Image
      src={imgupload}
      alt="img"
      width={40}
      height={40}
      />

      </div>

      <h3>Upload an image</h3>
      <p>Browse files to upload</p>
      <span>JPEG, PNG</span></div>


  </div>

















          <div className="publish-div">

            <button className="publish">Publish Post</button>
            <button className="clear-btn">Clear</button>

          </div>

         </form>



        </div>

        <div
          className={`tab-panel ${
            activeTab === "companyprofile" ? "show" : ""
          }`}
        >

        </div>




      </div>
    </div>
  );
};

export default TabMain;