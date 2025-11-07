import React from 'react'
import Image from 'next/image'

import img1 from "../../../../../../public/images/property-img.jpg"
import img2 from "../../../../../../public/images/left-arrow.svg"


const Page = () => {
  return (
    <div>
        <div className="containers-limit detcol profile-page">
          

            <div className="detcol-1">

              <button className="back-bth">
                            <Image
  src={img2}
  alt="img"
  width={40}
  height={40}
  className="project-img"
/>
           
            </button>

              <div className="prov-pro-img">
                <Image
  src={img1}
  alt="img"
  width={200}
  height={400}
  className="project-img"
/>
              </div>





              <div className="project-details">
      <h2 className="project-title">Kitchen Redesign</h2>
      <p className="project-type">Project Type</p>

      <h3 className="about-title">About</h3>
      <p className="about-text">
        American Home Improvement, Inc. – it is our mission to provide the
        highest quality of service in all aspects of our business. We are
        extremely thorough in the services that we provide and aim to be very
        receptive to any client’s issues, questions or concerns and handle them
        promptly and professionally.
      </p>
      <p className="about-text">
        We take the necessary steps to ensure that our clients are completely
        satisfied with all of our contractual and assumed responsibilities.
        Above all else, we will fulfill these responsibilities with honesty,
        integrity, and fairness in all our dealings.
      </p>

      <div className="project-image">
     
      </div>
    </div>

                  <div className="prov-pro-img">
                <Image
  src={img1}
  alt="img"
  width={200}
  height={400}
  className="project-img"
/>
              </div>


                            <div className="prov-pro-img">
                <Image
  src={img1}
  alt="img"
  width={700}
  height={500}
  className="project-img"
/>
              </div>


            </div>


            <div className="detcol-2">
              <div className="status-card">
                <div className="project-card">
      <h2 className="card-title">Status</h2>
      <p className="company-name">American House Improvements Inc.</p>

      <label className="project-label" htmlFor="project">
        Select Project
      </label>

      <div className="select-wrapper">
        <select id="project" className="project-select">
          <option>Building a house from the scratch</option>
          <option>Renovating old property</option>
          <option>Commercial construction</option>
        </select>
        <span className="arrow">▼</span>
      </div>

      <button className="send-btn">Send</button>

      <button className="add-btn">Add New Project</button>
    </div>

            </div>









            <div className="scope-section">
      <h3 className="scope-title">Scope</h3>

      <div className="scope-list">
        <div className="scope-item">Architecture and Interior Design</div>
        <div className="scope-item">Landscape Design</div>
        <div className="scope-item">Building Engineering</div>
      </div>
    </div>



            </div>

        </div>
      
    </div>
  )
}

export default Page
