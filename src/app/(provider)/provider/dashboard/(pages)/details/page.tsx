import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import StatusCard from '@/app/(directory)/Components/StatusCard'
import AboutContainer from '@/app/(directory)/service-provider-directory/Components/AboutContainer'
import ServiceDiv from '@/app/(directory)/service-provider-directory/Components/ServiceDiv'
import TorranceSlider from '@/app/(directory)/service-provider-directory/Components/TorranceSlider'
import React from 'react'

const Details2 = () => {
  return (

    <div className="detcoldetail">
          <div className='detcol'>


        <div className="detcol-1">
            <DetailIntro />


        <AboutContainer />


        <BusinessInfo />

        <ServiceDiv />

        </div>

        <div className="detcol-2">
            <StatusCard />

        </div>





    </div>




             <div className="">
            <TorranceSlider />

        </div>

    </div>


  
  )
}

export default Details2
