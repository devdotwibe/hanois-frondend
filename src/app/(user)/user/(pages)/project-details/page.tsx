import React from 'react'
import BudjectCalculator from '../../Componrnts/BudjectCalculator'
import DetailsIntro from '../../Componrnts/DetailsIntro'
import EditCard from '@/app/(provider)/provider/dashboard/Components/EditCard'

const page = () => {
  return (
    <div className='project-details'>

      <div className="proj-det1">
          <DetailsIntro />



        <BudjectCalculator />
        
      </div>
      <div className="proj-det2">

        <EditCard />



      </div>


    




                 














      
    </div>
  )
}

export default page
