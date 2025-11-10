// app/provider/dashboard/details/page.jsx
import React from "react";
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import StatusCard from '@/app/(directory)/Components/StatusCard'
import AboutContainer from '@/app/(directory)/service-provider-directory/Components/AboutContainer'
import ServiceDiv from '@/app/(directory)/service-provider-directory/Components/ServiceDiv'
import TorranceSlider from '@/app/(directory)/service-provider-directory/Components/TorranceSlider'
import { cookies } from 'next/headers';
import { API_URL } from "@/config";

export const dynamic = 'force-dynamic'; // optional: or 'auto' - choose based on how dynamic providers are

export default async function DetailsPage({ searchParams }) {
  const providerId = searchParams?.providerId;

  if (!providerId) {
    return <div style={{ color: "red" }}>No providerId provided in URL.</div>;
  }

  // Read token cookie (server-side). Name must match how you set it client-side.
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || null;

  // Build headers
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Server fetch with caching. Use `next: { revalidate: 60 }` to cache for 60s.
  // If you want to cache indefinitely until invalidated, you can use 'force-cache' or omit revalidate.
  let provider = null;
  try {
    const res = await fetch(`${API_URL}providers/${encodeURIComponent(providerId)}`, {
      method: "GET",
      headers,
      // next caching options:
      next: { revalidate: 60 }, // 60s cache; change as needed
      // If you want to bypass cache use: next: { cache: 'no-store' }
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body?.error || body?.message || `Failed to fetch provider (${res.status})`;
      return <div style={{ color: "red" }}>{message}</div>;
    }

    const data = await res.json();
    provider = data?.provider ?? data ?? null;
    if (!provider) {
      return <div>No provider data found.</div>;
    }
  } catch (err) {
    return <div style={{ color: "red" }}>Error loading provider: {String(err)}</div>;
  }

  return (
    <div className="detcoldetail">
      <div className='detcol'>
        <div className="detcol-1">
          <DetailIntro provider={provider} />
          <AboutContainer provider={provider} />
          <BusinessInfo provider={provider} />
          <ServiceDiv provider={provider} />
        </div>

        <div className="detcol-2">
          <StatusCard provider={provider} />
        </div>
      </div>

      <div className="">
        <TorranceSlider provider={provider} />
      </div>
    </div>
  );
}




// import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
// import DetailIntro from '@/app/(directory)/Components/DetailIntro'
// import StatusCard from '@/app/(directory)/Components/StatusCard'
// import AboutContainer from '@/app/(directory)/service-provider-directory/Components/AboutContainer'
// import ServiceDiv from '@/app/(directory)/service-provider-directory/Components/ServiceDiv'
// import TorranceSlider from '@/app/(directory)/service-provider-directory/Components/TorranceSlider'
// import React from 'react'

// const Details2 = () => {
//   return (

//     <div className="detcoldetail">
//           <div className='detcol'>


//         <div className="detcol-1">
//             <DetailIntro />


//         <AboutContainer />


//         <BusinessInfo />

//         <ServiceDiv />

//         </div>

//         <div className="detcol-2">
//             <StatusCard />

//         </div>





//     </div>




//              <div className="">
//             <TorranceSlider />

//         </div>

//     </div>


  
//   )
// }

// export default Details2
