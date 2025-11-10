"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { API_URL } from "@/config";
import "react-quill-new/dist/quill.snow.css";
import "../../(admin)/admin/home/admin-home.css";

// 🟩 Dynamically import ReactQuill (avoids SSR issues)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function FaqForm() {
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    engtitle: "",
    engquestion: "",
    enganswer: "",
    arabtitle: "",
    arabquestion: "",
    arabanswer: "",
      order: "1",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSourceQuestion, setShowSourceQuestion] = useState(false);
  const [showSourceAnswer, setShowSourceAnswer] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);


  // 🧠 Quill Toolbar Configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
          ["codeView"], // custom Source button
        ],
        handlers: {
          codeView: function () {
            // Handled per editor separately
          },
        },
      },
    }),
    []
  );

  // 🟢 Add custom Source icon for toolbar
  useEffect(() => {
    if (typeof window !== "undefined" && window.Quill) {
      const Quill = window.Quill;
      const icons = Quill.import("ui/icons");
      icons["codeView"] = `
        <svg viewBox="0 0 18 18">
          <polyline class="ql-even" points="5 7 3 9 5 11"></polyline>
          <polyline class="ql-even" points="13 7 15 9 13 11"></polyline>
          <line class="ql-even" x1="10" x2="8" y1="5" y2="13"></line>
        </svg>`;
    }
  }, []);

  // 🟩 Fetch FAQs on mount
  useEffect(() => {
    fetchFaqs();
  }, []);

const fetchFaqs = async () => {
  try {
    const res = await axios.get(`${API_URL}faq`);
    const allFaqs = res.data?.data?.faqs || [];

    // ✅ Filter only English FAQs
    const englishFaqs = allFaqs.filter(
      (faq) => (faq.language || "").trim().toLowerCase() === "en"
    );

    setFaqs(englishFaqs);
  } catch (err) {
    console.error("❌ Error fetching FAQs:", err);
    setMessage("❌ Failed to load FAQs.");
  }
};


  // 🟩 Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

const faqData = {
  engtitle: formData.engtitle,
  engquestion: formData.engquestion,
  enganswer: formData.enganswer,
  arabtitle: formData.arabtitle,
  arabquestion: formData.arabquestion,
  arabanswer: formData.arabanswer,
   order: parseInt(formData.order), 
};

  try {
let res;
if (editingId) {
  res = await axios.put(`${API_URL}faq/${editingId}`, {
    title: formData.engtitle,          // ✅ match DB column
    question: formData.engquestion,    // ✅ match DB column
    answer: formData.enganswer,        // ✅ match DB column
     order: parseInt(formData.order),  
  });
} else {
  res = await axios.post(`${API_URL}faq`, faqData);
}


    if (res.status === 200 || res.status === 201) {
      setMessage(editingId ? "✅ FAQ updated successfully!" : "✅ FAQ created successfully!");
      fetchFaqs();
     setFormData({
    engtitle: "",
    engquestion: "",
    enganswer: "",
    arabtitle: "",
    arabquestion: "",
    arabanswer: "",
    order: "1",
  });
    setShowSourceQuestion(false);
  setShowSourceAnswer(false);
      setEditingId(null);
    }
  } catch (err) {
    console.error("❌ Error saving FAQ:", err);
    setMessage("❌ Failed to save FAQ.");
  } finally {
    setLoading(false);
  }
};

  // 🟩 Edit FAQ
  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setFormData({
      engtitle: faq.title || "",
      engquestion: faq.question || "",
      enganswer: faq.answer || "",
      arabtitle: faq.title || "",
      arabquestion: faq.question || "",
      arabanswer: faq.answer || "",
        order: faq.order ? faq.order.toString() : "1",
    });
  };

  // 🟩 Delete FAQ
const handleDelete = (id) => {
  setDeleteId(id);
  setShowDeleteModal(true); // 🟩 Open modal
};

const confirmDelete = async () => {
  try {
    await axios.delete(`${API_URL}faq/${deleteId}`);
    setMessage("✅ FAQ deleted successfully!");
    fetchFaqs();
  } catch (err) {
    console.error("❌ Delete failed:", err);
    setMessage("❌ Error deleting FAQ.");
  } finally {
    setShowDeleteModal(false);
    setDeleteId(null);
  }
};

const cancelDelete = () => {
  setShowDeleteModal(false);
  setDeleteId(null);
};

  return (
    <div className="faq-section">
      <form onSubmit={handleSubmit} className="faq-form">
        <h3>{editingId ? "Edit FAQ" : "Create New FAQ"}</h3>

        {/* <label>English Title</label>
        <input
          type="text"
          name="engtitle"
          value={formData.engtitle}
          onChange={handleChange}

        /> */}



<label>Display Order</label>
<select
  name="order"
  value={formData.order}
  onChange={handleChange}
  style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
>
  {Array.from({ length: faqs.length + 1 }, (_, i) => (
    <option key={i + 1} value={i + 1}>
      {i + 1}
    </option>
  ))}
</select>





        {/* 🟩 English Question with ReactQuill */}
        <label>Question</label>
        {showSourceQuestion ? (
          <textarea
            value={formData.engquestion}
            onChange={(e) =>
              setFormData({ ...formData, engquestion: e.target.value })
            }
            style={{
              width: "100%",
              height: "200px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              fontFamily: "monospace",
              backgroundColor: "#1e1e1e",
              color: "#dcdcdc",
            }}
          />
        ) : (
          <ReactQuill
            key={`question-${editingId || "new"}`} 
            theme="snow"
            value={formData.engquestion}
            onChange={(val) => setFormData({ ...formData, engquestion: val })}
            modules={{
              ...modules,
              toolbar: {
                ...modules.toolbar,
                handlers: {
                  codeView: () =>
                    setShowSourceQuestion((prev) => !prev),
                },
              },
            }}
          />
        )}

        {/* 🟩 English Answer with ReactQuill */}
        <label>Answer</label>
        {showSourceAnswer ? (
          <textarea
            value={formData.enganswer}
            onChange={(e) =>
              setFormData({ ...formData, enganswer: e.target.value })
            }
            style={{
              width: "100%",
              height: "200px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              fontFamily: "monospace",
              backgroundColor: "#1e1e1e",
              color: "#dcdcdc",
            }}
          />
        ) : (
          <ReactQuill
           key={`answer-${editingId || "new"}`}
            theme="snow"
            value={formData.enganswer}
            onChange={(val) => setFormData({ ...formData, enganswer: val })}
            modules={{
              ...modules,
              toolbar: {
                ...modules.toolbar,
                handlers: {
                  codeView: () => setShowSourceAnswer((prev) => !prev),
                },
              },
            }}
          />
        )}

        {/* 🟩 Arabic Fields */}
        {/* <label>Arabic Title</label>
        <input
          type="text"
          className="text-right"
          name="arabtitle"
          value={formData.arabtitle}
          onChange={handleChange}
        /> */}

       <div style={{ display: "none" }}>
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
</div>


        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update FAQ" : "Save FAQ"}
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
              
              <th>Order</th> 
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
         <tbody>
  {faqs.map((faq) => (
    <tr key={faq.id}>
      <td>{faq.order}</td>
      <td dangerouslySetInnerHTML={{ __html: faq.question }} />
      <td dangerouslySetInnerHTML={{ __html: faq.answer }} />
      <td>
        <button onClick={() => handleEdit(faq)}>✏️ Edit</button>
        <button onClick={() => handleDelete(faq.id)}>🗑️ Delete</button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}

      {showDeleteModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        width: "350px",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Confirm Delete</h3>
      <p style={{ marginBottom: "20px" }}>
        Are you sure you want to delete this FAQ?
      </p>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button
          onClick={confirmDelete}
          style={{
            background: "#e63946",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Yes, Delete
        </button>
        <button
          onClick={cancelDelete}
          style={{
            background: "#ccc",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}




    </div>
  );
}
