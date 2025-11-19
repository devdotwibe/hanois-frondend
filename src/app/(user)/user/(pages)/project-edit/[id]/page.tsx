"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/config";
import ProviderCard from "../../../Componrnts/ProviderCard";
import Select from "react-select";
import Image from "next/image";
import arrow from "../../../../../../../public/images/left-arrow.svg";

type OptionItem = { id: number; name: string };

const EditProjectPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // Form state (structure same as AddNewForm)
  const [formData, setFormData] = useState<any>({
    title: "",
    notes: "",
    projectType: "",
    location: "",
    landSize: "",
    luxuryLevel: "",
    services: [] as number[],
    constructionBudget: "",
    basement: "",
    listingStyle: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Dropdowns / lists
  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [designLevels, setDesignLevels] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);

  // Providers
  const [Providers, setProviders] = useState<any[]>([]);
  const [ListPrivate, setListPrivate] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<any[]>([]);
  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>(
    []
  );

  // Calculator state
  const [constructionRate, setConstructionRate] = useState<number | string>("");
  const [quality, setQuality] = useState<number | string>("");
  const [buildCost, setBuildCost] = useState<number | string>("");
  const [feeRate, setFeeRate] = useState<number | string>("");

  const [BuildArea, setBuildArea] = useState<number | string>("");
  const [CostFinish, setCostFinish] = useState<number | string>("");
  const [SuggestCost, setSuggestCost] = useState<number | string>("");
  const [TotalCost, setTotalCost] = useState<number | string>("");

  const NOTES_LIMIT = 1024;

  // Load dropdown lists + construction rate
  useEffect(() => {
    const loadLists = async () => {
      try {
        const [catRes, designRes, serviceRes, rateRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/design`),
          fetch(`${API_URL}/services`),
          fetch(`${API_URL}settings/construction_rate`),
        ]);

        const catData = await catRes.json();
        const designData = await designRes.json();
        const serviceData = await serviceRes.json();
        const rateData = await rateRes.json();

        setCategories(catData || []);
        setDesignLevels(designData || []);
        setServicesList(serviceData || []);
        setConstructionRate(rateData?.construction_rate ?? "");
      } catch (err) {
        console.error("Dropdown load error:", err);
      }
    };

    loadLists();
  }, []);

  // Fetch project data and prefill form
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/users/project/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (res.ok && data.data?.project) {
          const p = data.data.project;

          // Pre-fill form data (map backend fields to formData structure)
          setFormData({
            title: p.title ?? "",
            notes: p.notes ?? "",
            projectType: p.project_type ?? "",
            location: p.location ?? "",
            landSize: p.land_size ?? "",
            luxuryLevel: p.luxury_level ?? "",
          services: Array.isArray(p.service_ids) ? p.service_ids.map(Number) : [],

            constructionBudget: p.construction_budget ?? "",
            basement: p.basement ?? "",
            listingStyle: p.listing_style ?? "",
          });

          // Calculator values from DB (if present)
          setBuildArea(p.build_area ?? "");
          setCostFinish(p.cost_finsh ?? "");
          setSuggestCost(p.suggest_cost ?? "");
          setTotalCost(p.total_cost ?? "");

          // luxury meta
          setQuality(p.luxury_level_details?.quality ?? "");
          setBuildCost(p.luxury_level_details?.cost ?? "");
          setFeeRate(p.luxury_level_details?.rate ?? "");

          // providers
          setSelectedProviderIds(p.provider_id ?? []);
          // selectedProviders details may not be available; we'll populate as providers list loads or when projectType selected
          setListPrivate(p.listing_style === "private");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // When projectType changes, fetch providers for that category
  useEffect(() => {
    const fetchProviders = async () => {
      if (!formData.projectType) {
        setProviders([]);
        return;
      }
      try {
        const res = await fetch(`${API_URL}providers/by-category/${formData.projectType}`);
        const data = await res.json();
        if (res.ok) {
          setProviders(data || []);
          // If the current selectedProviderIds exist, build selectedProviders from fetched list
          if (selectedProviderIds?.length > 0) {
            const matched = (data || []).filter((p: any) =>
              selectedProviderIds.includes(p.id)
            );
            setSelectedProviders((prev) => {
              // merge uniquely
              const ids = new Set(prev.map((x: any) => x.id));
              matched.forEach((m: any) => {
                if (!ids.has(m.id)) prev.push(m);
              });
              return [...prev];
            });
          }
        } else {
          setProviders([]);
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
        setProviders([]);
      }
    };

    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.projectType]);

  // When the selected luxuryLevel id changes, update quality/cost/rate
  useEffect(() => {
    const lvl = designLevels.find((d) => Number(d.id) === Number(formData.luxuryLevel));
    if (lvl) {
      setQuality(lvl.quality ?? "");
      setBuildCost(lvl.cost ?? "");
      setFeeRate(lvl.rate ?? "");
    }
  }, [formData.luxuryLevel, designLevels]);

  // Calculator: same logic as AddNewForm — runs when inputs change
  useEffect(() => {
    const ls = Number(formData.landSize) || 0;
    const rate = Number(constructionRate) || 0;
    const bc = Number(buildCost) || 0;
    const fr = Number(feeRate) || 0;

    if (ls > 0 && formData.basement !== "" && formData.luxuryLevel !== "") {
      let calcBuildArea = 0;
      if (formData.basement === "yes") {
        calcBuildArea = (ls * (rate / 100)) + ls;
      } else {
        calcBuildArea = ls * (rate / 100);
      }

      const calcCostFinish = calcBuildArea * bc;
      const calcSuggestCost = calcCostFinish * (fr / 100);
      const calcTotalCost = calcCostFinish + calcSuggestCost;

      setBuildArea(calcBuildArea);
      setCostFinish(calcCostFinish);
      setSuggestCost(calcSuggestCost);
      setTotalCost(calcTotalCost);
      setShowCalculator(true);
    } else {
      // if missing required fields, hide or keep previous values
      setShowCalculator(false);
    }
  }, [formData.landSize, formData.basement, formData.luxuryLevel, constructionRate, buildCost, feeRate]);

  const [ShowCalculator, setShowCalculator] = useState(false);

  // Provider selection handler (same logic as AddNewForm)
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

  // Generic change handler (matches AddNewForm)
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "notes") {
      if (value.length > NOTES_LIMIT) return;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));

    // extra behaviours already handled by effects (luxuryLevel, projectType)
  };

  // Services options for react-select
  const serviceOptions = servicesList.map((ser) => ({
    value: ser.id,
    label: ser.name,
  }));

  // Submit updated project (PUT)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // validate same as AddNewForm
    let newErrors: any = {};
    if (!formData.title?.trim()) newErrors.title = "error";
    if (!formData.projectType) newErrors.projectType = "error";
    if (!formData.location?.trim()) newErrors.location = "error";
    if (!formData.landSize?.trim()) newErrors.landSize = "error";
    if (!formData.luxuryLevel) newErrors.luxuryLevel = "error";
    if (!formData.services || formData.services.length === 0) newErrors.services = "error";
    if (!formData.basement) newErrors.basement = "error";
    if (!formData.listingStyle) newErrors.listingStyle = "error";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Build payload following same naming AddNewForm uses
    const payload: any = {
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
      build_area: BuildArea,
      cost_finsh: CostFinish,
      suggest_cost: SuggestCost,
      total_cost: TotalCost,
    };

    try {
      const res = await fetch(`${API_URL}/users/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Update response:", data);

      if (!res.ok) throw new Error(data.error || "Failed to update project");

      setSubmittedMessage(true);
      setTimeout(() => setSubmittedMessage(false), 4000);

      // redirect to details page
      router.push(`/user/project-details/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update project");
    }
  };

  // Render loading or not found
  if (loading) return <p>Loading...</p>;
  // formData may initially be empty, but we guard

  return (
    <div className="add-newformouter">
      <div className="det-intro1" style={{ marginBottom: 20 }}>
        <button onClick={() => router.back()}>
          <Image src={arrow} alt="back" width={40} height={40} />
        </button>
        <h2>Edit Project</h2>
      </div>

      <form className="addproject-form" onSubmit={handleSubmit}>
        {submittedMessage && (
          <div className="contact-success">
            <p style={{ color: "green" }}>Project updated successfully</p>
          </div>
        )}

        {/* TITLE */}
        <div className="form-grp">
          <label>Title</label>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => {
              handleChange(e);
              setErrors((p: any) => ({ ...p, title: "" }));
            }}
            className={`forminput ${errors.title ? "warnning-msg" : ""}`}
          />
        </div>

        {/* NOTES */}
        <div className="form-grp">
          <label>Notes</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Add notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <small>Brief description for your profile. URLs are hyperlinked.</small>
            <small style={{ fontSize: 12, color: "#666" }}>
              {NOTES_LIMIT - (formData.notes?.length || 0)} characters left
            </small>
          </div>
        </div>

        {/* PROJECT TYPE */}
        <div className="form-grp">
          <label>Project Type</label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={(e) => {
              handleChange(e);
              setErrors((p: any) => ({ ...p, projectType: "" }));
            }}
            className={`forminput ${errors.projectType ? "warnning-msg" : ""}`}
          >
            <option value="">Select Project Type</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div className="form-grp">
          <label>Location</label>
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => {
              handleChange(e);
              setErrors((p: any) => ({ ...p, location: "" }));
            }}
            className={`forminput ${errors.location ? "warnning-msg" : ""}`}
          />
        </div>

        {/* LAND SIZE */}
        <div className="form-grp">
          <label>Land size</label>
          <input
            name="landSize"
            placeholder="Land Size"
            value={formData.landSize}
            onChange={(e) => {
              handleChange(e);
              setErrors((p: any) => ({ ...p, landSize: "" }));
            }}
            className={`forminput ${errors.landSize ? "warnning-msg" : ""}`}
          />
        </div>

        {/* LUXURY LEVEL */}
        <div className="form-grp">
          <label>Luxury level</label>
          <select
            name="luxuryLevel"
            value={formData.luxuryLevel}
            onChange={(e) => {
              handleChange(e);
              setErrors((p: any) => ({ ...p, luxuryLevel: "" }));
            }}
            className={`forminput ${errors.luxuryLevel ? "warnning-msg" : ""}`}
          >
            <option value="">Select Luxury Level</option>
            {designLevels.map((des: any) => (
              <option key={des.id} value={des.id}>
                {des.name}
              </option>
            ))}
          </select>
        </div>

        {/* SERVICES (multi) */}
       <div className="form-grp">
  <label>Select Services</label>

  <Select
    isMulti
    name="services"
    options={serviceOptions}

    // ✅ Correct selected values binding
    value={serviceOptions.filter((opt) =>
      (formData.services || []).map(Number).includes(opt.value)
    )}

    // ✅ Updates form correctly with numbers
    onChange={(selected: any) => {
      const selectedValues = selected.map((item: any) => Number(item.value));

      setFormData((prev: any) => ({
        ...prev,
        services: selectedValues,
      }));

      setErrors((p: any) => ({
        ...p,
        services: "",
      }));
    }}

    className={`forminput ${errors.services ? "warnning-msg" : ""}`}
    classNamePrefix="react-select"
  />
</div>


        {/* construction Budget */}
        <div className="form-grp">
          <label>construction Budget</label>
          <input
            name="constructionBudget"
            placeholder="$150, 000"
            value={formData.constructionBudget}
            onChange={(e) => setFormData((p:any) => ({ ...p, constructionBudget: e.target.value }))}
          />
        </div>

        {/* BASEMENT */}
        <div className={`radio-group ${errors.basement ? "warnning-msg" : ""}`}>
          <h5>Do you have a Basement?</h5>
          <div className="radio-row">
            <div className="radio-col">
              <label className="radio-option">
                <input type="radio" name="basement" value="yes" onChange={handleChange} checked={formData.basement === "yes"} />
                <span className="radio-custom"></span>
                Yes
              </label>
            </div>
            <div className="radio-col">
              <label className="radio-option">
                <input type="radio" name="basement" value="no" onChange={handleChange} checked={formData.basement === "no"} />
                <span className="radio-custom"></span>
                No
              </label>
            </div>
          </div>
          {errors.basement && <p className="error-text">Basement selection is required</p>}
        </div>

        {/* LISTING STYLE & PROVIDERS */}
        <div className={`form-grp listing-styleouter ${errors.listingStyle ? "warnning-msg" : ""}`}>
          <h5>Listing style</h5>
          <div className="listing-style">
            <button
              className={`private-btn ${formData.listingStyle === "private" ? "active" : ""}`}
              type="button"
              onClick={() => {
                setFormData((p:any) => ({ ...p, listingStyle: "private" }));
                setListPrivate(true);
              }}
            >
              Private
            </button>

            <button
              className={`public-btn ${formData.listingStyle === "public" ? "active" : ""}`}
              type="button"
              onClick={() => {
                setFormData((p:any) => ({ ...p, listingStyle: "public" }));
                setListPrivate(false);
              }}
            >
              Public
            </button>
          </div>

          <ul className="listing-ul">
            <li>Public projects will be pushed to all the service providers in the directory</li>
            <li>Private projects will be invite only</li>
          </ul>

          {errors.listingStyle && <p className="error-text">Please select a listing style</p>}

          {ListPrivate && (
            <>
              <div className="proposal-div">
                {Providers.map((company) => (
                  <ProviderCard key={company.id} company={company} isSelected={false} onSelect={handleSelect} />
                ))}
              </div>

              {selectedProviders.length > 0 && (
                <div className="selected-section">
                  <h3>Selected Providers</h3>
                  <div className="proposal-div">
                    {selectedProviders.map((company) => (
                      <ProviderCard key={company.id} company={company} isSelected={true} onSelect={handleSelect} isRemovable />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* SHOW CALCULATOR */}
        {ShowCalculator && (
          <div className="budget-calc">
            <h2>Budget Calculator</h2>
            <div className="budget-calculator">
              <div className="bud-col1">
                <div className="bud-row">
                  <p><strong>Total max buildable area</strong></p>
                  <p><span className="">{Number(BuildArea).toLocaleString()}</span></p>
                </div>

                <div className="bud-row">
                  <p><strong>Cost with finish</strong></p>
                  <p><span className="">{Number(CostFinish).toLocaleString()}</span></p>
                </div>
              </div>

              <div className="bud-col1 bud-col2">
                <div className="bud-row">
                  <p><strong>Design Fee Cost</strong></p>
                  <p><span className="cost-value">{Number(SuggestCost).toLocaleString()}</span> ({feeRate}%)</p>
                </div>

                <div className="bud-row">
                  <p><strong>Total Project Cost</strong></p>
                  <p><span className="">{Number(TotalCost).toLocaleString()}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="create-btn-container" style={{ marginTop: 20 }}>
          <button className="create-btn invite-btn" type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
