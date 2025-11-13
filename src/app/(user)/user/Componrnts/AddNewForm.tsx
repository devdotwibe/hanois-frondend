"use client";

type OptionItem = {
  id: number;
  name: string;
};


import React, { useState,useEffect } from 'react'
import { API_URL } from "@/config";
import ProviderCard from "./ProviderCard";
import proposalimg from "../../../../../public/images/get-listed-1.jpg";
import Select from "react-select";

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

  const [errors, setErrors] = useState({
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

  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [designLevels, setDesignLevels] = useState<OptionItem[]>([]);
  const [servicesList, setServicesList] = useState<OptionItem[]>([]);

  const [ShowCalculator,setShowCalculator] = useState(false);

  const [quality, setQuality] = useState("");
  const [buildCost, setBuildCost] = useState("");
  const [feeRate, setFeeRate] = useState("");
  
  const [BuildArea, setBuildArea] = useState("");
  const [CostFinish, setCostFinish] = useState("");
  const [SuggestCost, setSuggestCost] = useState("");
  const [TotalCost, setTotalCost] = useState("");

  const [constructionRate, setConstructionRate] = useState("");

  const [Providers, setProviders] = useState([]);

 const [ListPrivate, setListPrivate] = useState(false);

 const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

 const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([]);

  const handleSelect = (company: any, checked: boolean) => {

    if (checked) {

      setSelectedProviders((prev) => [...prev, company]);

      setSelectedProviderIds((prev) => [...prev, company.id]);

      setProviders((prev) => prev.filter((p) => p.id !== company.id));
    } else {
    
      setProviders((prev) => [...prev, company]);

       setSelectedProviderIds((prev) => prev.filter((id) => id !== company.id));

      setSelectedProviders((prev) => prev.filter((p) => p.id !== company.id));
    }
  };

   console.log(selectedProviders,'selectedProviders');

  const NOTES_LIMIT = 1024;

  const handleChange = async (e: any) => {

        const { name, value } = e.target;
        if (name === "notes") {
        if (value.length > NOTES_LIMIT) return; 
        }
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "luxuryLevel") {
            const selectedLevel = designLevels.find((item) => item.id === parseInt(value));
            if (selectedLevel) {
                setQuality(selectedLevel?.quality || "");
                setBuildCost(selectedLevel?.cost || "");
                setFeeRate(selectedLevel?.rate || "");
            } else {
         
                setQuality("");
                setBuildCost("");
                setFeeRate("");
            }
        }
        if (name === "projectType") {

           try {

                if (!value) {
                    setProviders([]);
                    return;
                }
                const res = await fetch(`${API_URL}providers/by-category/${value}`);

                const data = await res.json();

                if (res.ok) {

                    setProviders(data);

                    setSelectedProviders([]);

                } else {

                    console.error("Failed to fetch providers:", data.message);
                    setProviders([]);
                }
            } catch (err) {

                console.error("Error fetching providers:", err);
                setProviders([]);
            }
        }
  };


    useEffect(() => {
        fetch(`${API_URL}settings/construction_rate`)
        .then((res) => res.json())
        .then((data) => setConstructionRate(data?.construction_rate || ""))
        .catch(() => console.error("Failed to fetch construction rate"));
    }, []);


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
        service_ids: formData.services,
        constructionBudget: formData.constructionBudget,
        basement: formData.basement,
        listingStyle: formData.listingStyle,
        provider_id: selectedProviderIds,
        build_area:BuildArea,
        cost_finsh:CostFinish,
        suggest_cost:SuggestCost,
        total_cost:TotalCost,
        })
    });

    const data = await res.json();

    console.log("API response:", data);
    
    if (data?.error === "Access token is required" || data?.error === "Invalid or expired token") {

        localStorage.removeItem("token");
    
        window.location.href = "/login";
        return;
    }

    if (!res.ok) throw new Error(data.error || "Error submitting form");
        setSubmitted(true);
        setEditMode(false);
        alert("Form submitted successfully");
    } catch (error) {

        // alert("Failed to submit");
        console.error(error);
    }
};

React.useEffect(() => {
  const loadData = async () => {
    try {
      const [catRes, designRes, serviceRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/design`),
        fetch(`${API_URL}/services`)
      ]);

      const catData: OptionItem[] = await catRes.json();
      const designData: OptionItem[] = await designRes.json();
      const serviceData: OptionItem[] = await serviceRes.json();

      setCategories(catData);
      setDesignLevels(designData);
      setServicesList(serviceData);
    } catch (err) {
      console.error("Dropdown load error:", err);
    }
  };

  loadData();
}, []);

const getCategoryName = (id: string | number) => {
  const item = categories.find(c => c.id == id);
  return item ? item.name : id;
};

const getDesignName = (id: string | number) => {
  const item = designLevels.find(d => d.id == id);
  return item ? item.name : id;
};

const getServiceName = (id: string | number) => {
  const item = servicesList.find(s => s.id == id);
  return item ? item.name : id;
};

//   useEffect(() => {

//     console.log(formData?.luxuryLevel,feeRate,buildCost,quality);
    
//   }, [formData?.luxuryLevel]);


    useEffect(() => {

    console.log("landSize:", formData?.landSize);
    console.log("basement:", formData?.basement);
    console.log("luxuryLevel:", formData?.luxuryLevel);
    console.log("constructionRate:", constructionRate);
    console.log("buildCost:", buildCost);

    if (
        formData?.landSize !== "" &&
        formData?.basement !== "" &&
        formData?.luxuryLevel !== ""
    ) {

        let calcBuildArea = 0;

        const landSize = Number(formData?.landSize) || 0;

        const rate = Number(constructionRate) || 0;

        if (formData?.basement === 'yes') {

            calcBuildArea = landSize * (rate / 100) + landSize;
            
        } else {

            calcBuildArea = landSize * (rate / 100);
        }

        const calcCostFinish = calcBuildArea * buildCost;
        const calcSuggestCost = calcCostFinish * (feeRate / 100);
        const calcTotalCost = calcCostFinish + calcSuggestCost;

        console.log("BuildArea:", calcBuildArea);
        console.log("CostFinish:", calcCostFinish);
        console.log("SuggestCost:", calcSuggestCost);
        console.log("TotalCost:", calcTotalCost);

        setBuildArea(calcBuildArea);

        setCostFinish(calcCostFinish);
        setSuggestCost(calcSuggestCost);
        setTotalCost(calcTotalCost);

        setShowCalculator(true);
    } else {
        console.log("⛔ Missing one or more required fields");
    }
    }, [formData?.landSize, formData?.basement, formData?.luxuryLevel, constructionRate, buildCost]);


     useEffect(() => {

        setErrors(prev => ({ ...prev, projectType: "" }));

        if(formData?.listingStyle == 'private')
        {
            if (formData?.projectType == "") {

               const newErrors = {};

               newErrors.projectType = "Project Type is Required";

               window.scrollTo({ top: 0, behavior: "smooth" });

               setErrors(newErrors);

               setFormData(prev => ({ ...prev, listingStyle: "" }));

                return;
            }

            setListPrivate(true);
        }
        else
        {
             setListPrivate(false);
        }

     },[formData?.listingStyle,formData?.projectType]);

    const serviceOptions = servicesList.map((ser) => ({
        value: ser.id,
        label: ser.name,
    }));


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
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <small>Brief description for your profile. URLs are hyperlinked.</small>

                        <small style={{ fontSize: "12px", color: "#666" }}>
                            {NOTES_LIMIT - formData.notes.length} characters left
                        </small>
                    </div>
                    </div>

                    <div className="form-grp">
                        <label>Project Type</label>
                        <select
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            >
                            <option value="">Select Project Type</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                         {errors.projectType && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }} >{errors.projectType}</p>}
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
                        <select
                            name="luxuryLevel"
                            value={formData.luxuryLevel}
                            onChange={handleChange}
                            >
                            <option value="">Select Luxury Level</option>
                            {designLevels.map(des => (
                                <option key={des.id} value={des.id}>{des.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-grp">

                        <label>Select Services</label>
                            <Select
                                isMulti
                                name="services"
                                options={serviceOptions}
                                value={serviceOptions.filter(opt => formData.services?.includes(opt.value))}
                                onChange={(selected) => {
                                const selectedValues = selected.map((item) => item.value);
                                setFormData((prev) => ({
                                    ...prev,
                                    services: selectedValues,
                                }));
                                }}
                                placeholder="Select services..."
                                classNamePrefix="react-select"
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
                                className={`private-btn ${formData.listingStyle === 'private' ? 'active' : ''}`}
                                type="button"
                                onClick={() =>
                                    setFormData(prev => ({ ...prev, listingStyle: "private" }))
                                }
                            >
                            Private
                            </button>

                            <button
                                className={`public-btn ${formData.listingStyle === 'public' ? 'active' : ''}`}
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

                        {ListPrivate && (

                            <>
                            <div className="proposal-div">

                                {Providers.map((company) => (

                                    <ProviderCard 
                                    key={company.id} 
                                    company={company}
                                    isSelected={false}
                                    onSelect={handleSelect}

                                    />
                                ))}

                            </div>
                         
                                {selectedProviders.length > 0 && (

                                    <div className="selected-section">
                                        <h3>Selected Providers</h3>
                                        <div className="proposal-div">
                                            {selectedProviders.map((company) => (
                                            <ProviderCard
                                                key={company.id}
                                                company={company}
                                                isSelected={true}
                                                onSelect={handleSelect}
                                                isRemovable
                                            />
                                            ))}
                                        </div>
                                    </div>

                                )}
                            </>  
                        )}

                    </div>

                    {ShowCalculator && (

                        <div className="budget-calc">
                            <h2>Budget Calculator</h2>
                            <div className="budget-calculator">

                                <div className="bud-col1">
                                    <div className="bud-row">
                                        <p><strong>Total max buildable area</strong></p>
                                        <p><span className="">{BuildArea}</span></p>
                                    </div>
                                
                                    <div className="bud-row">
                                        <p><strong>Cost with finish</strong></p>
                                        <p><span className="">{CostFinish}</span></p>
                                    </div>
                                </div>

                                <div className="bud-col1 bud-col2">
                                    <div className="bud-row">
                                        <p><strong>Design Fee Cost</strong></p>
                                        <p><span className="cost-value">{SuggestCost}</span> ( {feeRate} %)</p>
                                    </div>

                                    <div className="bud-row">
                                        <p><strong>Total Project Cost</strong></p>
                                        <p><span className="">{TotalCost}</span></p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}


                    <div className="create-btn-container">
                        <button className='create-btn invite-btn' type="submit">Create And Send Invite</button>
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
                <tr><td>Type</td><td>{getCategoryName(formData.projectType)}</td></tr>
                <tr><td>Location</td><td>{formData.location}</td></tr>
                <tr><td>Land size</td><td>{formData.landSize}</td></tr>
                <tr><td>Luxury level</td><td>{getDesignName(formData.luxuryLevel)}</td></tr>
                <tr><td>Services</td><td>{getServiceName(formData.services)}</td></tr>
                <tr><td>Basement</td><td>{formData.basement === "yes" ? "Yes" : "No"}</td></tr>
            </tbody>
            </table>


                {ShowCalculator && (
                        <>
                        <h3>Budget Calculator 1</h3>

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
                    </>
                )}

             
            </div>
        )}
        </div>
    );
}

export default AddNewForm
