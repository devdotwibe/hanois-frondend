import React from 'react'

const ChangePass = () => {
  return (
    <div className='my-account-form change-pass'>
        <div className="proj-text">
            <h2><span>My Account</span>
                 / Change Password</h2>
        </div>

         <div className="profile-container">

      <form className="profile-form">
        <div className="form-grp">
              <label>Current Password</label>
              <input type="text"  placeholder="Fadi Amer"/>

        </div>


        <div className="form-grp">
            <label>New Password</label>
            <input type="email" placeholder="+8 characters" />
            <small>Use 8 or more characters, with a mix of letters, <span>numbers and symbols</span></small>



        </div>


        <div className="form-grp">
           <label>Confirm New Password</label>
           <input type="tel" placeholder="Confirm New Password" />
        </div>









        <div className="profile-actions">


          <button type="button" className="change-btn">
            Forgot Password
          </button>


           <button type="submit" className="save-btn1 dark-btn save-account">
            Save
          </button>


        </div>




      </form>


    </div>














    </div>
  )
}

export default ChangePass
