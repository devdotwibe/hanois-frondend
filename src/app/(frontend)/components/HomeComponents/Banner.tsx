"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";

interface BannerData {
  title: string;
  description: string;
  placeholder: string;
  buttonlabel: string;
  language: string;
}

const Banner = ({ lang }: { lang: string }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const [text, setText] = useState({
    title: "",
    desc: "",
    placeholder: "",
    button: "",
  });

  // 🟩 Get token (client-side only)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // 🟩 Fetch banner data dynamically
  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      setMessage("");

      try {
        const res = await axios.get(`${API_URL}banner`);
        const banners: BannerData[] = res.data?.data?.banners || [];

        const normalize = (l: string) => (l || "").trim().toLowerCase();
        const selected = banners.find(
          (b) => normalize(b.language) === lang.toLowerCase()
        );

        if (selected) {
          setText({
            title: selected.title || "",
            desc: selected.description || "",
            placeholder: selected.placeholder || "",
            button: selected.buttonlabel || "",
          });
        } else {
          setMessage("⚠️ No banner found for selected language.");
        }
      } catch (err) {
        console.error("❌ Error fetching banner data:", err);
        setMessage("❌ Failed to load banner data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [lang]);

  if (loading) {
    return (
      <div className="banner-wrapp loading">
        <div className="containers">
          <div className="banner-div">
            <p>Loading banner...</p>
          </div>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="banner-wrapp error">
        <div className="containers">
          <div className="banner-div">
            <p>{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`banner-wrapp ${lang === "ar" ? "rtl" : ""}`}>
      <div className="containers">
        <div className="banner-div">
          {/* 🧩 Dynamic Title (supports HTML) */}
          {text.title && (
            <div dangerouslySetInnerHTML={{ __html: text.title }} />
          )}

          {/* 🧩 Description */}
          {text.desc && <p className="banner-desc">{text.desc}</p>}

          {/* 🧩 Search input and button */}
          <div
            className={`search-container ${
              token ? "active-search" : "disabled"
            }`}
          >
            <input
              type="text"
              placeholder={text.placeholder || "Search..."}
              disabled={!token}
              dir={lang === "ar" ? "rtl" : "ltr"}
            />

            <button
              className={`btn-sec-home ${
                token ? "active-btn" : "disabled-btn"
              }`}
            >
              {text.button || "Search"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
