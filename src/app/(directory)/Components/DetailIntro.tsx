import React from 'react';
import DetailCard from '@/app/(directory)/Components/DetailCard';
import defaultLogo from "../../../../public/images/ahi-logo.jpg"; 

const DetailIntro = ({ provider }) => {
  const name = provider?.name || "Unknown Provider";
  const description = provider?.notes || provider?.service_notes || provider?.professional_headline || "";

  // resolve logo: provider.image may be a path or URL. If it's null, use defaultLogo
  const logo = provider?.image ? provider.image : defaultLogo;

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
