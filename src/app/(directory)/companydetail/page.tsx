import React from 'react'
import AboutContainer from '../../(directory)/provider/directory/Components/AboutContainer'
import DetailIntro from '@/app/(directory)/provider/Components/DetailIntro'
import ItemSlider from '@/app/(provider)/provider/dashboard/Components/ItemSlider'
import BusinessInfo from '@/app/(directory)/provider/Components/BusinessInfo'
import ServiceDiv from '../../(directory)/provider/directory/Components/ServiceDiv'
import TorranceSlider from '../../(directory)/provider/directory/Components/TorranceSlider'
import StatusCard from '@/app/(directory)/provider/Components/StatusCard'

const page = () => {
  return (
    <div className='detailpage'>

        <div className="containers-limit detcol">

          <div className="detcol-1">

         <DetailIntro />
       
         <AboutContainer />

         <BusinessInfo />

         <ServiceDiv />


        </div>

        <div className="detcol-2 after-edit">
          <StatusCard />
        </div>



        </div>



        <div className="containers-limit">
            <TorranceSlider />

        </div>


    
    </div>
  )
}

export default page
