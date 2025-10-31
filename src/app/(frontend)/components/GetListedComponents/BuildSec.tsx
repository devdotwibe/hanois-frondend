import React from 'react'
import Image from 'next/image'
import build3 from "../../../../../public/images/get-listed-3.png"
const BuildSec = () => {
  return (
    <div className='build-outer'>
      <div className="containers">
        <div className="build1">
          <h4>Here's how Handis can help you!</h4>
          <p>Build more meaningful and lasting relationships — better understand
          their needs, identify new opportunities to help, address any problems
          faster.</p>

        </div>

      </div>
      <div className="buildimg-outer">
            <Image
            src={build3}
            alt='img'
            width={400}
            height={300}
            />

          </div>
    </div>
  )
}

export default BuildSec