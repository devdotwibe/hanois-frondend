import React from 'react'
import HouseCard from './HouseCard'
import logo1 from "../../../../../../public/images/ahi-logo.jpg"; 

const HouseOuter = () => {
  return (
    <div>

        <HouseCard 
        logo={logo1}   
        name="American House Improvements Inc."
        description="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
      />

     
      
    </div>
  )
}

export default HouseOuter
