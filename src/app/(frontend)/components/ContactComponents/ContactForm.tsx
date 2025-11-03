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

  const [status, setStatus] = useState({ loading: false, message: "", success: false });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", success: false });

    try {
      // ✅ match backend keys exactly
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
          <div className="form-grp">
            <label htmlFor="fullName">First and Last Name</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="First and Last Name"
              required
            />
          </div>

          <div className="form-grp">
            <label htmlFor="email">Business Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Business Email"
              required
            />
          </div>

          <div className="form-grp">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              required
            />
          </div>

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

          <div className="form-grp">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes"
              rows={4}
            ></textarea>
            <small>Brief description for your profile. URLs are hyperlinked.</small>
          </div>

          <div className="btn-cvr">
            <button type="submit" className="login-btn contact" disabled={status.loading}>
              {status.loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {status.message && (
            <p
              style={{
                color: status.success ? "green" : "red",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
