"use client";
import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '@/config';

const Banner = ({ lang }: { lang: string }) => {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [text, setText] = useState({
      en: {
        title:"Bringing people and <span>professionals together</span>",
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


  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setMessage("");

        const res = await axios.get(`${API_URL}banner`);
        const banners = res.data?.data?.banners || res.data?.banners || [];
        console.log("📦 Banners fetched:", banners);

        const normalize = (lang: string) => (lang || "").trim().toLowerCase();
        const en = banners.find((b: any) => normalize(b.language) === "en");
        const ar = banners.find((b: any) => normalize(b.language) === "ar");

        setText((prev) => ({
          en: {
            ...prev.en,
            title: en?.engtitle,
            desc: en?.engdescription || prev.en.desc,
          },
          ar: {
            ...prev.ar,
            title: ar?.arabtitle,
            desc: ar?.arabdescription || prev.ar.desc,
          },
        }));
      } catch (err) {

      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const t = lang === "ar" ? text.ar : text.en;

  console.log('ar',lang);

  return (

    <div className={`banner-wrapp ${lang === "ar" ? "rtl" : ""}`} >

      <div className="containers">

        <div className="banner-div">

          <h2 dangerouslySetInnerHTML={{ __html: t.title }} />
           
          <p>
              <span dangerouslySetInnerHTML={{ __html: t.desc }} />
          </p>

            <div className="search-container">

              <input type="text" placeholder={t.placeholder}  dir={lang === "ar" ? "rtl" : "ltr"}/>

              <button>{t.button}</button>

            </div>

        </div>
      </div>

    </div>
  )
}

export default Banner