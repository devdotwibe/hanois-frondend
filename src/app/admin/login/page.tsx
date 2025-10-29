"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import backarrow from "../../../../public/images/left-arrow.svg";
import headerlogo from "../../../../public/images/logo.png";
import loginimg from "../../../../public/images/login-sidebar.png";

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
      const res = await fetch('', {
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
            <h2>Login to Admin</h2>

            <form className="login-form" onSubmit={handleSubmit}>
           
              <div className="form-grp">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              </div>


              <div className="form-grp">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="+8 characters" required />
              </div>

              
              <button type="submit" className="login-btn">Login</button>
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
