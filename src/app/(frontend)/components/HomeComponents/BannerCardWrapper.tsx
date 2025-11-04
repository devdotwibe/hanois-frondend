import React from 'react';
import BannerCards from '../ReusableComponents/Cards/BannerCards';
import image1 from "../../../../../public/images/interior.png"
const BannerCardWrapper = () => {

  const BannerCardsData = [
    {

      title1: 'Interior Designers ',
      imageSrc: image1,
    },
    {
      title1: 'Architects',
      imageSrc: image1,
    },
    {
      title1: ' Building Contractors',
      imageSrc: image1,
    }
  ];

  return (
    <div className='blue-card'>

        {BannerCardsData.map((item, index) => (

          <BannerCards
            key={index}
            title1={item.title1}
            imageSrc={item.imageSrc}
          />

        ))}



      </div>
  );
};

export default BannerCardWrapper;