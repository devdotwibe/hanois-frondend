"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "../../(admin)/admin/home/admin-home.css";
import HtmlToggleEditor from "@/app/(admin)/admin/components/HtmlToggleEditor";

// 🟩 FIX 1 — Memoized dynamic import to prevent remounting
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => null,
});

export default function BannerExtrasForm() {

  // 🟩 FIX 2 — Independent states for each text editor
  const [subtitle_en, setSubtitleEn] = useState("");
  const [subdescription_en, setSubDescriptionEn] = useState("");

  const [subtitle_ar, setSubtitleAr] = useState("");
  const [subdescription_ar, setSubDescriptionAr] = useState("");

  const [subheading_en, setSubHeadingEn] = useState("");
  const [buttonname_en, setButtonNameEn] = useState("");

  const [subheading_ar, setSubHeadingAr] = useState("");
  const [buttonname_ar, setButtonNameAr] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  // 🟩 Subdescription editor toolbar
  // 🟩 Fetch banner extras and sub extras
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [extrasRes, subRes] = await Promise.all([
          axios.get(`${API_URL}banner/extras`),
          axios.get(`${API_URL}banner/subextras`),
        ]);

        const extras = extrasRes.data?.data?.extras || {};
        const sub = subRes.data?.data?.subExtras || {};

        // Fill states
        setSubtitleEn(extras.subtitle || "");
        setSubHeadingEn(extras.subheading || "");
        setButtonNameEn(extras.buttonname || "");

        setSubtitleAr(extras.arabicsubtitle || "");
        setSubHeadingAr(extras.arabicsubheading || "");
        setButtonNameAr(extras.arabicbuttonname || "");

        setSubDescriptionEn(sub.subdescription || "");
        setSubDescriptionAr(sub.arabicsubdescription || "");

      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("❌ Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🟩 Save all extras
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await Promise.all([
        axios.put(`${API_URL}banner/update-extras`, {
          subtitle: subtitle_en,
          subheading: subheading_en,
          buttonname: buttonname_en,
          arabicsubtitle: subtitle_ar,
          arabicsubheading: subheading_ar,
          arabicbuttonname: buttonname_ar,
        }),
        axios.put(`${API_URL}banner/update-subextras`, {
          subdescription: subdescription_en,
          subbuttonname: "", // you can add if needed
          arabicsubdescription: subdescription_ar,
          arabicsubbuttonname: "",
        }),
      ]);

      setMessage("✅ Saved successfully!");

    } catch (error) {
      console.error("Save failed:", error);
      setMessage("❌ Error saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="form-section">

        {/* --------------------------------------- */}
        {/* SUBTITLE EDITOR */}
        {/* --------------------------------------- */}
   <HtmlToggleEditor
  label="Subtitle"
  value={subtitle_en}
  onChange={setSubtitleEn}
/>

        <hr />

        {/* --------------------------------------- */}
        {/* SUB DESCRIPTION EDITOR */}
        {/* --------------------------------------- */}
        <HtmlToggleEditor
  label="Sub Description"
  value={subdescription_en}
  onChange={setSubDescriptionEn}
/>


      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
