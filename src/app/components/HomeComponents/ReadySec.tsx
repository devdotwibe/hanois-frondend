import React from 'react'
import Link from 'next/link'
import BannerCardWrapper from './BannerCardWrapper'
const ReadySec = () => {
  return (
    <div className='readt-sec'>


      <div className="bg-blue1">
        <div className="containers">
           <div className="cards-wrapp">
          <BannerCardWrapper />
        </div>

        </div>
      </div>






        <div className="bg-dark-blue">
        <div className="containers">
          <div className="ready-div">
          <h3>Ready to change the way
            <span>you find services?</span>
          </h3>
          <p>Ask about Yoora products, pricing, implementation, or anything else.
            <span>Our highly trained reps are standing by, ready to help.</span>
            </p>
          <Link href="" className='signup-btn'>Sign Up Now</Link>
          <h6>Full access. No credit card required.</h6>

        </div>

        </div>

        </div>












    </div>
  )
}

export default ReadySec