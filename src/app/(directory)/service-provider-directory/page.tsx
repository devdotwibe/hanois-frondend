import React from 'react'
import Intro from '../Components/Intro'
import RepeatHouseDiv from '../Components/RepeatHouseDiv'
import DirectorySidebar from '../Components/DirectorySidebar'




const ServiceProviderDirectory = () => {
  return (
    <div className='spd-outer'>




      <div className="sidebar-div1">
        <DirectorySidebar />

         <div className="spd-outer1">
        <Intro />
        <RepeatHouseDiv />
        <RepeatHouseDiv />

       </div>

      </div>



      
        



        

        


     
      
    </div>
  )
}

export default ServiceProviderDirectory
