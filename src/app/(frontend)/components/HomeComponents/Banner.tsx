import React from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "@/config";

interface BannerData {
  title: string;
  description: string;
  placeholder: string;
  buttonlabel: string;
  language: string;
}

async function getBannerData() {
  const res = await axios.get(`${API_URL}banner`);
  const banners: BannerData[] = res.data?.data?.banners || [];

  return banners;
}

export default async function Banner({ lang }: { lang: string }) {
  const banners = await getBannerData();

  // Normalize and find by language
  const normalize = (l: string) => (l || "").trim().toLowerCase();
  const selected =
    banners.find((b) => normalize(b.language) === lang.toLowerCase()) ||
    banners.find((b) => normalize(b.language) === "en"); // fallback to English

  if (!selected) {
    return (
      <div className="banner-wrapp">
        <div className="containers">
          <div className="banner-div">
            <p>No banner data found.</p>
          </div>
        </div>
      </div>
    );
  }

  const t = {
    title: selected.title || "",
    desc: selected.description || "",
    placeholder: selected.placeholder || "Search...",
    button: selected.buttonlabel || "Search",
  };

  // Token is only accessible client-side, so we use a disabled state
  const token = null;

  return (
    <div className={`banner-wrapp ${lang === "ar" ? "rtl" : ""}`}>
      <div className="containers">
        <div className="banner-div">
          {/* 🧩 Dynamic title */}
          <div dangerouslySetInnerHTML={{ __html: t.title }} />

          {/* 🧩 Search bar */}
          <div
            className={`search-container ${
              token ? "active-search" : "disabled"
            }`}
          >
            <input
              type="text"
              placeholder={t.placeholder}
              disabled={!token}
              dir={lang === "ar" ? "rtl" : "ltr"}
            />

            <button
              className={`btn-sec-home ${
                token ? "active-btn" : "disabled-btn"
              }`}
            >
              {t.button}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
