"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config"; // make sure API_URL is set to your backend

export default function ServicesPage() {
  const [Services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newService, setNewService] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [showModal, setShowModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);



  // Fetch Services
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/services`);
      setServices(res.data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to fetch Services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Create Service
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newService.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/Services`, { name: newService });
      setServices([...Services, res.data]);
      setMessage("✅ Service created successfully");
      setNewService("");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        setMessage("❌ Service already exists");
      } else {
        setMessage("❌ Failed to create Service");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete Service
const handleDelete = async () => {
  try {
    await axios.delete(`${API_URL}/services/${deleteId}`);
    setServices(Services.filter((ser) => ser.id !== deleteId));
    setMessage("✅ Service deleted successfully");
  } catch (error) {
    console.error(error);
    setMessage("❌ Failed to delete Service");
  } finally {
    setShowModal(false);
    setDeleteId(null);
  }
};

  // Update Service
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/Services/${id}`, { name: editingName });
      setServices(Services.map((ser) => (ser.id === id ? res.data : ser)));
      setMessage("✅ Service updated successfully");
      setEditingService(null);
      setEditingName("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update Service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">Services</h1>

      {/* Create Service */}
      <form onSubmit={handleCreate} className="mb-6">
        <div className="form-grp mb-4">
          <label className="block font-medium mb-2 text-gray-700">Service Name</label>
          <input
            type="text"
            className="w-full border rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add new Service"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`btn w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Saving..." : "Add Service"}
        </button>
      </form>

      {/* List Services */}
      <ul className="space-y-4">
        {Services.map((ser) => (
          <li key={ser.id} className="flex justify-between items-center p-4 border rounded shadow-sm hover:bg-gray-50">
            {editingService === ser.id ? (
              <>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1 mr-2"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button
                  onClick={() => handleUpdate(ser.id)}
                  className="btn-delete"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingService(null)}
                  className="btn-delete"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-lg font-medium">{ser.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingService(ser.id);
                      setEditingName(ser.name);
                    }}
                    className="btn-delete"
                  >
                    Edit
                  </button>
                 <button
  onClick={() => {
    setShowModal(true);
    setDeleteId(ser.id);
  }}
  className="btn-delete"
>
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
        <p className={`mt-4 text-center text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h2 className="text-lg font-semibold mb-4">
        Are you sure you want to delete this Service?
      </h2>

      <div className="flex justify-between gap-4">
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500"
        >
          Yes, Delete
        </button>

        <button
          onClick={() => setShowModal(false)}
          className="w-full bg-gray-300 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}



    </div>


  );
}
