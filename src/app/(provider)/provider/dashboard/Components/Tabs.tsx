"use client";
import React, { useState, useEffect } from "react";
import ProjectComponent from "./ProjectComponent";
import { API_URL, SITE_URL } from "@/config";
import { useRouter } from "next/navigation";
import MultiSelect from "./MultiSelect";


const TABS = [
  { id: "companyinfo", label: "Company Information" },
  { id: "project", label: "Project" },
];

const MAX_NOTES = 1024;
const DEFAULT_CURRENCY = "KD";

const Tabs = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("companyinfo");

const handleTabClick = (tabId) => {
  if (tabId === "project") {
    const base = (SITE_URL || "").replace(/\/+$/, "");
    const target = `${base}/provider/dashboard/projects`;
    router.push(target);
    return;
  }
  setActiveTab(tabId);
};


  const [categoriesList, setCategoriesList] = useState([]);
  const [servicesList, setServicesList] = useState([]);


  const [selectedServices, setSelectedServices] = useState([]);

  const [formData, setFormData] = useState({
    companyName: "",
    categories: [],
    phoneNumber: "",
    location: "",
    teamSize: "",
    notes: "",
    website: "",
    facebook: "",
    instagram: "",
    other: "",
    services: [], 
    professionalHeadline: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, message: "", success: false });

  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (options && name !== "services") {
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData((s) => ({ ...s, [name]: values }));
      return;
    }

    if (name === "notes") {
      const trimmed = value.slice(0, MAX_NOTES);
      setFormData((s) => ({ ...s, notes: trimmed }));
      return;
    }

    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleServicesSelect = (e) => {
    const values = Array.from(e.target.options)
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);

    setFormData((s) => ({ ...s, services: values }));

    setSelectedServices((prev) => {
      const ids = values.map(String);
      const kept = prev.filter((p) => ids.includes(String(p.id)));

      const additions = ids
        .filter((id) => !kept.some((k) => String(k.id) === id))
        .map((id) => {
          const svc = servicesList.find((s) => String(s.id) === String(id));
          return {
            id,
            name: svc ? svc.name : "",
            cost: "",
            currency: DEFAULT_CURRENCY,
          };
        });

      return [...kept, ...additions];
    });
  };

  const handleServiceFieldChange = (index, key, value) => {
    setSelectedServices((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const removeService = (idToRemove) => {
    setSelectedServices((prev) => prev.filter((s) => String(s.id) !== String(idToRemove)));
    setFormData((prev) => ({ ...prev, services: prev.services.filter((id) => String(id) !== String(idToRemove)) }));
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          fetch(`${API_URL}categories`),
          fetch(`${API_URL}services`),
        ]);
        const catData = await catRes.json();
        const servData = await servRes.json();
        const cats = Array.isArray(catData) ? catData : catData.data || [];
        const svcs = Array.isArray(servData) ? servData : servData.data || [];
        setCategoriesList(cats.map(c => ({ ...c, id: String(c.id) })));
        setServicesList(svcs.map(s => ({ ...s, id: String(s.id) })));
      } catch (err) {
        console.error("Error fetching categories/services:", err);
      }
    };
    fetchOptions();
  }, []);


  useEffect(() => {
    const fetchProvider = async () => {
      try {
        let providerId = localStorage.getItem("providerId");
        const token = localStorage.getItem("token");
        if (!providerId && token) {
          try {
            const base64 = token.split(".")[1];
            const payload = JSON.parse(atob(base64));
            providerId = String(payload?.provider_id || payload?.id || payload?.user_id);
          } catch (e) { /* ignore */ }
        }
        if (!providerId) return;

        const res = await fetch(`${API_URL}providers/${providerId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || data?.message || "Failed to fetch provider");
        const provider = data?.provider ?? data ?? {};

        const categories = Array.isArray(provider.categories_id)
          ? provider.categories_id.map(String)
          : provider.categories_id ? [String(provider.categories_id)] : [];

        const services = Array.isArray(provider.service_id)
          ? provider.service_id.map(String)
          : provider.service_id ? [String(provider.service_id)] : [];

        setFormData({
          companyName: provider.name ?? "",
          categories,
          phoneNumber: provider.phone ?? "",
          location: provider.location ?? "",
          teamSize: provider.team_size != null ? String(provider.team_size) : "",
          notes: provider.notes ?? "",
          website: provider.website ?? provider.web ?? provider.social_media ?? "",
          facebook: provider.facebook ?? "",
          instagram: provider.instagram ?? "",
          other: provider.other_link ?? provider.other ?? "",
          services,
          professionalHeadline: provider.professional_headline ?? provider.professionalHeadline ?? "",
          image: provider.image ?? null,
        });
      } catch (err) {
        console.error("Error fetching provider:", err);
      }
    };
    fetchProvider();
  }, []);


    useEffect(() => {
      if (!servicesList || servicesList.length === 0) return;
      if (!formData.services || formData.services.length === 0) {
        setSelectedServices([]);
        return;
      }

      setSelectedServices((prev) => {
        const prevMap = new Map(prev.map((p) => [String(p.id), p]));

        return formData.services.map((id) => {
          const sid = String(id);
          const svcMeta = servicesList.find((s) => String(s.id) === sid);
          const existing = prevMap.get(sid);
          return {
            id: sid,
            name: svcMeta ? svcMeta.name : existing?.name ?? "",
            cost: existing?.cost ?? "",
            currency: existing?.currency ?? DEFAULT_CURRENCY,
          };
        });
      });
    }, [servicesList, formData.services]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setStatus({ loading: true, message: "", success: false });

    try {
      let providerId = localStorage.getItem("providerId");
      const token = localStorage.getItem("token");

      if (!providerId && token) {
        try {
          const base64 = token.split(".")[1];
          const payload = JSON.parse(atob(base64));
          providerId = String(payload?.provider_id || payload?.id || payload?.user_id);
        } catch (e) {}
      }

      if (!token) {
        setStatus({ loading: false, message: "You must be logged in to perform this action.", success: false });
        return;
      }

      if (!providerId) {
        setStatus({ loading: false, message: "No provider id found.", success: false });
        return;
      }

      const payload = {
        name: formData.companyName,
        phone: formData.phoneNumber,
        location: formData.location,
        team_size: formData.teamSize ? parseInt(formData.teamSize) : null,
        notes: formData.notes,
        website: formData.website,
        facebook: formData.facebook,
        instagram: formData.instagram,
        other_link: formData.other,
        categories_id: formData.categories,
        service_id: selectedServices.map((s) => s.id),
        service_details: selectedServices.map((s) => ({
          id: s.id,
          name: s.name,
          cost: s.cost,
          currency: s.currency,
        })),
        professional_headline: formData.professionalHeadline,
      };

      const res = await fetch(`${API_URL}providers/${providerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Update failed");

      setStatus({ loading: false, message: "Provider updated successfully!", success: true });

      router.push(`/provider/dashboard/details?providerId=${encodeURIComponent(providerId)}`);

      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, message: err.message || "Save failed", success: false });
    }
  };

  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    let base = API_URL.replace(/\/+$/, "");
    base = base.replace(/\/api\/api$/i, "/api");
    base = base.replace(/\/api$/i, "/api");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const notesRemaining = MAX_NOTES - (formData.notes ? formData.notes.length : 0);

  return (
    <div className="tab-wrapper1">
      {/* Sidebar Navigation */}
      <ul className="tab-nav1">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <button
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>

          </li>
        ))}
      </ul>
     
      {/* Tab Content */}
      <div className="tab-content-wrap">
        <div className={`tab-panel ${activeTab === "companyinfo" ? "show" : ""}`}>
          <form className="settingsform company-profile1" onSubmit={handleSubmit}>




            <div className="form-grp">
              <label>Company/Business Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter title"
                required
              />
            </div>

            {/* <div className="form-grp select-grp">
              <label>Company Categories</label>


              <select
                name="categories"
                multiple
                value={formData.categories}
                onChange={handleChange}
                className="select-wrapp"
              >


                {categoriesList.length > 0 ? (
                  categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading categories...</option>
                )}


              </select>


 




              <span className="arrow">▼</span>



            </div> */}

            <MultiSelect 
 label="Company Categories"
  options={categoriesList}
  selected={formData.categories}
  onChange={(values) =>
    setFormData((prev) => ({ ...prev, categories: values }))
  }/>





            

            <div className="form-grp">
              <label>Company Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-grp">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-grp">
              <label>Team Size</label>
              <input
                type="text"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                placeholder="Enter team size"
                required
              />
            </div>

            <div className="form-grp">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter notes"
                required
                maxLength={MAX_NOTES}
                rows={6}
              ></textarea>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#666" }}>Add a short summary that will appear on your profile</div>
                <div style={{ fontSize: 13, color: "#333" }}>{notesRemaining} characters remaining</div>
              </div>
            </div>

            <h4 style={{ fontWeight: 600, marginTop: 24  }}>Online Presence</h4>

            <div className="form-grp">
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Your homepage, company site or blog</div>
            </div>

            <div className="form-grp">
              <label>Facebook</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Enter Facebook URL"
              />
            </div>

            <div className="form-grp">
              <label>Instagram</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Enter Instagram URL"
              />
            </div>

            <div className="form-grp">
              <label>Other</label>
              <input
                type="text"
                name="other"
                value={formData.other}
                onChange={handleChange}
                placeholder="Enter other social media URL"
              />
            </div>

            {/* ------------------------------- */}

            <h4 style={{ fontWeight: 600,  marginTop: 24  }} >Services</h4>

            <div className="">
              {/* <label>Select Services</label> */}


              {/* <select
                name="services"
                multiple
                value={formData.services}
                onChange={handleServicesSelect}
              >
                {servicesList.length > 0 ? (
                  servicesList.map((serv) => (
                    <option key={serv.id} value={serv.id}>
                      {serv.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading services...</option>
                )}
              </select> */}


              <MultiSelect
    label="Select Services"
    options={servicesList}
    selected={formData.services}
    onChange={(values) => {
      setFormData((prev) => ({ ...prev, services: values }));
      handleServicesSelect(values); 
    }}
  />





           
              {selectedServices.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {selectedServices.map((svc, idx) => (
                    <div
                      key={svc.id}
                      style={{
                        // display: "grid",
                        // gridTemplateColumns: "1fr 160px 90px 36px",
                        // gap: 8,
                        // alignItems: "center",
                        // border: "1px solid #e6e9ee",
                        // padding: 12,
                        // borderRadius: 6,
                        // marginBottom: 10,
                        background: "#fff"
                      }}
                      className="svcrow"
                    >


                      <div className="svc1">
                          <input
                        type="text"
                        value={svc.name}
                        readOnly
                        style={{ padding: "10px", border: "none", background: "transparent" }}
                      />

                        
                      </div>


                      <div className="svc1 svc2">

                        <input
                        type="number"
                        placeholder="Average Cost"
                        value={svc.cost}
                        onChange={(e) => handleServiceFieldChange(idx, "cost", e.target.value)}
                        style={{ padding: "10px", border: "none", background: "transparent" }}
                      />

                  
                      <select
                        value={svc.currency}
                        onChange={(e) => handleServiceFieldChange(idx, "currency", e.target.value)}
                        style={{ padding: "8px" }}
                      >
                        <option value="KD">KD</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>

                 
                      <button
                        type="button"
                        onClick={() => removeService(svc.id)}
                        aria-label="Remove service"
                        style={{
                    
                          fontSize: 16,
                        }}
                        className="removeservice"
                      >
                        ×
                      </button>

                      </div>
                      
                    
                   
                      
                    </div>
                  ))}
                </div>
              )}


            </div>


            <div className="form-grp">
              <label>Service Note</label>
              <input
                type="text"
                name="servicenote"
                placeholder="Enter Service Note"
              />
            </div>


          <div style={{ textAlign: "right", marginTop: "32px" }}>
            <button
              type="submit"
              disabled={status.loading}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 85px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: status.loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s ease",
                opacity: status.loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0069d9")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              {status.loading ? "Saving..." : "Save"}
            </button>
          </div>

       {/* status message (success / error) */}
            {status.message && (
              <div className="login-success contact-sucess" style={{ marginBottom: 12 }}>
                <p style={{ color: status.success ? "green" : "red", margin: 0 }}>{status.message}</p>
              </div>
            )}

          </form>
        </div>

        <div className={`tab-panel ${activeTab === "project" ? "show" : ""}`}>
          <ProjectComponent />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
