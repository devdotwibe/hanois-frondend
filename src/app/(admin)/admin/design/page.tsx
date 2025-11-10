"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config"; // make sure API_URL points to your backend

export default function DesignPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newDesign, setNewDesign] = useState("");
  const [editingDesign, setEditingDesign] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch Designs
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

  // Create Design
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDesign.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/design`, { name: newDesign });
      setDesigns([...designs, res.data]);
      setMessage("✅ Design created successfully");
      setNewDesign("");
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
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete Design");
    }
  };

  // Update Design
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/design/${id}`, { name: editingName });
      setDesigns(designs.map((d) => (d.id === id ? res.data : d)));
      setMessage("✅ Design updated successfully");
      setEditingDesign(null);
      setEditingName("");
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

      {/* Create Design */}
      <form onSubmit={handleCreate} className="mb-6">
        <div className="form-grp mb-4">
          <label className="block font-medium mb-2 text-gray-700">Design Name</label>
          <input
            type="text"
            className="w-full border rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add new Design"
            value={newDesign}
            onChange={(e) => setNewDesign(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`btn w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Saving..." : "Add Design"}
        </button>
      </form>

      {/* List Designs */}
      <ul className="space-y-4">
        {designs.map((d) => (
          <li
            key={d.id}
            className="flex justify-between items-center p-4 border rounded shadow-sm hover:bg-gray-50"
          >
            {editingDesign === d.id ? (
              <>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1 mr-2"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => handleUpdate(d.id)} className="btn-delete">
                  Save
                </button>
                <button onClick={() => setEditingDesign(null)} className="btn-delete">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-lg font-medium">{d.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingDesign(d.id);
                      setEditingName(d.name);
                    }}
                    className="btn-delete"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
