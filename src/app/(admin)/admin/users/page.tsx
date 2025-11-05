"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from '@/config'; 
import '../styles/user-table.css'

interface User {
  id: number;
  name: string;
  email: string;
  createdAt:string;
  updatedAt:string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}users`);
       
        const usersArray = response.data?.data?.users || [];

      const formattedUsers = usersArray.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at || "N/A",
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  const handleDeleteClick = (id: number) => {

    setSelectedUserId(id);
    setShowConfirm(true);

  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to perform this action.");
        return;
      }

      const res = await axios.delete(`${API_URL}users/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.data?.success) {
        setUsers((prev) => prev.filter((user) => user.id !== selectedUserId));
      } else {
        alert(res.data?.error || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    } finally {
      setShowConfirm(false);
      setSelectedUserId(null);
      setLoading(false);
    }
  };


  return (

    <>

      <div className="admin-page">

        <h1 className="admin-title">Seekers</h1>

        <p className="admin-subtitle">View and manage all registered Seekers.</p>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                          className="btn-delete"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                      No Seekers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>    

      {showConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this user?</p>
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn-confirm" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
      )}

    </>
  );
}
