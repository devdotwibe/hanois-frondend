import React from 'react'
import Image from 'next/image'
import arrow from "../../../../../public/images/left-arrow.svg"
import Link from 'next/link'

const DetailsIntro = () => {

  return (
    <div className='details-intro'>

      <div className="det-intro1">

       <button>
        <Image 
        src={arrow}
        alt="img"
        width={40}
        height={40}
        />

       </button>

       <h2>Complete home remodeling</h2>

      </div>


      <ul className="tab-nav1">

        <li><Link href="/Proposals" className="tab-btn">proposals</Link></li>
        <li><Link href="/project-details" className="tab-btn active">Project Details</Link></li>

      </ul>


      <div className="details-card">
        <h3 className="project-title">Kitchen Redesign</h3>
        <p className="project-status">Public</p>

        <h4 className="section-title">Brief</h4>
        <p className="brief-text">
          American Home Improvement, Inc. - it is our mission to provide the
          highest quality of service in all aspects of our business. We are
          extremely thorough in the services that we provide and aim to be very
          receptive to any client’s issues, questions or concerns and handle them
          promptly and professionally. We take the necessary steps to ensure that
          our clients are completely satisfied with all of our contractual and
          assumed responsibilities. Above all else, we will fulfill these
          responsibilities.
        </p>

        <div className="project-meta">
          <div className='proj-meta1'>
            <div className="proj-metacol">
               <strong>Type</strong>

            </div>


            Housing
          </div>
          <div className='proj-meta1'>
            <div className="proj-metacol">
              <strong>Location</strong>
              
            </div>
             New York
          </div>
          <div className='proj-meta1'>
            <div className="proj-metacol">
               <strong>Land size</strong>
              
            </div>
            56 m²
          </div>


          <div className='proj-meta1'>
            <div className="proj-metacol">
                <strong>Luxury level</strong>
              
            </div>
           Basic
          </div>


          <div className='proj-meta1'>
            <div className="proj-metacol">
                   <strong>Services</strong> 
              
            </div>
       Construction services
          </div>


          <div className='proj-meta1'>
            <div className="proj-metacol">
                 <strong>Basement</strong> 
              
            </div>
         Yes
          </div>


        </div>
      </div>



























      
    </div>
  )
}

export default DetailsIntro
