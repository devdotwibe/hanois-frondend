import React from "react";
import Intro from "../Components/Intro";
import RepeatHouseDiv from "../Components/RepeatHouseDiv";
import DirectorySidebar from "../Components/DirectorySidebar";

const API_URL = "https://hanois.dotwibe.com/api/api/providers";

// ✅ Server Component – fetch directly (no useEffect, no client loading state)
const getProviders = async () => {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json?.data?.providers || [];
  } catch (err) {
    console.error("Failed to fetch providers:", err);
    return [];
  }
};

const ServiceProviderDirectory = async () => {
  const providers = await getProviders();

  return (
    <div className="spd-outer">
      <div className="sidebar-div1">
        <DirectorySidebar />

        <div className="spd-outer1">
          <Intro total={providers.length} />

          {providers.length === 0 && (
            <p style={{ padding: "1rem" }}>No providers found.</p>
          )}

          {providers.map((provider) => (
            <RepeatHouseDiv key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDirectory;


// import React from 'react'
// import Intro from '../Components/Intro'
// import RepeatHouseDiv from '../Components/RepeatHouseDiv'
// import DirectorySidebar from '../Components/DirectorySidebar'




// const ServiceProviderDirectory = () => {
//   return (
//     <div className='spd-outer'>




//       <div className="sidebar-div1">
//         <DirectorySidebar />

//          <div className="spd-outer1">
//         <Intro />
//         <RepeatHouseDiv />
//         <RepeatHouseDiv />

//        </div>

//       </div>


      
//     </div>
//   )
// }

// export default ServiceProviderDirectory
