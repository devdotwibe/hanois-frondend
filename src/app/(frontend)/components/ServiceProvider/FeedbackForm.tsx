"use client";
import React, { useState,useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";

const FeedbackForm = () => {

  const [step, setStep] = useState(1);

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [touchedStep1, setTouchedStep1] = useState(false);

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

   const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleNavigate = () => {
    router.push("/"); // navigate to home page
  };

  const handleContinue = () => {
    setTouchedStep1(true);
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => setStep(1);

  const [isStep1Valid, setIsStep1Valid] = useState(false);

  const [errors, setErrors] = useState<any>({}); 


    const validateStep1 = () => {

      const newErrors: any = {};

      if (!formData.name.trim()) newErrors.name = "Company/Business Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Company Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
      if (!formData.register_no.trim()) newErrors.register_no = "Registration Number is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {

     if (touchedStep1) {
      setIsStep1Valid(validateStep1());
    }

  }, [formData,touchedStep1]);




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

              {errors.name && <p className="error-text">{errors.name}</p>}

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
               {errors.email && <p className="error-text">{errors.email}</p>}
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
                {errors.phone && <p className="error-text">{errors.phone}</p>}
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
               {errors.register_no && <p className="error-text">{errors.register_no}</p>}
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
               {errors.location && <p className="error-text">{errors.location}</p>}
            </div>

            <div className="btn-cvr">
              <button
              
                type="button"
                className={`btn-continue ${isStep1Valid ? "btn-active" : "btn-disabled"}`}

                onClick={handleContinue}

                //  disabled={!isStep1Valid}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}

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
              Thank you for registering at <b>Handis</b>. Verification process
              might take some time. You will receive an email once approved.
            </p>
            <button onClick={HandleNavigate} className="btn-home">
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
