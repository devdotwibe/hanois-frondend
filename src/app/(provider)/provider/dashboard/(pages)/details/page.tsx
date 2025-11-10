"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/config";
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import StatusCard from '@/app/(directory)/Components/StatusCard'
import AboutContainer from '@/app/(directory)/service-provider-directory/Components/AboutContainer'
import ServiceDiv from '@/app/(directory)/service-provider-directory/Components/ServiceDiv'
import TorranceSlider from '@/app/(directory)/service-provider-directory/Components/TorranceSlider'

const Details2 = () => {
  const searchParams = useSearchParams();
  const providerId = searchParams?.get("providerId");

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!providerId) {
      setError("No provider ID provided in URL.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Access token is required. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchProvider = async () => {
      try {
        const res = await fetch(`${API_URL}providers/${providerId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || body?.message || "Failed to fetch provider");
        }

        const data = await res.json();
        setProvider(data.provider || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  if (loading) return <p>Loading provider details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!provider) return <p>No provider data found.</p>;

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
};

export default Details2;




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
