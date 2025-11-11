import React from 'react'

const BusinessInfo = ({ provider }) => {
  const country = provider?.country || "";
  const teamSize = provider?.team_size ? `${provider.team_size} employees` : "N/A";
  const location = provider?.location || "N/A";
  const website = provider?.website || provider?.web || provider?.social_media || "";
  const phone = provider?.phone || "";

  const socialLinks = [];
  if (provider?.instagram) socialLinks.push({ label: "Instagram", url: provider.instagram });
  if (provider?.facebook) socialLinks.push({ label: "Facebook", url: provider.facebook });
  if (provider?.other_link) socialLinks.push({ label: "Other", url: provider.other_link });

  return (
    <div>
      <div className="businesscontainer">
        <div className="content">
          <h2>Business Information</h2>

          <div className="info-grid">
            <div className="info1">
              <div className="info-item">

                <div className='info-label'>
                   <span className="">Business Name</span>
                </div>
               
                <div className="info-value">{provider?.name || "Unknown Provider"}</div>
              </div>

              <div className="info-item">
                 <div className='info-label'>
                <span className="">Location</span>
                </div>


                <div className="info-value">
                  {location}
                  {country ? <span>{country}</span> : null}
                </div>
              </div>

              <div className="info-item">
                 <div className='info-label'>
                <span className="">Team Size</span>
                </div>




                <div className="info-value">{teamSize}</div>
              </div>
            </div>

            <div className="info1 info2">
              <div className="info-item">

                 <div className='info-label'>
                <span className="">Website</span>
                </div>



                <div className="info-value">
                  {website ? (
                    <a href={website.startsWith("http") ? website : `http://${website}`} className="contact-button" target="_blank" rel="noreferrer">
                      {website}
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </div>

              <div className="info-item">

                 <div className='info-label'>
                <span className="">Social Medias</span>
                </div>


                <div className="info-value">
                  {socialLinks.length > 0 ? socialLinks.map((s, i) => (
                    <a key={i} href={s.url.startsWith("http") ? s.url : `http://${s.url}`} target="_blank" rel="noreferrer" style={{ marginRight: 8 }}>
                      {s.label}
                    </a>
                  )) : <span>N/A</span>}
                </div>
              </div>

              <div className="info-item">
                   <div className='info-label'>
                <span className="">Company Phone number</span>
                </div>


                <div className="info-value">
                  {phone ? <a href={`tel:${phone}`}>{phone}</a> : <span>N/A</span>}
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



// import React from 'react'

// const BusinessInfo = () => {
//   return (
//     <div>


//     <div className="businesscontainer">
        
         
//         <div className="content">
//             <h2>Business Information</h2>
            
//             <div className="info-grid">

//                 <div className="info1">

//                     <div className="info-item">
//                     <span className="info-label">Business Name</span>
//                     <div className="info-value">American House Improvements Inc.</div>
//                 </div>
                
//                 <div className="info-item">
//                     <span className="info-label">Location</span>
//                     <div className="info-value">Woodland Hills, Los Angeles 91364 
//                         <span>United States</span>
//                         </div>
//                 </div>
                
//                 <div className="info-item">
//                     <span className="info-label">Team Size</span>
//                     <div className="info-value">40 employees</div>
//                 </div>

//                 </div>


//                 <div className="info1 info2">

//                      <div className="info-item">
//                     <span className="info-label">Website</span>
//                     <div className="info-value">
//                         <a href="https://ahlbuilders.com/" className="contact-button">https://ahlbuilders.com/</a>
//                     </div>
//                 </div>
                
//                 <div className="info-item">
//                     <span className="info-label">
//                        Social Medias

//                     </span>
//                     <div className="info-value">
//                          <a href="">instagram</a>
//                         <a href="" className="">facebook</a>



//                     </div>
//                 </div>
                
//                 <div className="info-item">
//                     <span className="info-label">Company Phone number</span>

//                    <div className="info-value">
//                          <a href="">+1 (866) 919-2416</a>
                        



//                     </div>
//                 </div>

//                 </div>
                
                
               


//             </div>
//         </div>
        
       
//     </div>
      
//     </div>
//   )
// }

// export default BusinessInfo
