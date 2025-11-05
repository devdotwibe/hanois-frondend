"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (

        <div className="admin-dashboard">

          <h1 className="admin-title">Welcome to Admin Dashboard</h1>

            <div className="card-row">
                
                <Link href="/admin/users" className="admin-card">
                  <h3>Manage Users</h3>
                  <p>View and manage user accounts</p>
                </Link>

                <Link href="/admin/settings" className="admin-card">
                  <h3>Settings</h3>
                  <p>Configure system preferences</p>
                </Link>
                
            </div>
        </div>
  );
}
