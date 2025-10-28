// "use client" directive tells Next.js to treat this file as a client component
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import backarrow from "../../../../public/images/left-arrow.svg";
import headerlogo from "../../../../public/images/logo.png";
import loginimg from "../../../../public/images/login-sidebar.png";

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!firstName || !lastName || !email || !mobile || !password || !confirmPassword) {
      return setError('All fields are required.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const response = await fetch('http://72.60.220.196:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobile,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login or show success
        alert('User registered successfully!');
      } else {
        // Display error from the server
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server. Please try again.');
    }
  };

  return (
    <div className="signuppage">
      <div className="">
        <div className="login-divider">
          <div className="logincol1">
            <div className="bg-cover">
              <Image src={loginimg} alt="Login background" width={100} height={100} className="login-img" />
            </div>
            <div className="logo-div">
              <Image src={headerlogo} alt="Login background" width={100} height={100} className="login-img" />
            </div>
          </div>

          <div className="logincol2">
            <button className="back-bth">
              <Image src={backarrow} alt="arrow" width={140} height={40} />
            </button>

            <div className="login-container">
              <h2 className="">Sign up to Handis</h2>
              {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="formcol2">
                  <div className="form-grp">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      required
                    />
                  </div>

                  <div className="form-grp">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="form-grp">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="form-grp">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="text"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (000) 000 0000"
                    required
                  />
                </div>

                <div className="form-grp">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="form-grp">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />
                </div>

                <button type="submit" className="login-btn">Sign up</button>
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
