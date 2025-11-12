import React from 'react'
import Image from 'next/image'
import profile from "../../../../../public/images/profile.png"

const MyAccountForm = () => {
  return (
    <div className='my-account-form'>
        <div className="proj-text">
            <h2>My Account</h2>
        </div>

         <div className="profile-container">
      <div className="profile-up">
        <Image
          src={profile}
          alt="Profile"
          width={100}
          height={100}
          className="profile-avatar"
        />
        <button className="upload-btn">Upload new picture</button>
      </div>



      <form className="profile-form">
        <div className="form-grp">
              <label>Name</label>
              <input type="text" defaultValue="Fadi Amer" />
            
        </div>


        <div className="form-grp">
            <label>Email</label>
            <input type="email" defaultValue="FadiAmer@uxperts.studio" disabled />
        </div>


        <div className="form-grp">
           <label>Mobile phone</label>
           <input type="tel" defaultValue="+1 (866) 919-2416" />
        </div>


      


      

     

        <div className="profile-actions">


          <button type="button" className="change-btn">
            Change Password
          </button>
          <button type="submit" className="save-btn1 save-account">
            Save
          </button>


        </div>




      </form>


    </div>













      
    </div>
  )
}

export default MyAccountForm
