"use client";
import React, { useEffect, useState } from "react";
import BusinessCard from "../ReusableComponents/Cards/BusinessCard";
import { API_URL } from "@/config";

// 🖼️ Static images (unchanged)
import image1 from "../../../../../public/images/lead.png";
import image2 from "../../../../../public/images/grow.png";
import image3 from "../../../../../public/images/support.png";

// Type for cards fetched from API
interface CardData {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
}

interface Props {
  lang: "en" | "ar";
}

const ListCards: React.FC<Props> = ({ lang }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch banner card data from API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_banner_cards`);
        const json = await res.json();

        if (json.success && json.data?.cards) {
          setCards(json.data.cards);
        }
      } catch (err) {
        console.error("❌ Failed to fetch banner cards", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <p>Loading cards...</p>;

  // 🗂️ Static image list in same order as cards
  const imageList = [image1, image2, image3];

  return (
    <div className="ch-col">
      <div className="containers">
        <div className="business-div21">
          {cards.map((card, index) => {
            // Extract <span> text for nice title formatting
            const [title1, spanText] = extractTitleParts(
              lang === "ar" ? card.title_ar : card.title_en
            );

            return (
              <BusinessCard
                key={index}
                title1={title1}
                spanText={spanText}
                discption={
                  lang === "ar" ? card.content_ar || "" : card.content_en || ""
                }
                imageSrc={imageList[index]} // ✅ Use static local image
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper: Split title into normal + <span> text
function extractTitleParts(titleHtml: string): [string, string] {
  if (!titleHtml) return ["", ""];
  const spanMatch = titleHtml.match(/<span[^>]*>(.*?)<\/span>/i);
  const spanText = spanMatch ? spanMatch[1] : "";
  const titlePart = titleHtml.replace(/<span[^>]*>.*?<\/span>/i, "").trim();
  return [titlePart, spanText];
}

export default ListCards;
