"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config"; // make sure API_URL points to your backend

export default function DesignPage() {
  
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [newDesign, setNewDesign] = useState("");
  const [quality, setQuality] = useState("");
  const [buildCost, setBuildCost] = useState("");
  const [feeRate, setFeeRate] = useState("");

  const [editingDesign, setEditingDesign] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingQuality, setEditingQuality] = useState("");
  const [editingCost, setEditingCost] = useState("");
  const [editingRate, setEditingRate] = useState("");


  const [errors, setErrors] = useState({
    newDesign: "",
    quality: "",
    buildCost: "",
    feeRate: "",
  });

    const [formData, setFormData] = useState({
      name: "",
      quality: "",
      cost: "",
      rate: "",
    });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchDesigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/design`);
      setDesigns(res.data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to fetch Designs");
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleCreate = async (e) => {

    e.preventDefault();

      setErrors({
        newDesign: "",
        quality: "",
        buildCost: "",
        feeRate: "",
      });

    
    let valid = true;
    const newErrors = {};

    if (!newDesign.trim()) {
      newErrors.newDesign = "Please enter a Design Name";
      valid = false;
    }

    if (quality === "" || isNaN(quality) || Number(quality) < 0) {
      newErrors.quality = "Enter a valid Quality";
      valid = false;
    }

    if (buildCost === "" || isNaN(buildCost) || Number(buildCost) < 0) {
      newErrors.buildCost = "Enter a valid Build Cost";
      valid = false;
    }

    if (feeRate === "" || isNaN(feeRate) || Number(feeRate) < 0) {
      newErrors.feeRate = "Enter a valid Fee Rate";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_URL}/design`, {

        name: newDesign.trim(),
        quality: Number(quality),
        build_cost: Number(buildCost),
        fee_rate: Number(feeRate),
      });

      setDesigns([...designs, res.data]);

      setMessage("✅ Design created successfully");

      setTimeout(() => setMessage(""), 3000); 
      setNewDesign("");
      setQuality("");
      setBuildCost("");
      setFeeRate("");

    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        setMessage("❌ Design already exists");
      } else {
        setMessage("❌ Failed to create Design");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete Design
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Design?")) return;
    try {
      await axios.delete(`${API_URL}/design/${id}`);
      setDesigns(designs.filter((d) => d.id !== id));
      setMessage("✅ Design deleted successfully");

       setTimeout(() => setMessage(""), 3000); 

    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete Design");
    }
  };


  const handleEdit = (design) => {
    setNewDesign(design.name);
    setQuality(design.quality ?? "");
    setBuildCost(design.build_cost ?? design.cost ?? "");
    setFeeRate(design.fee_rate ?? design.rate ?? "");
    setEditingId(design.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {

      e.preventDefault();

      setErrors({
        newDesign: "",
        quality: "",
        buildCost: "",
        feeRate: "",
      });

      let valid = true;
      const newErrors = {};

      if (!newDesign.trim()) {
        newErrors.newDesign = "Please enter a Design Name";
        valid = false;
      }

      if (quality === "" || isNaN(quality) || Number(quality) < 0) {
        newErrors.quality = "Enter a valid Quality";
        valid = false;
      }

      if (buildCost === "" || isNaN(buildCost) || Number(buildCost) < 0) {
        newErrors.buildCost = "Enter a valid Build Cost";
        valid = false;
      }

      if (feeRate === "" || isNaN(feeRate) || Number(feeRate) < 0) {
        newErrors.feeRate = "Enter a valid Fee Rate";
        valid = false;
      }

      if (!valid) {
        setErrors(newErrors);
        return;
      }

      setLoading(true);
      setMessage("");

      try {
        const res = await axios.put(`${API_URL}/design/${editingId}`, {
          name: newDesign.trim(),
          quality: Number(quality),
          build_cost: Number(buildCost),
          fee_rate: Number(feeRate),
        });

        setDesigns((prev) =>
          prev.map((d) => (d.id === editingId ? res.data : d))
        );

        setMessage("✅ Design updated successfully");
        setTimeout(() => setMessage(""), 3000);

        setNewDesign("");
        setQuality("");
        setBuildCost("");
        setFeeRate("");
        setEditingId(null);
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to update Design");
      } finally {
        setLoading(false);
      }
    };



  return (
    <div className="mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">Designs</h1>

      <form onSubmit={editingId ? handleUpdate : handleCreate} className="mb-6">

          <div className="form-grp mb-4">
            <label className="block font-medium mb-2 text-gray-700">Design Name</label>
            <input
              type="text"
              className="w-full border rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add new Design"
              value={newDesign}
              onChange={(e) => setNewDesign(e.target.value)}
            />

             {errors.newDesign && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }} >{errors.newDesign}</p>}

          </div>

        <div className="form-grp mb-4">
          <label className="block font-medium mb-2 text-gray-700">Quality</label>
          <input
            type="number"
            className="w-full border rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            min="0"
            step="0.01"
          />
          {errors.quality && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }} >{errors.quality}</p>}

        </div>

        <div className="form-grp mb-4">
          <label className="block font-medium mb-2 text-gray-700">Build Cost</label>
          <input
            type="number"
            className="w-full border rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Build Cost"
            value={buildCost}
            onChange={(e) => setBuildCost(e.target.value)}
            min="0"
            step="0.01"
          />
          {errors.buildCost && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.buildCost}</p>}

        </div>

        <div className="form-grp mb-4">
          <label className="block font-medium mb-2 text-gray-700">Fee Rate</label>
          <input
            type="number"
            className="w-full border rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Fee Rate"
            value={feeRate}
            onChange={(e) => setFeeRate(e.target.value)}
            min="0"
            step="0.01"
          />

             {errors.feeRate && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }} >{errors.feeRate}</p>}

        </div>

          <button
            type="submit"
            disabled={loading}
             className={`px-4 py-2 rounded text-white ${
                        editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                      }`}
          >
            {/* {loading ? "Saving..." : "Add Design"} */}
            {editingId ? "Update Design" : "Add Design"}
          </button>

          {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNewDesign("");
                  setQuality("");
                  setBuildCost("");
                  setFeeRate("");
                }}
                className="ml-3 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}

        {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

      </form>


  <div className="admin-table-container">

     <table className="admin-table">

          <thead >
            <tr>
              <th>SI No</th>
              <th>Name</th>
              <th>Quality</th>
              <th>Build Cost</th>
              <th>Fee Rate</th>
              <th >Actions</th>
            </tr>
          </thead>

          <tbody>
            {designs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic border-t"
                >
                  No designs found
                </td>
              </tr>
            ) : (
              designs.map((d, index) => (
                <tr
                  key={d.id}
                  className="hover:bg-blue-50 transition-all duration-150 border-t"
                >

                  <td >{index + 1}</td>

                  <td className="py-3 px-4 font-medium text-gray-800">
                    {d.name ?? "-"}
                  </td>

                  <td >{d.quality ?? "-"}</td>

                  <td >{d.cost ?? d.build_cost ?? "-"}</td>

                  <td >{d.rate ?? d.fee_rate ?? "-"}</td>

                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className="inline-block bg-yellow-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="inline-block bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

    </div>


     
    </div>
  );
}
