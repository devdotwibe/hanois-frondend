import React from 'react'
import Link from 'next/link'

const ContactForm = () => {
  return (

    <div className="containers">
         <div className='form-c'>
        <h3>Let's get in touch</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing</p>




        <form>
  <div className="form-grp">
    <label htmlFor="fullName">First and Last Name</label>
    <input
      type="text"
      id="fullName"
      placeholder="First and Last Name"
      required
    />
  </div>

  <div className="form-grp">
    <label htmlFor="businessEmail">Business Email</label>
    <input
      type="email"
      id="businessEmail"
      placeholder="Business Email"
      required
    />
  </div>

  <div className="form-grp">
    <label htmlFor="companyName">Company Name</label>
    <input
      type="text"
      id="companyName"
      placeholder="Company Name"
      required
    />
  </div>

  <div className="form-grp">
    <label htmlFor="websiteUrl">Website URL</label>
    <input
      type="url"
      id="websiteUrl"
      placeholder="Website URL"
    />
  </div>

  <div className="form-grp">
    <label htmlFor="notes">Notes</label>
    <textarea
      id="notes"
      placeholder="Add notes"
      rows={4}
    ></textarea>
    <small>Brief description for your profile. URLs are hyperlinked.</small>
  </div>
<div className="btn-cvr">
      <button type="submit" className="login-btn contact">
    Log in
  </button>

</div>




</form>




      
    </div>

    </div>


   
  )
}

export default ContactForm
