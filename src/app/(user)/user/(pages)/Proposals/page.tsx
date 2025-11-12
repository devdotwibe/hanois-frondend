import React from 'react'
import Image from 'next/image'
import arrow from "../../../../../../public/images/left-arrow.svg"
import Link from 'next/link'
import ProposalCard from '../../Componrnts/ProposalCard'



const page = () => {
  return (
    <div className='proposal-page'>

        <div className="det-intro1">
      
             <button>
              <Image 
              src={arrow}
              alt="img"
              width={40}
              height={40}
              />
      
             </button>
      
             <h2>Complete home remodeling</h2>
      
        </div>

        
      <ul className="tab-nav1">

        <li><Link href="/Proposals" className="tab-btn">proposals</Link></li>
        <li><Link href="/project-details" className="tab-btn active">Project Details</Link></li>


      </ul>



      <ProposalCard />
      
      
    </div>
  )
}

export default page
