import React from 'react'
import AboutContainer from '../../Components/AboutContainer'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import ItemSlider from '@/app/(provider)/provider/dashboard/Components/ItemSlider'
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import ServiceDiv from '../../Components/ServiceDiv'
import TorranceSlider from '../../Components/TorranceSlider'
import StatusCard from '@/app/(directory)/Components/StatusCard'


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
