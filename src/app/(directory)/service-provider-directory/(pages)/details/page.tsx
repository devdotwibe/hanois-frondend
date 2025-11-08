import React from 'react'
import AboutContainer from '../../Components/AboutContainer'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import ItemSlider from '@/app/(provider)/provider/dashboard/Components/ItemSlider'
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import ServiceDiv from '../../Components/ServiceDiv'
import TorranceSlider from '../../Components/TorranceSlider'


const page = () => {
  return (
    <div className='detailpage'>

        <div className="containers-limit detcol">

             <div className="detcol-1">

         <DetailIntro />
       
         <AboutContainer />

         <BusinessInfo />

         <ServiceDiv />

         {/* <ItemSlider /> */}

         
      

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

        </div>

        </div>


        <div className="containers-limit">
            <TorranceSlider />

        </div>


        


       

    
    </div>
  )
}

export default page
