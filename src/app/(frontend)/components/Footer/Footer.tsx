"use client";
import React, { useState,useEffect } from "react";
import Image from "next/image";
import Link from 'next/link'
import logo from "../../../../../public/images/logo2.png"
import fbicon from "../../../../../public/images/facebook.svg"
import instagram from "../../../../../public/images/instagram.svg"
import twitter from "../../../../../public/images/twitter.svg"
import linkedin from "../../../../../public/images/linkedin.svg"

const Footer = () => {
  const [open, setOpen] = useState(false);

  const [token, setToken] = useState<string | null>(null);

   useEffect(() => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }, []);
    
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
              <Link href= "/">
              <Image
                  src={fbicon}
                  alt="logo"
                  width={20}
                  height={20}
                />
              </Link>
            </div>

            <div className="f-ss">
              <Link href= "/">
              <Image
                  src={linkedin}
                  alt="logo"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
            <div className="f-ss">
              <Link href= "/">
              <Image
                  src={twitter}
                  alt="logo"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
            <div className="f-ss">
              <Link href= "/">
              <Image
                  src={instagram}
                  alt="logo"
                  width={20}
                  height={20}
                />
              </Link>
            </div>




            
          </div>




        </div>

        <div className="footer-column f-links">
          <h4>Service Providers</h4>
          <ul>
            <li><a href="/serviceprovider/signup">Get listed</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>

        <div className="footer-column f-links">
          <h4>Service Seeker</h4>
          <ul>

            <li><a href="#">Find Service Provider</a></li>

            {token ? (

               <li><a href="#">List your project</a></li>

            ) : (

               <li><a href="/login">List your project</a></li>
            ) }
           

          </ul>
        </div>

        <div className="footer-column f-links">
          <h4>Help Center</h4>
          <ul>
            <li><a href="/get-in-touch">Get in touch</a></li>
          </ul>
        </div>

        <div className="footer-column f-links">
          <h4>About</h4>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/cookies">Cookies</a></li>
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
