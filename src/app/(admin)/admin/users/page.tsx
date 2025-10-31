"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const sampleUsers: User[] = [
      { id: 1, name: "Anas K A", email: "anasfamilyman@gmail.com", role: "Admin", joined: "2024-05-10" },
      { id: 2, name: "Sarah Thomas", email: "sarah@example.com", role: "Editor", joined: "2024-06-21" },
      { id: 3, name: "David Mathew", email: "david@example.com", role: "User", joined: "2024-07-01" },
      { id: 4, name: "Priya Nair", email: "priya@example.com", role: "Moderator", joined: "2024-08-15" },
    ];
    setUsers(sampleUsers);
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
              <th>Role</th>
              <th>Joined</th>
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
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.joined}</td>
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
