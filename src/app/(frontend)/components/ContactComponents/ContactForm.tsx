"use client";
import React, { useState } from "react";
import axios from "axios";



const ContactForm = () => {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    websiteUrl: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    success: false,
  });

    const messageRef = React.useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" }); // clear error as user types
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your First and Last Name";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your Business Email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }



    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, message: "", success: false });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus({ loading: true, message: "", success: false });

    try {
      const payload = {
        full_name: formData.fullName,
        business_email: formData.email,
        company_name: formData.companyName,
        website_url: formData.websiteUrl,
        notes: formData.notes,
      };

      const response = await axios.post("https://hanois.dotwibe.com/api/api/contacts", payload);

      if (response.data.success) {
        setStatus({
          loading: false,
          message: "Message sent successfully!",
          success: true,
        });


        setFormData({
          fullName: "",
          email: "",
          companyName: "",
          websiteUrl: "",
          notes: "",
        });
        setErrors({});
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus({
        loading: false,
        message: "Something went wrong. Please try again.",
        success: false,
      });
    }
  };

  return (
    <div className="containers">
      <div className="form-c">
        <h3>Let's get in touch</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing</p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-grp">
            <label htmlFor="fullName">First and Last Name</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="First and Last Name"
            />
            {errors.fullName && (
              <p style={{ color: "red", fontSize: "14px", textAlign: "left", marginTop:"4px" }}>{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-grp">
            <label htmlFor="email">Business Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Business Email"
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: "14px", textAlign: "left", marginTop:"4px" }}>{errors.email}</p>
            )}
          </div>

          {/* Company Name */}
          <div className="form-grp">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
            />
            {errors.companyName && (
              <p style={{ color: "red", fontSize: "14px", textAlign: "left", marginTop:"4px" }}>{errors.companyName}</p>
            )}
          </div>

          {/* Website URL */}
          <div className="form-grp">
            <label htmlFor="websiteUrl">Website URL</label>
            <input
              type="url"
              id="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="Website URL"
            />
          </div>

          {/* Notes */}
          <div className="form-grp">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes"
              rows={4}
               maxLength={1024}
            ></textarea>
            <div className="smallwithptag">
               <p style={{ fontSize: "12px", textAlign: "right", marginTop: "4px" }}>
  {1024 - formData.notes.length}
</p>

            <small>Brief description for your profile. URLs are hyperlinked.</small>

            </div>



          </div>

          {/* Submit */}
          <div className="btn-cvr">
            <button type="submit" className="login-btn contact" disabled={status.loading}>
              {status.loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {/* Global Message */}



          {/* {status.message &&


            <div className="login-success contact-sucess">
               <p
              style={{
                color: status.success ? "green" : "red",
              }}
            >
              {status.message}
            </p>
            </div>


          } */}


{status.message && (
  <div
    ref={messageRef}
    className={status.success ? "contact-success" : "contact-error"}
  >
    <p style={{ color: status.success ? "green" : "red" }}>
      {status.message}
    </p>
  </div>
)}





        </form>
      </div>
    </div>
  );
};

export default ContactForm;
