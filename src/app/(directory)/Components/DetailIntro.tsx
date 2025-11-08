import React from 'react';
import DetailCard from '@/app/(directory)/Components/DetailCard';

const DetailIntro = ({ provider }) => {
  return (
    <div className="detail-page-intro">
      <DetailCard
        logo={provider.image}
        name={provider.name}
        description={provider.service}
      />
    </div>
  );
};

export default DetailIntro;
