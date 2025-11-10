import React from 'react'

const ServiceDiv = ({ provider }) => {
  // provider.service_details expected as array of { service_id | id, name, average_cost | cost, currency, service_note }
  const details = provider?.service_details || provider?.services || [];

  // Normalise array of services to objects
  const services = Array.isArray(details) ? details.map(s => {
    // handle different shapes
    return {
      id: s.id ?? s.service_id ?? s.serviceId,
      name: s.name ?? s.service_name ?? "Service",
      price: s.average_cost ?? s.cost ?? s.price ?? null,
      currency: s.currency ?? "KD",
      note: s.service_note ?? s.note ?? null
    };
  }) : [];

  return (
    <div className='serv-div'>
      <h2>Service</h2>

      {services.length === 0 ? (
        <p>No services listed.</p>
      ) : (
        <div className="build-row">
          {services.map((svc, idx) => (
            <div className="build-col" key={svc.id ?? idx}>
              <div className="build-col1">
                <p>{svc.name}</p>
              </div>
              <div className="build-col1 build-col2">
                <p>Average Price: {svc.price != null ? `${svc.price} ${svc.currency || ""}` : "Contact for price"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="para-serv">
        <p>
          Each project is unique; budgets and costs vary. Contact the provider for a tailored quote.
          {provider?.phone ? ` Call: ${provider.phone}.` : ""}
          {provider?.website ? ` Visit: ${provider.website}.` : ""}
        </p>
      </div>
    </div>
  )
}

export default ServiceDiv



// import React from 'react'

// const ServiceDiv = () => {
//   return (
//     <div className='serv-div'>

//         <h2>Service</h2>


//         <div className="build-row"> 

//             <div className="build-col">

//                 <div className="build-col1">
//                     <p>Architecture and Interior Design</p>
//                 </div>
//                 <div className="build-col1 build-col2">
//                     <p>Average Price: $1200</p>
//                 </div>

//             </div>


//             <div className="build-col">

//                 <div className="build-col1">
//                     <p>Landscape Design</p>
//                 </div>
//                 <div className="build-col1 build-col2">
//                     <p>Average Price: $1200</p>
//                 </div>

//             </div>



//             <div className="build-col">

//                 <div className="build-col1">
//                     <p>Building Engineering</p>
//                 </div>
//                 <div className="build-col1 build-col2">
//                     <p>Average Price: $1200</p>
//                 </div>

//             </div>


//         </div>


//         <div className="para-serv">
//             <p>Each project is unique, making budget and costs vary depending on different factors. Call and speak to a team member for more information at 800-774-0420, or visit us on our website at ahibuilders.com</p>
//         </div>



      
//     </div>
//   )
// }

// export default ServiceDiv
