import React from 'react'

import BusinessCard from '../ReusableComponents/Cards/BusinessCard';
import image1 from "../../../../../public/images/lead.png"
import image2 from "../../../../../public/images/grow.png"
import image3 from "../../../../../public/images/support.png"
 const BusinesCardData = [
    {
      title1: 'Lead customers to your business',
      discption: 'Handis Support helps you provide personalized support when and where customers need it, so customers stay happy.',
      imageSrc: image1,
    },
    {
      title1: 'Grow without growing pains',
      discption: 'Handis is powerful enough to handle the most complex business, yet flexible enough to scale with you as you grow.',
      imageSrc: image2,
    },
    {
      title1: 'Support on every',
      spanText: 'Step',
      discption: 'Productive agents are happy agents. Give them all the support tools and information they need to best serve your customers.',
      imageSrc: image3,

    }
  ];
const ListCards = () => {
  return (
    <div className='ch-col'>
      <div className="containers">

        <div className="business-div21">

          {BusinesCardData.map((item, index) => (
          <BusinessCard
            key={index}
            title1={item.title1}
            spanText={item.spanText}
            discption={item.discption}
            imageSrc={item.imageSrc}
          />
        ))}

        </div>


      </div>


    </div>
  )
}

export default ListCards