"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BuildCard from "./BuildCard";
import { IMG_URL } from "@/config"; // optional: define IMG_URL in config if available

const API_URL =
  "https://hanois.dotwibe.com/api/api/page/get?sectionKey=get_listedhandis";

interface HandisCard {
  handistitle: string;
  handisbuttonname: string;
  image: string;
}

const HelpSec: React.FC = () => {
  const [cards, setCards] = useState<HandisCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🟩 Fetch Handis Cards
  useEffect(() => {
    const fetchHandisCards = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(API_URL);
        if (res.data.success && Array.isArray(res.data.data?.cards)) {
          setCards(res.data.data.cards);
        } else {
          setError("⚠️ No cards found");
        }
      } catch (err) {
        console.error("❌ Failed to fetch Handis cards:", err);
        setError("❌ Failed to load Handis section");
      } finally {
        setLoading(false);
      }
    };

    fetchHandisCards();
  }, []);

  // 🟩 Base URL builder (ensures image path works)
  const getFullImageUrl = (imgPath: string) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    // You can define IMG_URL in your config (example: "https://hanois.dotwibe.com/api/")
    return `${IMG_URL || "https://hanois.dotwibe.com/api/"}${imgPath}`;
  };

  return (
    <div className="h-outer">
      <div className="h-div">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading &&
          !error &&
          cards.length > 0 &&
          cards.map((card, idx) => (
            <div className="h-div1" key={idx}>
              <div className="containers">
                <BuildCard
                  imageSrc={getFullImageUrl(card.image)}
                  title1={card.handistitle} // 🟩 HTML string from backend
                  linkText={card.handisbuttonname || "Get Listed"}
                  linkUrl="/"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HelpSec;
