"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/config";

const ServiceDiv = ({ provider }) => {
  const providerId = provider?.id ?? provider?.provider_id ?? null;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!providerId) {
      setError("No provider selected.");
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const url = `${API_URL.replace(/\/+$/, "")}/providers/all-provider-services?providerId=${encodeURIComponent(providerId)}`;

        const res = await fetch(url, { method: "GET", headers });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || body?.message || `Failed to fetch services (${res.status})`);
        }

        const body = await res.json();
        const rows = Array.isArray(body?.data)
          ? body.data
          : Array.isArray(body)
          ? body
          : [];

        setServices(rows.filter((r) => String(r.provider_id) === String(providerId)));
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [providerId]);

  if (loading)
    return (
      <div className="serv-div">
        <h2>Service</h2>
        <p>Loading services...</p>
      </div>
    );

  if (error)
    return (
      <div className="serv-div">
        <h2>Service</h2>
        <p style={{ color: "red" }}>Failed to load services: {error}</p>
      </div>
    );

  return (
    <div className="serv-div">
      <h2>Service</h2>

      {services.length === 0 ? (
        <p>No services listed.</p>
      ) : (
        <div className="build-row">
          {services.map((svc) => (
            <div className="build-col" key={svc.id ?? `${svc.service_id}-${svc.provider_id}`}>
              <div className="build-col1">
                <p>{svc.service_name ?? svc.name ?? "Service"}</p>
              </div>
              <div className="build-col1 build-col2">
                <p>
                  Average Price:&nbsp;
                  {svc.average_cost != null && svc.average_cost !== ""
                    ? `${svc.average_cost} ${svc.currency ?? ""}`
                    : "Contact for price"}
                </p>

                {svc.service_note && (
                  <div style={{ marginTop: 8, color: "#333" }}>
                    <strong>Note:</strong> {svc.service_note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

     <div className="para-serv">
  <p>
    Each project is unique, making budgets and costs vary depending on different factors.
    Call and speak to a team member for more information
    {provider?.phone && ` at ${provider.phone}`}
    {provider?.website && ` or visit our website at ${provider.website}`}.
  </p>
</div>

    </div>
  );
};

export default ServiceDiv;




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
