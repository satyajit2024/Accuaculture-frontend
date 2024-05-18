import React from 'react'
import './Footer.css';
import company from './companylogo.png';

const Footer = () => {
  return (
    <div>
  {/* Footer start*/}
  <div className=" footer">
        <div className="d-flex justify-content-end align-items-center h-100">
          <p>@2024 BarifloLabs. All Right Reserved</p>
          <img className="footerLogo" src={company} alt="company logo"  />
        </div>
      </div>

       {/* Footer End*/}

    </div>
  )
}

export default Footer;