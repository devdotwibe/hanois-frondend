import BuildSec from '@/app/(frontend)/components/GetListedComponents/BuildSec'
import ChoosePlan from '@/app/(frontend)/components/GetListedComponents/ChoosePlan'
import GetListedBanner from '@/app/(frontend)/components/GetListedComponents/GetListedBanner'
import HelpSec from '@/app/(frontend)/components/GetListedComponents/HelpSec'
import HowHelp from '@/app/(frontend)/components/GetListedComponents/HowHelp'
import ListCards from '@/app/(frontend)/components/GetListedComponents/ListCards'
import FaqSec from '@/app/(frontend)/components/HomeComponents/FaqSec'
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



      {/* <FaqSec /> */}





    </div>
  )
}

export default page