"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/config";
interface BannerContent {
  title: string;
  content: string;
}

interface Props {
  lang: "en" | "ar";
}

const GetListedBanner: React.FC<Props> = ({ lang }) => {

  const [data, setData] = useState<BannerContent>({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_listed`);
        if (res.ok) {

          const json = await res.json();

          const resp = json?.data;

          setData({
            title: lang === "ar" ? resp.title_ar || "" : resp.title_en || "",
            content: lang === "ar" ? resp.content_ar || "" : resp.content_en || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch banner data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [lang]);

  return (
        <div className='banner-wrapp g-list'>
      <div className="containers">
        <div className="banner-div g-listbanner">

          {/* <h2>Handis can benefit <span> your business</span></h2>
          <p>An awesome & powefull tools for your business, increase business revenue with enterprise- 
            
            grade links built to acquire and engage cutomers.
            </p> */}

          <h2 dangerouslySetInnerHTML={{ __html: data.title }}></h2>
          <p dangerouslySetInnerHTML={{ __html: data.content }}></p>

        </div>
      </div>

    </div>
  )
}

export default GetListedBanner