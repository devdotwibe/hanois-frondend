import React from 'react'
import Image from 'next/image';
import backarrow from "../../../../public/images/left-arrow.svg";
import headerlogo from "../../../../public/images/logo.png";
import loginimg from "../../../../public/images/login-sidebar.png";



const SignUp = () => {
  return (
    <div className='signuppage'>

         <div className="">
      <div className="login-divider">
        {/* Left Column */}
        <div className="logincol1">
          <div className="bg-cover">
            <Image
              src={loginimg}
              alt="Login background"
              width={100}
              height={100}
              className="login-img"
            />
           
          </div>

          <div className="logo-div">
            <Image
              src={headerlogo}
              alt="Login background"
              width={100}
              height={100}
              className="login-img"
            />
           
          </div>
        </div>

        {/* Right Column */}
        <div className="logincol2">
          <button className="back-bth">
              <Image
              src={backarrow}
              alt="arrow"
              width={140}
              height={40}
              className=""
            />
            
          </button>

          <div className="login-container">
            <h2 className="">Sign up to Handis</h2>

            <form className="login-form">

                <div className="formcol2">
  <div className="form-grp">
    <label htmlFor="firstName">First Name</label>
    <input
      type="text"
      id="firstName"
      placeholder="First Name"
      required
    />
  </div>

  <div className="form-grp">
    <label htmlFor="lastName">Last Name</label>
    <input
      type="text"
      id="lastName"
      placeholder="Last Name"
      required
    />
  </div>
</div>


             




              <div className="form-grp">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Email" required />
              </div>

              <div className="form-grp">
                <label htmlFor="number">Mobile Number</label>
                <input type="email" id="email" placeholder="+1 (000) 000 0000" required />
              </div>










              <div className="form-grp">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="+8 characters"
                  required
                />
                <span>Use 8 or more characters, with a mix of letters, numbers and synbols</span>
              </div>


              
              <div className="form-grp">
                <label htmlFor="conformpassword">Conform a Password</label>
                <input
                  type="password"
                  id="conformpassword"
                  placeholder="Confirm a password"
                  required
                />
              </div>







             
              <button type="submit" className="login-btn">
               Sign up
              </button>



            </form>

            
            

            

            <p className="terms">
              By signing up, signing in or continuing, I agree to the Handis
              Terms of Use and acknowledge the Handis Privacy Policy.
            </p>
          </div>
        </div>
      </div>
         </div>

        
      
    </div>
  )
}

export default SignUp
