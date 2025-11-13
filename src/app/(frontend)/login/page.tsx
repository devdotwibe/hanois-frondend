"use client";
import React from "react";
import Image from "next/image";
import { useState ,useEffect} from "react";
import loginimg from "../../../../public/images/login-sidebar.png";

import appleimg from "../../../../public/images/apple.svg";
import googleimg from "../../../../public/images/google.svg";
import backarrow from "../../../../public/images/left-arrow.svg";
import headerlogo from "../../../../public/images/logo2.png";

import { createPortal } from "react-dom";
import { useRouter,useSearchParams } from "next/navigation";

import Link from "next/link";
import { API_URL } from '@/config'; 
import "../signup/signup.css";


const Login = () => {

  const router = useRouter();

  const searchParams = useSearchParams();

   const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  const [showPopup, setShowPopup] = useState(false);

    const [mode, setMode] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [loginError, setLoginError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  useEffect(() => {
    const token = searchParams.get("reset-password");
    if (token) {
      setMode("reset");
      setResetToken(token);
    } else {
      setMode("login");
    }
  }, [searchParams]);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();

     setLoginError(""); 
    
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const email = formData.get("email")?.toString() || "";
      const password = formData.get("password")?.toString() || "";

    try {
        const res = await fetch(`${API_URL}users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {

         setLoginError(data.error || "Login failed");

      } else {

          localStorage.setItem("token", data.data.token);

          localStorage.setItem("auth", data.data.role);

          localStorage.setItem("user", JSON.stringify(data.data));
          
          document.cookie = `token=${encodeURIComponent(data.data.token)}; path=/; max-age=${60 * 60 * 24 * 7};`;
          
          document.cookie = `auth=${encodeURIComponent(data.data.role)}; path=/; max-age=${60 * 60 * 24 * 7};`;
          
          if (data.data.redirectUrl) {

              router.push(data.data.redirectUrl);

            } else if (data.data.role === "provider") {

              router.push("/provider/dashboard");

            } else {
              
              router.push("/user/dashboard");
          }

      }
    } catch (err) {
      console.error("Login Error:", err);
      setLoginError("Something went wrong. Please try again.");
    }
  };

 
  const handleClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, and include letters, numbers, and symbols."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}providers/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ token: resetToken, password }),

      });

      const data = await res.json();
      if (res.ok) {

        setSuccess("Password successfully reset!");

        setTimeout(() => {

          router.push('/login');
          
        }, 5000);

      } else {

        alert(data.error || "Password reset failed.");
      }
    } catch (err) {

      console.error("Reset Password Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };



  return (
    <div className={`loginpage ${lang === "ar" ? "rtl" : ""}`}>


      <div className="login-divider">
        {/* Left Column */}
        <div className="logincol1">
          <div className="bg-cover">
            <Image
              src={loginimg}
              alt="Login background"
              width={980}
              height={1578}
              className="login-img"
            />
          </div>

          <div className="logo-div"    onClick={() => router.push("/")} >
            <Link href="/">
             <Image
              src={headerlogo}
              alt="Login background"
              width={100}
              height={18}
              className="login-img"
            />
            </Link>
           
          </div>
        </div>

        {/* Right Column */}
        <div className="logincol2">

          <button className="back-bth test"  onClick={() => router.push("/")}>
              <Image
                src={backarrow}
                alt="arrow"
                width={140}
                height={40}
                className=""
              />
          </button>

          {/* --------------------------------------------------------------- */}

      {mode === "login" && (

          <div className="login-container">


            <h2 className="">{lang === "ar" ? "تسجيل الدخول إلى Handis" : "Log In to Handis"}</h2>

              <form className="login-form" onSubmit={(e) => handleLogin(e, router)}>
                  <div className="form-grp">
                  <label htmlFor="email">Email</label>
                  <input type="email" className={`input-field ${loginError ? 'email-invalid' : ''}`} id="email" name="email" placeholder="Email" required />
                </div>

                <div className="form-grp">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="+8 characters"
                    required
                    className={`input-field ${loginError ? 'email-invalid' : ''}`}
                  />
                </div>

                {loginError && <p style={{ color: 'red', marginTop: '10px' }} className="error-message">{loginError}</p>}

                <Link href="" className="forget-pass">
                  Forget password?
                </Link>

              <button type="submit" className="login-btn">Log in</button>

            </form>

            <p className="signup-text">
              Don't have an account? <Link href="/signup">Sign up</Link>
            </p>

            <p className="register-text">
              I want to <Link href="/serviceprovider/signup">register as a company</Link>
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
             By signing up, signing in or continuing, I agree to the Handis Terms of Use and acknowledge the Handis Privacy Policy. I agree that Handis may use my email address for marketing purposes. I can opt out at any time through my settings.
            </p>
          </div>
      )}

          {/* -------forgotpassword----------------------------------------------------------- */}

      {mode === "forgot" && (

          <div className="login-container forgot-pass">

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
      )}


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

        {mode === "reset" && (

            <div className="login-container reset-pass" >

              <h2 className="">Reset Password</h2>

              
                <form className="login-form" onSubmit={handleResetPassword} >

                      <div className="form-grp">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          name="password"   
                          id="password"
                          placeholder="+8 characters"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className={`input-field ${error && error!='Passwords do not match.' ? 'email-invalid' : ''}`}
                        />
                        <span>Use 8 or more characters, with a mix of letters, numbers and synbols</span>
                      </div>


                      <div className="form-grp">
                        <label htmlFor="conformpassword">Conform a Password</label>
                        <input
                          type="password"
                          id="conformpassword"
                          name="confirmPassword"  
                          placeholder="Confirm a password"
                          required
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`input-field ${error =='Passwords do not match.' ? 'email-invalid' : ''}`}
                        />
                      </div>

                      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

                      {success && 
                          createPortal(
                          <div className='login-success'> 
                          <p>{success}</p>  </div>
                                  ,
                                document.body
                          )
                        }

              
                <button type="submit" className="login-btn">
                  Reset Password
                </button>


              </form>

              
            </div>
        )}






        </div>
      </div>


    </div>
  );
};

export default Login;
