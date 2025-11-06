"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create category
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/categories`, { name: newCategory });
      setCategories([...categories, res.data]);
      setMessage("✅ Category created successfully");
      setNewCategory("");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        setMessage("❌ Category already exists");
      } else {
        setMessage("❌ Failed to create category");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      setCategories(categories.filter((cat) => cat.id !== id));
      setMessage("✅ Category deleted successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete category");
    }
  };

  // Update category
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;

    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/categories/${id}`, { name: editingName });
      setCategories(categories.map((cat) => (cat.id === id ? res.data : cat)));
      setMessage("✅ Category updated successfully");
      setEditingCategory(null);
      setEditingName("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 max-w-lg bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Categories</h1>

      {/* Create category */}
      <form onSubmit={handleCreate} className="mb-6">
        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Add New Category</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Saving..." : "Add Category"}
        </button>
      </form>

      {/* List categories */}
      <ul className="space-y-3">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center border border-gray-200 rounded-lg p-3 shadow-sm bg-gray-50"
          >
            {editingCategory === cat.id ? (
              <>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-3 py-1 flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-gray-800 font-medium">{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat.id);
                      setEditingName(cat.name);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
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
        <p
          className={`mt-4 text-center text-sm font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
