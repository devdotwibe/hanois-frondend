"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from 'next/link'
import logo from "../../../../../public/images/logo.png"
import fbicon from "../../../../../public/images/facebook.png"
import LanguageSwitcher from "../LanguageSwitcher ";

const Footer = () => {
  const [open, setOpen] = useState(false);

  return (
    <footer className="footer">
      {/* Top Section */}


      <div className="footer-container containers">

        <div className="footer-about footer-column">

           <div className="footer-logo">
              <Link href="/">
                <Image
                  src={logo}
                  alt="logo"
                  width={50}
                  height={50}
                />
              </Link>
            </div>


          <p>We built an elegant solution.</p>
          <p>
            Our team created a fully integrated sales 
            <span>and marketing solution for SMBs</span>
            
          </p>


          <div className="social-icons">

            <div className="f-ss">
              <Link href= "">
              <Image
                  src={fbicon}
                  alt="logo"
                  width={30}
                  height={30}
                />
              </Link>
            </div>

            <div className="f-ss">
              <Link href= "">
              <Image
                  src={fbicon}
                  alt="logo"
                  width={30}
                  height={30}
                />
              </Link>
            </div>




            
          </div>




        </div>

        <div className="footer-column f-links">
          <h4>Service Providers</h4>
          <ul>
            <li><a href="#">Get listed</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>

        <div className="footer-column f-links">
          <h4>Service Seeker</h4>
          <ul>
            <li><a href="#">Find Service Provider</a></li>
            <li><a href="#">List your project</a></li>
          </ul>
        </div>

        <div className="footer-column f-links">
          <h4>Help Center</h4>
          <ul>
            <li><a href="#">Get in touch</a></li>
          </ul>
        </div>

        <div className="footer-column f-links">
          <h4>About</h4>
          <ul>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>

      </div>

      <hr className="footer-line" />

      {/* Bottom Section */}
      <div className="containers">
           <div className="footer-bottom">
        <p>© Copyright 2022 Handis, Inc.</p>

        <LanguageSwitcher />



      </div>

      </div>

    </footer>
  );
};

export default Footer;
