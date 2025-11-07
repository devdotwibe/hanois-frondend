import React from 'react';
import Image, { StaticImageData } from 'next/image';

type BannerCardsProps = {
  title1?: string;
  imageSrc?: string | StaticImageData;
};

const BannerCards: React.FC<BannerCardsProps> = ({ title1, imageSrc }) => {
  return (
    <div className='b-card'>

      <div className="b-text">
        <h4>{title1}</h4>
      </div>

      <div className="b-img">
        {imageSrc && (
        <img
          src={imageSrc}
          alt={title1 || 'img'}
          width={273}
          height={242}
          quality={100}   
          priority 
        />
      )}

      </div>








    </div>
  );
};

export default BannerCards;