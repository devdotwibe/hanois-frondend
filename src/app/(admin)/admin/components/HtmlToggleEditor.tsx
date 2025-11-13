"use client";

import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function HtmlToggleEditor({ label = "Content", value, onChange }) {
  const [showSource, setShowSource] = useState(false);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
          ["showHtml"],
        ],
        handlers: {
          showHtml: () => setShowSource((prev) => !prev),
        },
      },
    }),
    []
  );

  return (
    <div className="form-field" style={{ marginBottom: "20px" }}>
    
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontWeight: "bold" }}>{label}</label>
        <button
          type="button"
          onClick={() => setShowSource((prev) => !prev)}
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {showSource ? "Switch to Editor" : "View HTML Source"}
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        {showSource ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: "100%",
              height: "300px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              borderRadius: "6px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          />
        ) : (
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
          />
        )}
      </div>
    </div>
  );
}
