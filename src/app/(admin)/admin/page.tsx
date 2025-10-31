// app/(admin)/page.tsx
"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-2xl font-semibold mt-1">1,245</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-semibold mt-1">389</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-sm text-gray-500">Revenue</h3>
          <p className="text-2xl font-semibold mt-1">₹1,20,000</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-sm text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-semibold mt-1">42</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
