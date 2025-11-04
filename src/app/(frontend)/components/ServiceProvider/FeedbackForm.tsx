"use client";
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";

const FeedbackForm = () => {
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    register_no: "",
    location: "",
    team_size: "",
    service: "",
    website: "",
    social_media: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}providers/register`, formData);
  
      setShowPopup(true);

    } catch (err: any) {

      console.error("❌ Registration Error:", err.response?.data || err.message);
      alert("Error submitting registration form!");

    } finally {

      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setStep(1);
    setFormData({
      name: "",
      email: "",
      phone: "",
      register_no: "",
      location: "",
      team_size: "",
      service: "",
      website: "",
      social_media: "",
    });
  };

  return (
    <div className="feedback-wrapper">
      {/* STEP 1 */}
      {step === 1 && (
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
                name="name"
                placeholder="Experts"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grp">
              <label htmlFor="companyEmail">Company Email</label>
              <input
                type="email"
                id="companyEmail"
                name="email"
                placeholder="Experts@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grp">
              <label htmlFor="companyPhone">Company Phone Number</label>
              <input
                type="tel"
                id="companyPhone"
                name="phone"
                placeholder="+1 (000) 000 0000"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grp">
              <label htmlFor="companyReg">Company Registration Number</label>
              <input
                type="text"
                id="companyReg"
                name="register_no"
                placeholder="# **.*****.1234"
                value={formData.register_no}
                onChange={handleChange}
              />
            </div>

            <div className="form-grp">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
              />
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
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="serv-prov-form">
          <form className="company-form" onSubmit={handleSubmit}>
            <h3>2/2</h3>
            <h2>Complete company details</h2>

            <div className="form-grp">
              <label htmlFor="teamSize">Team Size</label>
              <input
                type="text"
                id="teamSize"
                name="team_size"
                placeholder="10"
                value={formData.team_size}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grp">
              <label htmlFor="services">Select Services</label>
              <input
                type="text"
                id="services"
                name="service"
                placeholder="Web Development, Design..."
                value={formData.service}
                onChange={handleChange}
              />
            </div>

            <div className="form-grp">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                placeholder="www.yourwebsite.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-grp">
              <label htmlFor="social">Social Media</label>
              <input
                type="text"
                id="social"
                name="social_media"
                placeholder="Instagram/Whatsapp"
                value={formData.social_media}
                onChange={handleChange}
              />
            </div>

            <div className="btn-cvr two-btns">
              <button type="button" className="btn-back" onClick={handleBack}>
                Back
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content providesucess">
            <h2>Success!</h2>
            <p>
              Thank you for registering at <b>Hands</b>. Verification process
              might take some time. You will receive an email once approved.
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
