import React from 'react'
import AboutContainer from '../../Components/AboutContainer'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import ItemSlider from '@/app/(provider)/provider/dashboard/Components/ItemSlider'
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import ServiceDiv from '../../Components/ServiceDiv'
import TorranceSlider from '../../Components/TorranceSlider'


const page = () => {
  return (
    <div className='detailpage'>

        <div className="containers-limit">

             <div className="detcol-1">

         <DetailIntro />
       
         <AboutContainer />

         <BusinessInfo />

         <ServiceDiv />

         {/* <ItemSlider /> */}

         
      

        </div>

        <div className="detcol-2">

        </div>

        </div>


        <div className="containers-limit">
            <TorranceSlider />

        </div>


        


       

    
    </div>
  )
}

export default page
