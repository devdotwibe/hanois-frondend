"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter,useSearchParams } from 'next/navigation';
import backarrow from "../../../../public/images/left-arrow.svg";
import headerlogo from "../../../../public/images/logo2.png";
import loginimg from "../../../../public/images/login-sidebar.png";
import eyeicon from "../../../../public/images/eyeicon.svg";
import eyeiconhide from "../../../../public/images/eyeiconhide.svg";



import { API_URL } from '@/config';
import "./signup.css";
import { createPortal } from "react-dom";
import Link from 'next/link';


const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    password: '',
    confirmPassword: ''
  });

  const searchParams = useSearchParams();

  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalMessage, setGeneralMessage] = useState('');

  const [successMessage, setsuccessMessage] = useState('');

  const [emailClass, setEmailClass] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));

    if (id === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value === "") {
        setEmailClass(""); // empty input
      } else if (emailRegex.test(value)) {
        setEmailClass("email-valid");
      } else {
        setEmailClass("email-invalid");
      }
    }

    setGeneralMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match!" });
      return;
    }

    try {
        const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {

        setsuccessMessage('Registration successful!');

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          number: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => {
          router.push('/login');
        }, 5000);

      } else {

        const fieldErrors: { [key: string]: string } = {};
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            fieldErrors[err.field] = err.message;
          });
        }
        setErrors(fieldErrors);

        if (data.error) {
          setGeneralMessage(data.error);
        }

      }
    } catch (err) {
      console.error('Error:', err);

      setGeneralMessage('Server error');

    }
  };

  return (
    <div className="signuppage">
      <div className="login-divider">
        {/* Left Column */}
        <div className="logincol1">
          <div className="bg-cover">
            <Image src={loginimg} alt="Login background" width={980}
              height={1578} className="login-img" />
          </div>

          <div className="logo-div for-desk" onClick={() => router.push("/")} >

            <Link href="/">
            <Image src={headerlogo} alt="Logo" width={100} height={18} className="login-img" />
            </Link>



          </div>

        </div>

        {/* Right Column */}
        <div className="logincol2">

          <div className="logo-div for-mob"    onClick={() => router.push("/")} >
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




          <button className="back-bth" onClick={() => router.push("/")}>
            <Image src={backarrow} alt="arrow" width={140} height={40} />
          </button>

          <div className="login-container">
            <h2> {lang === "ar" ? "تسجيل الدخول إلى Handis" : "Sign up to Handis"}</h2>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="formcol2">
                <div className="form-grp">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                    {errors.firstName && <span className="error" style={{ color: 'red', marginTop: '10px' }}>{errors.firstName}</span>}
                </div>

                <div className="form-grp">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                    {errors.lastName && <span className="error" style={{ color: 'red', marginTop: '10px' }}>{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-grp">

                <label htmlFor="email">Email</label>

                <input type="text" id="email" className={`input-field ${generalMessage === 'Email already exists' ? 'error-warning' : ''} ${emailClass}`} value={formData.email} onChange={handleChange} placeholder="Email" required />

                  {errors.email && <span className="error" style={{ color: 'red', marginTop: '10px' }}>{errors.email}</span>}

                   {generalMessage === 'Email already exists'&& <span className="error" style={{ color: 'red', marginTop: '10px' }}>{generalMessage}</span>}

              </div>

              <div className="form-grp">
                <label htmlFor="number">Mobile Number</label>
                <input type="text" id="number" value={formData.number} onChange={handleChange} placeholder="+1 (000) 000 0000" required />
                 {errors.number && <span className="error" style={{ color: 'red', marginTop: '10px' }}>{errors.number}</span>}
              </div>

              <div className="form-grp">

                <label htmlFor="password">Password</label>

                <input type="password" className={`input-field ${errors.password ? 'email-invalid' : ''}`}  id="password" value={formData.password} onChange={handleChange} placeholder="+8 characters" required />

                <span className="eye-icon">
                    <Image
                    src={eyeiconhide}
                    alt="img"
                    width={20}
                    height={20}

                    />

                    {/* ontoggle */}


                    {/* <Image
                    src={eyeicon}
                    alt="img"
                    width={20}
                    height={20}

                    /> */}



                  </span>

                 <span>Use 8 or more characters, with a mix of letters, numbers and synbols</span>

                 {errors.password && <span className="error" style={{ color: 'red', marginTop: '10px' }}>{errors.password}</span>}

              </div>





              <div className="form-grp">
                <label htmlFor="confirmPassword">Confirm Password</label>

                <input type="password" className={`input-field ${errors.confirmPassword ? 'email-invalid' : ''}`}  id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm a password" required />

                 {errors.confirmPassword && <span className="error" style={{ color: 'red', marginTop: '10px' }} >{errors.confirmPassword}</span>}

              </div>

              <button type="submit" className="login-btn">Sign up</button>

                {successMessage &&
                 createPortal(
                  <div className='login-success'>
                  <p>{successMessage}</p>  </div>
         ,
        document.body
                 )


                }
                {generalMessage &&
                 createPortal(
                  <div className='invalid-login'>
                  <p>{generalMessage}</p>  </div>
         ,
        document.body
                 )


                }

            </form>

            {/* {generalMessage && <p style={{ color: 'red', marginTop: '10px' }}>{generalMessage}</p>} */}

            <p className="terms">
             By signing up, signing in or continuing, I agree to the Handis Terms of Use and acknowledge the Handis Privacy Policy. I agree that Handis may use my email address for marketing purposes. I can opt out at any time through my settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
