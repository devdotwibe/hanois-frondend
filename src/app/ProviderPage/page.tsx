import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from "../../../public/images/logo.png"
import profile from "../../../public/images/profile.png"
import TabMain from './Components/TabMain'


const page = () => {
  return (
    <div className='provider-main'>

      <div className="main-h">
          <div className="containers header-provider">
        <div className="logo">
          <div className="header-logo4">
                <Link href="/">
                  <Image src={logo} alt="logo" width={100} height={19} />
                </Link>
              </div>

        </div>

    <div className="user-info22">

      <div className="user-info11">
        <Link href="/">
                  <Image src={profile} alt="logo" width={50} height={50} />
         </Link>

      </div>
      <div className="user-info2">
        <p className="user-name"> Mitchell</p>
      <span className="user-role">Modern Residential</span>

      </div>
          {/* <span className="logout-icon">↗</span> */}


    </div>



    </div>

      </div>




    <div className="containers stats-section">

  <div className="stat-card">
    <div>
      <p className="stat-title">Total Posts</p>
      <h3 className="stat-value">2</h3>
    </div>
    <div className="stat-icon bg-blue">

    </div>
  </div>

  <div className="stat-card">
    <div>
      <p className="stat-title">Total Likes</p>
      <h3 className="stat-value">423</h3>
    </div>
    <div className="stat-icon bg-pink">

    </div>
  </div>

  <div className="stat-card">
    <div>
      <p className="stat-title">Total Views</p>
      <h3 className="stat-value">2500</h3>
    </div>
    <div className="stat-icon bg-green">

    </div>
  </div>

  <div className="stat-card">
    <div>
      <p className="stat-title">Followers</p>
      <h3 className="stat-value">1247</h3>
    </div>
    <div className="stat-icon bg-purple">

    </div>
  </div>

</div>



<div className="tab-sec8 containers">
  <TabMain />
</div>















    </div>
  )
}

export default page