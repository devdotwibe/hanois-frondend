"use client";
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";

const Banner = ({ lang }: { lang: string }) => {
  const [token] = useState<string | null>(typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const [text, setText] = useState({
    en: {
      title: "Bringing people and <span>professionals together</span>",
      desc: "An awesome & powerful tool for your business — increase business revenue with enterprise-grade links built to acquire and engage customers.",
      placeholder: "Search for a Service provider",
      button: "Search",
    },
    ar: {
      title: "<span>جمع الناس</span> والمحترفين معًا",
      desc: "أداة قوية ورائعة لعملك — قم بزيادة إيرادات عملك باستخدام روابط احترافية مصممة لجذب العملاء والتفاعل معهم.",
      placeholder: "ابحث عن مقدم الخدمة",
      button: "بحث",
    },
  });

  const t = lang === "ar" ? text.ar : text.en;

  console.log("Current language:", lang);

  return (
    <div className={`banner-wrapp ${lang === "ar" ? "rtl" : ""}`}>
      <div className="containers">
        <div className="banner-div">
          <div dangerouslySetInnerHTML={{ __html: t.title }} />

          <div className={`search-container ${token ? "active-search" : "disabled"}`}>
            <input
              type="text"
              placeholder={t.placeholder}
              disabled={!token}
              dir={lang === "ar" ? "rtl" : "ltr"}
            />
            <button
              className={`btn-sec-home ${token ? "active-btn" : "disabled-btn"}`}
            >
              {t.button}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
