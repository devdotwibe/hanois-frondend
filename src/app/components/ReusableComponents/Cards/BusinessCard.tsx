import React from 'react';
import Image, { StaticImageData } from 'next/image';

type BusinessCardProps = {
  title1?: string;
  discption?: string;
  imageSrc?: string | StaticImageData;
};

const BusinessCard: React.FC<BusinessCardProps> = ({ title1, imageSrc,discption }) => {
  return (
    <div className='business-block'>

      <div className="content-top">
        <div className="outer-imgb">
         {imageSrc && (
        <Image
          src={imageSrc}
          alt={title1 || 'img'}
          width={60}
          height={60}
        />
      )}

      </div>

        <h3>{title1}</h3>

 

      </div>






      <div className="text-support">
        <p>{discption}</p>
      </div>







    </div>
  );
};

export default BusinessCard;