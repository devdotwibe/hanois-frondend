"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config"; // make sure API_URL is set to your backend

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
    <div className="mx-auto p-6 max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>

      {/* Create category */}
      <form onSubmit={handleCreate} className="login-form">
                <div className="mb-4 form-grp">

             <label className="block font-medium mb-2">
            Category
          </label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
                </div>

        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Saving..." : "Add Category"}
        </button>
      </form>

      {/* List categories */}
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            {editingCategory === cat.id ? (
              <>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1 mr-2"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <div className="space-x-1">
                  <button
                    onClick={() => {
                      setEditingCategory(cat.id);
                      setEditingName(cat.name);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
