import React from 'react';
import DetailCard from '@/app/(directory)/provider/Components/DetailCard';
import defaultLogo from "../../../../../public/images/ahi-logo.jpg"; 
import { IMG_URL } from "@/config";

const DetailIntro = ({ provider }) => {
  const name = provider?.name || "Unknown Provider"; 
  const description =
    provider?.professional_headline ||
    "";

  let logo = defaultLogo;
  if (provider?.image) {
    if (/^https?:\/\//i.test(provider.image)) {
      logo = provider.image;
    } else {
      const cleanBase = IMG_URL.replace(/\/+$/, ""); 
      const cleanPath = provider.image.replace(/^\/+/, "");
      logo = `${cleanBase}/${cleanPath}`;
    }
  }

  return (
    <div className="detail-page-intro">
      <div className="">
        <DetailCard
          logo={logo}
          name={name}
          description={description}
        />
      </div>
    </div>
  );
};

export default DetailIntro;


// import React from 'react'
// import DetailCard from '@/app/(directory)/Components/DetailCard'
// import logo1 from "../../../../public/images/ahi-logo.jpg"; 



// const DetailIntro = () => {
//   return (
//       <div className="detail-page-intro">
//         <div className="">
//              <DetailCard 
//          logo={logo1}   
//         name="American House Improvements Inc."
//         description="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
//         />

//         </div>


       

//         </div>

//   )
// }

// export default DetailIntro
