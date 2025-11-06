import React from 'react'
import Intro from '../Components/Intro'
import ImageSlider from '../Components/ImageSlider'
import HouseCard from '@/app/(provider)/provider/dashboard/Components/HouseCard'
import logo1 from "../../../../public/images/ahi-logo.jpg"; 



const ServiceProviderDirectory = () => {
  return (
    <div className='spd-outer'>

        <Intro />

        <div className="house-div">

            <HouseCard 
        logo={logo1}   
        name="American House Improvements Inc."
        description="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
      />

      <button className='detail-btn'>Details</button>

        </div>


      

     



        <ImageSlider />
        <ImageSlider />
      
    </div>
  )
}

export default ServiceProviderDirectory
