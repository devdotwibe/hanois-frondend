import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from "../../../../../public/images/logo.png"
import LanguageSwitcher from '../LanguageSwitcher '

const Header = () => {
  return (
    <div className='header'>
      <div className="containers">
        <div className="header-div">
          <div className="header-col1">
            <div className="header-logo">
              <Link href="/">
                <Image
                  src={logo}
                  alt="logo"
                  width={50}
                  height={50}
                />
              </Link>
            </div>

            <div className="header-text">
              <p>Service Providers</p>
            </div>
          </div>


          <div className="header-col2">
            <LanguageSwitcher />
           
            <Link href="/" className='h-login'>Login</Link>
            <Link href="/" className='h-btn'>Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
