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
                    <div className="info-value">Woodland Hills, Los Angeles 91364 
                        <span>United States</span>
                        </div>
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
                        <a href="https://ahlbuilders.com/" className="contact-button">https://ahlbuilders.com/</a>
                    </div>
                </div>
                
                <div className="info-item">
                    <span className="info-label">
                       Social Medias

                    </span>
                    <div className="info-value">
                         <a href="">instagram</a>
                        <a href="" className="">facebook</a>



                    </div>
                </div>
                
                <div className="info-item">
                    <span className="info-label">Company Phone number</span>

                   <div className="info-value">
                         <a href="">+1 (866) 919-2416</a>
                        



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
