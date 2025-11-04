import React from 'react';
import Image, { StaticImageData } from 'next/image';

type BusinessCardProps = {
  title1?: string;
  discption?: string;
  imageSrc?: string | StaticImageData;
  spanText?: string;
};

const BusinessCard: React.FC<BusinessCardProps> = ({ title1, imageSrc, discption, spanText }) => {
  return (
    <div className='business-block'>
      <div className="content-top">
        <div className="outer-imgb">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={title1 || 'img'}
              width={80}
              height={80}
            />
          )}
        </div>

        <h3>
          {title1}
          {spanText && <span> {spanText}</span>}
        </h3>
      </div>

      <div className="text-support">
        <p>{discption}</p>
      </div>
    </div>
  );
};

export default BusinessCard;
