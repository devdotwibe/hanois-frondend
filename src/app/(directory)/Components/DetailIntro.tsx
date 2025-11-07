import React from 'react'
import DetailCard from '@/app/(directory)/Components/DetailCard'
import logo1 from "../../../../public/images/ahi-logo.jpg"; 



const DetailIntro = () => {
  return (
      <div className="detail-page-intro">
        <div className="">
             <DetailCard 
         logo={logo1}   
        name="American House Improvements Inc."
        description="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
        />

        </div>


       

        </div>

  )
}

export default DetailIntro
