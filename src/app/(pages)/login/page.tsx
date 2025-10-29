"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import loginimg from "../../../../public/images/login-sidebar.png";

import appleimg from "../../../../public/images/apple.svg";
import googleimg from "../../../../public/images/google.svg";
import backarrow from "../../../../public/images/left-arrow.svg";
import headerlogo from "../../../../public/images/logo.png";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { BASE_API_URL } from '@/config'; 


const Login = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const res = await fetch(`${BASE_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
      } else {
        console.log("Login Success:", data);
        localStorage.setItem("token", data.token);
        router.push("/"); 
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

 
  const handleClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };



  return (
    <div className="loginpage">


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

          {/* --------------------------------------------------------------- */}

          <div className="login-container">


            <h2 className="">Log In to Handis</h2>

            <form className="login-form" onSubmit={(e) => handleLogin(e, router)}>
                <div className="form-grp">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Email" required />
              </div>

              <div className="form-grp">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="+8 characters"
                  required
                />
              </div>

              <Link href="" className="forget-pass">
                Forget password?
              </Link>

            <button type="submit" className="login-btn">Log in</button>
            </form>

            <p className="signup-text">
              Don't have an account? <Link href="#">Sign up</Link>
            </p>

            <p className="register-text">
              I want to <Link href="#">register as a company</Link>
            </p>

            <div className="divider">
              <div className="line1"></div>
              <div>
                <h6>Or sign up social Media</h6>
              </div>
            </div>

            <button className="apple-btn">
              <span className="app-img">
                <Image
                  src={appleimg}
                  alt="apple"
                  width={20}
                  height={20}
                  className=""
                />
              </span>
              Log In with Apple
            </button>

            <button className="google-btn">
              <span className="g-img">
                <Image
                  src={googleimg}
                  alt="google"
                  width={20}
                  height={20}
                  className=""
                />
              </span>
              Log In with Google
            </button>

            <p className="terms">
              By signing up, signing in or continuing, I agree to the Handis
              Terms of Use and acknowledge the Handis Privacy Policy.
            </p>
          </div>

          {/* -------forgotpassword----------------------------------------------------------- */}

          <div className="login-container forgot-pass hidden">

             <h2 className="">Forgot Password</h2>

             <p>Enter the email address you used when you joined and we’ll send you instructions to reset your password.</p>

             <p>For security reasons, we do NOT store your password. So rest assured that we will never send your password via email.</p>

               <form className="login-form">
              <div className="form-grp">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Email" required />
              </div>

              

              <button type="submit" className="login-btn" onClick={handleClick}>
                Send rest instruction
              </button>


            </form>

            
          </div>


          {showPopup &&
          createPortal(
          
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="">Follow email link</h2>
            <p className="">
              You need to follow the link to restart your password
            </p>


            <button
              onClick={closePopup}
              className="thank-btn"
            >
              OK, Thanks
            </button>


          </div>
        </div>
        ,
        document.body
      )}

      
 



          {/* -------reset password-------- */}

          <div className="login-container reset-pass hidden">

             <h2 className="">Reset Password</h2>

             
               <form className="login-form">


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
                Reset Password
              </button>


            </form>

            
          </div>






        </div>
      </div>


    </div>
  );
};

export default Login;
