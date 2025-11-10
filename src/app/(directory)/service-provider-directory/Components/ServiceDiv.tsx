// app/(directory)/service-provider-directory/Components/ServiceDiv.jsx
import React from 'react';
import { cookies } from 'next/headers';
import { API_URL } from '@/config';

/**
 * Server component: fetches provider services and renders them.
 * Expects `provider` prop with at least `id`, `phone`, `website`.
 */
const ServiceDiv = async ({ provider }) => {
  const providerId = provider?.id ?? provider?.provider_id ?? null;

  if (!providerId) {
    return (
      <div className="serv-div">
        <h2>Service</h2>
        <p>No provider selected.</p>
      </div>
    );
  }

  // read token cookie (if you set it on login)
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value || null;

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Build URL — adjust if your API_URL already contains a trailing slash
  const url = `${API_URL.replace(/\/+$/,"")}/providers/all-provider-services?providerId=${encodeURIComponent(providerId)}`;

  let services = [];
  let error = null;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      // adjust caching as needed; here we revalidate every 60s
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // try to parse error body
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || body?.message || `Failed to fetch services (${res.status})`);
    }

    const body = await res.json();
    // expectation: { success: true, count: N, data: [...] }
    const rows = Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
    // filter rows that match providerId (endpoint might already filter but double-check)
    services = rows.filter((r) => String(r.provider_id) === String(providerId));
  } catch (err) {
    error = String(err?.message || err);
  }

  return (
    <div className='serv-div'>
      <h2>Service</h2>

      {error ? (
        <div style={{ color: 'red' }}>
          <p>Failed to load services: {error}</p>
        </div>
      ) : services.length === 0 ? (
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
                {svc.created_at && (
                  <small style={{ display: 'block', marginTop: 6, color: '#666' }}>
                    Updated: {new Date(svc.updated_at ?? svc.created_at).toLocaleDateString()}
                  </small>
                )}
                {svc.service_note && (
                  <div style={{ marginTop: 8, color: '#333' }}>
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
          Each project is unique; budgets and costs vary. Contact the provider for a tailored quote.
          {provider?.phone ? ` Call: ${provider.phone}.` : ""}
          {provider?.website ? ` Visit: ${provider.website}.` : ""}
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
