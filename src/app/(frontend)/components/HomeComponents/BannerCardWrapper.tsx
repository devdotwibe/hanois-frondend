"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BannerCards from "../ReusableComponents/Cards/BannerCards";
import { API_URL, IMG_URL } from "@/config";


interface BannerItem {
  id: number;
  heading1: string;
  heading2: string;
  heading3: string;
  image1?: string;
  image2?: string;
  image3?: string;
  language: string;
}

interface BannerApiResponse {
  success: boolean;
  message: string;
  data: {
    banners: BannerItem[];
    count: number;
  };
}

const BannerCardWrapper = ({ lang = "en" }: { lang?: string }) => {
  const [headings, setHeadings] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<BannerApiResponse>(`${API_URL}banner`);
        const banners = res.data.data?.banners || [];

        // Find banner matching selected language
        const selectedLang = banners.find(
          (b) => (b.language || "").trim().toLowerCase() === lang
        );

        if (selectedLang) {
          // ✅ Extract headings
          const validHeadings = [
            selectedLang.heading1,
            selectedLang.heading2,
            selectedLang.heading3,
          ].filter(Boolean);
          setHeadings(validHeadings);

          // ✅ Extract and fix image URLs
        const baseURL = IMG_URL;

          const validImages = [
            selectedLang.image1,
            selectedLang.image2,
            selectedLang.image3,
          ]
            .filter(Boolean)
            .map((img) =>
              img.startsWith("http") ? img : `${baseURL}${img}`
            );

          setImages(validImages);
        }
      } catch (err) {
        console.error("❌ Error fetching banner data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, [lang]);

  if (loading) return <div className="blue-card">Loading...</div>;

  return (
    <div className="blue-card">
      {headings.map((title, index) => (
        <BannerCards
          key={index}
          title1={title}
          imageSrc={images[index] || "/images/placeholder.jpg"} // fallback if missing
        />
      ))}
    </div>
  );
};

export default BannerCardWrapper;
