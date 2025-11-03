import React from 'react'
import BuildCard from './BuildCard'
import buildimg1 from "../../../../../public/images/get-listed-1.png"
import buildimg2 from "../../../../../public/images/get-listed-2.png"
const HelpSec = () => {
  return (
    <div className='h-outer'>

      <div className="h-div">
        <div className="h-div1">

          <div className="containers">
                     <BuildCard
  imageSrc={buildimg1}
  title1="Here's how Handis can help you!"
  disc="Build more meaningful and lasting relationships — better understand their needs, identify new opportunities to help, address any problems faster."
  linkText="Get Listed"
  linkUrl="/"
/>

          </div>

        </div>
        <div className="h-div1">

          <div className="containers">
                     <BuildCard
  imageSrc={buildimg2}
  title1="Here's how Handis can help you!"
  disc="Build more meaningful and lasting relationships — better understand their needs, identify new opportunities to help, address any problems faster."
  linkText="Get Listed"
  linkUrl="/"
/>

          </div>

        </div>
      </div>


    </div>
  )
}

export default HelpSec