"use client";
import React, { useState } from "react";

const FeedbackForm = () => {
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const handleContinue = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
    setStep(1);
  };

  return (
    <div className="feedback-wrapper">
      {/* STEP 1 */}
      <div className={`step step1 ${step === 1 ? "show" : ""}`}>
        <div className="serv-prov-form">
          <form className="company-form">
            <h3>
              1/<span>2</span>
            </h3>
            <h2>Tell us about your company</h2>

            <div className="form-grp">
              <label htmlFor="companyName">Company/Business Name</label>
              <input
                type="text"
                id="companyName"
                placeholder="Experts"
                required
                defaultValue="Experts"
              />
            </div>

            <div className="form-grp">
              <label htmlFor="companyEmail">Company Email</label>
              <input
                type="email"
                id="companyEmail"
                placeholder="Experts@gmail.com"
              />
            </div>

            <div className="form-grp">
              <label htmlFor="companyPhone">Company Phone Number</label>
              <input
                type="tel"
                id="companyPhone"
                placeholder="+ 1 (000) 000 0000"
              />
            </div>

            <div className="form-grp">
              <label htmlFor="companyReg">Company Registration Number</label>
              <input
                type="text"
                id="companyReg"
                placeholder="# **.*****.1234"
              />
            </div>

            <div className="form-grp">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" placeholder="Location" />
            </div>

            <div className="btn-cvr">
              <button
                type="button"
                className="btn-continue"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* STEP 2 */}
      <div className={`step step2 ${step === 2 ? "show" : ""}`}>
        <div className="serv-prov-form">
          <form className="company-form" onSubmit={handleSubmit}>
            <h3>2/2</h3>
            <h2>Complete company details</h2>

            <div className="form-grp">
              <label htmlFor="teamSize">Team Size</label>
              <input
                type="text"
                id="teamSize"
                placeholder="Experts"
                defaultValue="Experts"
                required
              />
            </div>

            <div className="form-grp">
              <label htmlFor="services">Select Services</label>
              <input type="text" id="services" placeholder="Select Services" />
            </div>

            <div className="form-grp">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                placeholder="www.yourwebsite.com"
              />
            </div>

            <div className="form-grp">
              <label htmlFor="social">Social Media</label>
              <input
                type="text"
                id="social"
                placeholder="Instagram/Whatsapp"
              />
            </div>

            <div className="btn-cvr two-btns">
              <button
                type="button"
                className="btn-back"
                onClick={handleBack}
              >
                Back
              </button>
              <button type="submit" className="btn-submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content providesucess">
            <h2>Success!</h2>
      <p>
        Thank you for registering at Hands. Verification process

        might take some time and after you will receive an email.
      </p>
           

             <button onClick={closePopup} className="btn-home">
        Back to Home
      </button>


          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
