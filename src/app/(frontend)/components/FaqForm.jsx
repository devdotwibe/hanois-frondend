"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import "../../(admin)/admin/home/admin-home.css";

export default function FaqForm() {
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    engtitle: "",
    engquestion: "",
    enganswer: "",
    arabtitle: "",
    arabquestion: "",
    arabanswer: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟩 Fetch FAQs on mount
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${API_URL}faq`);
      setFaqs(res.data?.data?.faqs || []);
    } catch (err) {
      console.error("❌ Error fetching FAQs:", err);
      setMessage("❌ Failed to load FAQs.");
    }
  };

  // 🟩 Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟩 Save or Update FAQ
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    let res;

    if (editingId) {
      // 🟩 Update existing FAQ
      res = await axios.put(`${API_URL}faq/${editingId}`, formData);
    } else {
      // 🟩 Create new FAQ
      res = await axios.post(`${API_URL}faq`, formData);
    }

    if (res.status === 200 || res.status === 201) {
      setMessage(editingId ? "✅ FAQ updated successfully!" : "✅ FAQ created successfully!");
      fetchFaqs();

      // Reset form
      setFormData({
        engtitle: "",
        engquestion: "",
        enganswer: "",
        arabtitle: "",
        arabquestion: "",
        arabanswer: "",
      });

      setEditingId(null);
    }
    
  } catch (err) {
    console.error("❌ Error saving FAQ:", err);
    setMessage("❌ Failed to save FAQ.");
  } finally {
    setLoading(false);
  }
};

  // 🟩 Edit FAQ (populate form)
  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setFormData({
      engtitle: faq.title || "",
      engquestion: faq.question || "",
      enganswer: faq.answer || "",
      arabtitle: faq.title || "",
      arabquestion: faq.question || "",
      arabanswer: faq.answer || "",
    });
  };

  // 🟩 Delete FAQ
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await axios.delete(`${API_URL}faq/${id}`);
      setMessage("✅ FAQ deleted successfully!");
      fetchFaqs();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      setMessage("❌ Error deleting FAQ.");
    }
  };

  return (
    <div className="faq-section">
     

      <form onSubmit={handleSubmit} className="faq-form">
        <h3>{editingId ? "Edit FAQ" : "Create New FAQ"}</h3>

        <label>English Title</label>
        <input
          type="text"
          name="engtitle"
          value={formData.engtitle}
          onChange={handleChange}
          required
        />

        <label>English Question</label>
        <textarea
          name="engquestion"
          value={formData.engquestion}
          onChange={handleChange}
          required
        />

        <label>English Answer</label>
        <textarea
          name="enganswer"
          value={formData.enganswer}
          onChange={handleChange}
          required
        />

        <label>Arabic Title</label>
        <input
          type="text"
          className="text-right"
          name="arabtitle"
          value={formData.arabtitle}
          onChange={handleChange}
         
        />

        <label>Arabic Question</label>
        <textarea
          className="text-right"
          name="arabquestion"
          value={formData.arabquestion}
          onChange={handleChange}
         
        />

        <label>Arabic Answer</label>
        <textarea
          className="text-right"
          name="arabanswer"
          value={formData.arabanswer}
          onChange={handleChange}
          
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update FAQ" : "Create FAQ"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      <hr />

      <h3>Existing FAQs</h3>
      {faqs.length === 0 ? (
        <p>No FAQs found.</p>
      ) : (
        <table className="faq-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td>{faq.id}</td>
                <td>{faq.title}</td>
                <td>{faq.question}</td>
                <td>{faq.answer}</td>
                <td>
                  <button onClick={() => handleEdit(faq)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(faq.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
