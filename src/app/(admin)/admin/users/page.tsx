"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from '@/config'; 

interface User {
  id: number;
  name: string;
  email: string;
  createdAt:string;
  updatedAt:string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}users`);
       
        const formattedUsers = response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt || "N/A",
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-page">

      <h1 className="admin-title">All Users</h1>

      <p className="admin-subtitle">View and manage all registered users.</p>

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
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  Loading users...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
