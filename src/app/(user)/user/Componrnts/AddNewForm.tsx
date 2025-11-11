"use client";

import React, { useState } from 'react'
import { API_URL } from "@/config";

const AddNewForm = () => {

  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    projectType: "",
    location: "",
    landSize: "",
    luxuryLevel: "",
    services: "",
    constructionBudget: "",
    basement: "",
    listingStyle: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e:any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e:any) => {
  e.preventDefault();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  try {
    const res = await fetch(`${API_URL}/users/add_project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({
        title: formData.title,
        notes: formData.notes,
        projectType: formData.projectType,
        location: formData.location,
        landSize: formData.landSize,
        luxuryLevel: formData.luxuryLevel,
        services: formData.services,
        constructionBudget: formData.constructionBudget,
        basement: formData.basement,
        listingStyle: formData.listingStyle
        })
    });

    const data = await res.json();
    console.log("API response:", data);

    if (!res.ok) throw new Error(data.error || "Error submitting form");
    setSubmitted(true);
    setEditMode(false);
    alert("Form submitted successfully");
  } catch (error) {
    alert("Failed to submit");
    console.error(error);
  }
};


return (
  <div className='add-newformouter'>
    {(!submitted || editMode) && (
      <>
        <h2>Add New Project</h2>

                <form className='addproject-form' onSubmit={handleSubmit}>

                    <div className="form-grp">
                        <label>Title</label>
                        <input
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-grp">
                        <label>Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        placeholder="Add notes"
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        ></textarea>
                    <small>Brief description for your profile. URLs are hyperlinked.</small>
                    </div>

                    <div className="form-grp">
                        <label>Project Type</label>
                        <input
                        name="projectType"
                        placeholder="Title"
                        value={formData.projectType}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-grp">
                        <label>Location</label>
                        <input
                        name="location"
                        placeholder="Kuwait City"
                        value={formData.location}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-grp">
                        <label>Land size</label>
                        <input
                        name="landSize"
                        placeholder="115 m2"
                        value={formData.landSize}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-grp">
                        <label>Luxury level</label>
                        <input
                        name="luxuryLevel"
                        placeholder="Luxury level"
                        value={formData.luxuryLevel}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-grp">
                        <label>Select Services</label>
                        <input
                        name="services"
                        placeholder="Select Services"
                        value={formData.services}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-grp">
                        <label>construction Budget</label>
                        <input
                        name="constructionBudget"
                        placeholder="$150, 000"
                        value={formData.constructionBudget}
                        onChange={handleChange}
                        />
                    </div>

                <div className="radio-group">
                    <h5>Do you have a Basement?</h5>

                    <div className="radio-row">

                        <div className="radio-col">
                            <label className="radio-option">
                                <input
                                type="radio"
                                name="basement"
                                value="yes"
                                onChange={handleChange}
                                />
                                <span className="radio-custom"></span>
                                Yes
                            </label>
                        </div>

                        <div className="radio-col">
                            <label className="radio-option">
                                <input
                                type="radio"
                                name="basement"
                                value="no"
                                onChange={handleChange}
                                />
                                <span className="radio-custom"></span>
                                No
                            </label>
                        </div>

                    </div>
                </div>

                <div className="form-grp listing-styleouter">
                        <h5>Listing style</h5>

                        <div className="listing-style">

                            <button
                            className='private-btn'
                            type="button"
                            onClick={() =>
                                setFormData(prev => ({ ...prev, listingStyle: "private" }))
                            }
                            >
                            Private
                            </button>

                            <button
                            className='public-btn'
                            type="button"
                            onClick={() =>
                                setFormData(prev => ({ ...prev, listingStyle: "public" }))
                            }
                            >
                            Public
                            </button>

                        </div>

                        <ul className='listing-ul'>
                            <li>Public projects will be pushed to all the service providers in the director</li>
                            <li>Private projects will be invite only</li>
                        </ul>
                    </div>

                    <div className="budget-calc">
                        <h2>Budget Calculator</h2>
                        <div className="budget-calculator">

                            <div className="bud-col1">
                                <div className="bud-row">
                                    <p><strong>Total max buildable area</strong></p>
                                    <p><span className="">870</span></p>
                                </div>
                            
                                <div className="bud-row">
                                    <p><strong>Cost with finish</strong></p>
                                    <p><span className="">117 700</span></p>
                                </div>
                            </div>

                            <div className="bud-col1 bud-col2">
                                <div className="bud-row">
                                    <p><strong>Design Fee Cost</strong></p>
                                    <p><span className="cost-value">1,177</span> (5%)</p>
                                </div>

                                <div className="bud-row">
                                    <p><strong>Total Project Cost</strong></p>
                                    <p><span className="">118,877</span></p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="create-btn-container">
                        <button className='create-btn' type="submit">Create</button>
                    </div>

                </form>
            </>
        )}

        {submitted && !editMode && (
        <div className="project-details-view">

            <button
                className="edit-button"
                onClick={() => setEditMode(true)}
                style={{
                    color: "#0066ff",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginBottom: "20px",
                    float: "right"
                }}
                >
                Edit
            </button>

            <h2>{formData.title}</h2>

            <p style={{ color: "green" }}>
            {formData.listingStyle === "public" ? "Public" : "Private"}
            </p>

            <h4>Brief</h4>
            <p>{formData.notes}</p>

            <table className="details-table">
            <tbody>
                <tr><td>Type</td><td>{formData.projectType}</td></tr>
                <tr><td>Location</td><td>{formData.location}</td></tr>
                <tr><td>Land size</td><td>{formData.landSize}</td></tr>
                <tr><td>Luxury level</td><td>{formData.luxuryLevel}</td></tr>
                <tr><td>Services</td><td>{formData.services}</td></tr>
                <tr><td>Basement</td><td>{formData.basement === "yes" ? "Yes" : "No"}</td></tr>
            </tbody>
            </table>

            <h3>Budget Calculator</h3>

            <div className="budget-calculator">
            <div className="bud-col1">
                <div className="bud-row">
                <p><strong>Total max buildable area</strong></p>
                <p>870</p>
                </div>

                <div className="bud-row">
                <p><strong>Cost with finish</strong></p>
                <p>117 700</p>
                </div>
            </div>

            <div className="bud-col1 bud-col2">
                <div className="bud-row">
                <p><strong>Design Fee Cost</strong></p>
                <p>1 177 (5%)</p>
                </div>

                <div className="bud-row">
                <p><strong>Total Project Cost</strong></p>
                <p>118 877</p>
                </div>
            </div>
            </div>

        </div>
        )}
        </div>
    );
}

export default AddNewForm
