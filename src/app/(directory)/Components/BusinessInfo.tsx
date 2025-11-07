import React from 'react'

const BusinessInfo = () => {
  return (
    <div>


    <div className="businesscontainer">
        
        
        <div className="content">
            <h2>Business Information</h2>
            
            <div className="info-grid">

                <div className="info1">

                    <div className="info-item">
                    <span className="info-label">Business Name</span>
                    <div className="info-value">American House Improvements Inc.</div>
                </div>
                
                <div className="info-item">
                    <span className="info-label">Location</span>
                    <div className="info-value">Woodland Hills, Los Angeles 91364 United States</div>
                </div>
                
                <div className="info-item">
                    <span className="info-label">Team Size</span>
                    <div className="info-value">40 employees</div>
                </div>

                </div>


                <div className="info1 info2">

                     <div className="info-item">
                    <span className="info-label">Website</span>
                    <div className="info-value">
                        <a href="https://ahlbuilders.com/" className="contact-button">Visit Our Website</a>
                    </div>
                </div>
                
                <div className="info-item">
                    <span className="info-label">Company Phone Number</span>
                    <div className="info-value">+1 (866) 919-2416</div>
                    <a href="tel:+18669192416" className="contact-button">Call Now</a>
                </div>
                
                <div className="info-item">
                    <span className="info-label">Social Media</span>
                    <div className="social-links">
                       
                        
                    </div>
                </div>

                </div>
                
                
               


            </div>
        </div>
        
       
    </div>
      
    </div>
  )
}

export default BusinessInfo
