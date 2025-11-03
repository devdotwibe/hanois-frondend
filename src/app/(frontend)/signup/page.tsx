"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import backarrow from "../../../../public/images/left-arrow.svg";
import headerlogo from "../../../../public/images/logo2.png";
import loginimg from "../../../../public/images/login-sidebar.png";
import { API_URL } from '@/config'; 

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

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
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
        setMessage('Registration successful!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          number: '',
          password: '',
          confirmPassword: ''
        });
        router.push('/login');
      } else {
        setMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Server error');
    }
  };

  return (
    <div className="signuppage">
      <div className="login-divider">
        {/* Left Column */}
        <div className="logincol1">
          <div className="bg-cover">
            <Image src={loginimg} alt="Login background" width={100} height={100} className="login-img" />
          </div>
          <div className="logo-div">
            <Image src={headerlogo} alt="Logo" width={100} height={100} className="login-img" />
          </div>
        </div>

        {/* Right Column */}
        <div className="logincol2">
          <button className="back-bth">
            <Image src={backarrow} alt="arrow" width={140} height={40} />
          </button>

          <div className="login-container">
            <h2>Sign up to Handis</h2>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="formcol2">
                <div className="form-grp">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                </div>

                <div className="form-grp">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                </div>
              </div>

              <div className="form-grp">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              </div>

              <div className="form-grp">
                <label htmlFor="number">Mobile Number</label>
                <input type="text" id="number" value={formData.number} onChange={handleChange} placeholder="+1 (000) 000 0000" required />
              </div>

              <div className="form-grp">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="+8 characters" required />
                 <span>Use 8 or more characters, with a mix of letters, numbers and synbols</span>
              </div>

              <div className="form-grp">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm a password" required />
              </div>

              <button type="submit" className="login-btn">Sign up</button>
            </form>

            {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}

            <p className="terms">
              By signing up, signing in or continuing, I agree to the Handis Terms of Use and acknowledge the Handis Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
