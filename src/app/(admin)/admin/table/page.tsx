"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";

interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface Table {
  table: string;
  columns: Column[];
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchTables = async () => {
      try {
        const res = await axios.get(`${API_URL}admin/tables`);
        setTables(res.data.data || []);
      } catch (err) {
        console.error("Error fetching tables:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (!isClient) return null;

  if (loading) return <div className="p-4">Loading database schema...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Database Tables & Schema</h1>
      <div className="space-y-6">
        {tables.map((tbl) => (
          <div key={tbl.table} className="border rounded-lg shadow p-4">
            <h2 className="text-xl font-bold text-blue-600 mb-2">{tbl.table}</h2>

            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Column</th>
                  <th className="border px-2 py-1">Type</th>
                  <th className="border px-2 py-1">Nullable</th>
                  <th className="border px-2 py-1">Default</th>
                </tr>
              </thead>
              <tbody>
                {tbl.columns.map((col) => (
                  <tr key={col.column_name}>
                    <td className="border px-2 py-1">{col.column_name}</td>
                    <td className="border px-2 py-1">{col.data_type}</td>
                    <td className="border px-2 py-1">{col.is_nullable}</td>
                    <td className="border px-2 py-1">{col.column_default || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
