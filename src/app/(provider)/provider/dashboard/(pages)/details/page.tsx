import React from "react";
import BusinessInfo from '@/app/(directory)/provider/Components/BusinessInfo'
import DetailIntro from '@/app/(directory)/provider/Components/DetailIntro'
import StatusCard from '@/app/(directory)/provider/Components/StatusCard'
import AboutContainer from '@/app/(directory)/provider/directory/Components/AboutContainer'
import ServiceDiv from '@/app/(directory)/provider/directory/Components/ServiceDiv'
import TorranceSlider from '@/app/(directory)/provider/directory/Components/TorranceSlider'
import { cookies } from 'next/headers';
import { API_URL } from "@/config";

export const dynamic = 'force-dynamic'; 

export default async function DetailsPage({ searchParams }) {
  const providerId = searchParams?.providerId;

  if (!providerId) {
    return <div style={{ color: "red" }}>No providerId provided in URL.</div>;
  }

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || null;

  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let provider = null;
  try {
    const res = await fetch(`${API_URL}providers/${encodeURIComponent(providerId)}`, {
      method: "GET",
      headers,
      next: { revalidate: 60 }, 
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
          <StatusCard />
        </div>
      </div>

      <div className="">
        <TorranceSlider  />
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
