// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { API_URL } from "@/config"; // make sure API_URL is set to your backend

// export default function ServicesPage() {
//   const [Services, setServices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [newService, setNewService] = useState("");
//   const [editingService, setEditingService] = useState(null);
//   const [editingName, setEditingName] = useState("");

//   // Fetch Services
//   const fetchServices = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/services`);
//       setServices(res.data);
//     } catch (error) {
//       console.error(error);
//       setMessage("❌ Failed to fetch Services");
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   // Create Service
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!newService.trim()) return;
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/Services`, { name: newService });
//       setServices([...Services, res.data]);
//       setMessage("✅ Service created successfully");
//       setNewService("");
//     } catch (error) {
//       console.error(error);
//       if (error.response?.status === 409) {
//         setMessage("❌ Service already exists");
//       } else {
//         setMessage("❌ Failed to create Service");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Service
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this Service?")) return;
//     try {
//       await axios.delete(`${API_URL}/Services/${id}`);
//       setServices(Services.filter((ser) => ser.id !== id));
//       setMessage("✅ Service deleted successfully");
//     } catch (error) {
//       console.error(error);
//       setMessage("❌ Failed to delete Service");
//     }
//   };

//   // Update Service
//   const handleUpdate = async (id) => {
//     if (!editingName.trim()) return;
//     setLoading(true);
//     try {
//       const res = await axios.put(`${API_URL}/Services/${id}`, { name: editingName });
//       setServices(Services.map((ser) => (ser.id === id ? res.data : ser)));
//       setMessage("✅ Service updated successfully");
//       setEditingService(null);
//       setEditingName("");
//     } catch (error) {
//       console.error(error);
//       setMessage("❌ Failed to update Service");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg">
//       <h1 className="text-2xl font-semibold mb-6 text-center">Services</h1>

//       {/* Create Service */}
//       <form onSubmit={handleCreate} className="mb-6">
//         <div className="form-grp mb-4">
//           <label className="block font-medium mb-2 text-gray-700">Service Name</label>
//           <input
//             type="text"
//             className="w-full border rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Add new Service"
//             value={newService}
//             onChange={(e) => setNewService(e.target.value)}
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className={`btn w-full py-2 rounded text-white ${
//             loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
//           }`}
//         >
//           {loading ? "Saving..." : "Add Service"}
//         </button>
//       </form>

//       {/* List Services */}
//       <ul className="space-y-4">
//         {Services.map((ser) => (
//           <li key={ser.id} className="flex justify-between items-center p-4 border rounded shadow-sm hover:bg-gray-50">
//             {editingService === ser.id ? (
//               <>
//                 <input
//                   type="text"
//                   className="border rounded px-2 py-1 flex-1 mr-2"
//                   value={editingName}
//                   onChange={(e) => setEditingName(e.target.value)}
//                 />
//                 <button
//                   onClick={() => handleUpdate(ser.id)}
//                   className="btn-delete"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setEditingService(null)}
//                   className="btn-delete"
//                 >
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <>
//                 <span className="text-lg font-medium">{ser.name}</span>
//                 <div className="space-x-2">
//                   <button
//                     onClick={() => {
//                       setEditingService(ser.id);
//                       setEditingName(ser.name);
//                     }}
//                     className="btn-delete"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(ser.id)}
//                     className="btn-delete"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>

//       {/* Message */}
//       {message && (
//         <p className={`mt-4 text-center text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
//           {message}
//         </p>
//       )}
//     </div>
//   );
// }






"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config"; // your API url

export default function ServicesPage() {
  const [Services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newService, setNewService] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [editingName, setEditingName] = useState("");

  // For delete confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

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
      const res = await axios.post(`${API_URL}/services`, { name: newService });
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

  // Show confirmation popup before delete
  const handleDeleteClick = (id: number) => {
    setSelectedServiceId(id);
    setShowConfirm(true);
  };

  // Confirm and delete
  const confirmDelete = async () => {
    if (!selectedServiceId) return;
    try {
      await axios.delete(`${API_URL}/services/${selectedServiceId}`);
      setServices(Services.filter((ser) => ser.id !== selectedServiceId));
      setMessage("✅ Service deleted successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete Service");
    } finally {
      setShowConfirm(false);
      setSelectedServiceId(null);
    }
  };

  // Update Service
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/services/${id}`, { name: editingName });
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
                <button onClick={() => handleUpdate(ser.id)} className="btn-delete">Save</button>
                <button onClick={() => setEditingService(null)} className="btn-delete">Cancel</button>
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
                  <button onClick={() => handleDeleteClick(ser.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this service?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-confirm" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <p className={`mt-4 text-center text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
