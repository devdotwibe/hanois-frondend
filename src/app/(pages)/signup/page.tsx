"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import backarrow from "../../../../public/images/left-arrow.svg";
import headerlogo from "../../../../public/images/logo.png";
import loginimg from "../../../../public/images/login-sidebar.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    password: '',
    conformpassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.conformpassword) {
      alert("Passwords don't match");
      return;
    }

    try {
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          mobile: formData.number,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful!');
        console.log(data);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

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

              {/* ✅ Add handleSubmit and handleChange */}
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="formcol2">
                  <div className="form-grp">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-grp">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Last Name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-grp">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-grp">
                  <label htmlFor="number">Mobile Number</label>
                  <input
                    type="text"
                    id="number"
                    placeholder="+1 (000) 000 0000"
                    required
                    value={formData.number}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-grp">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="+8 characters"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span>Use 8 or more characters, with a mix of letters, numbers and symbols</span>
                </div>

                <div className="form-grp">
                  <label htmlFor="conformpassword">Confirm Password</label>
                  <input
                    type="password"
                    id="conformpassword"
                    placeholder="Confirm password"
                    required
                    value={formData.conformpassword}
                    onChange={handleChange}
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
  );
};

export default SignUp;
