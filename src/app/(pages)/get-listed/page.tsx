import BuildSec from '@/app/components/GetListedComponents/BuildSec'
import ChoosePlan from '@/app/components/GetListedComponents/ChoosePlan'
import GetListedBanner from '@/app/components/GetListedComponents/GetListedBanner'
import HelpSec from '@/app/components/GetListedComponents/HelpSec'
import HowHelp from '@/app/components/GetListedComponents/HowHelp'
import ListCards from '@/app/components/GetListedComponents/ListCards'
import FaqSec from '@/app/components/HomeComponents/FaqSec'
import React from 'react'

const page = () => {
  return (
    <div className='get-listedpage'>

      <GetListedBanner />

      <ChoosePlan />

      <ListCards />

      <HowHelp />

      <HelpSec />

      <BuildSec />



      <FaqSec />





    </div>
  )
}

export default page