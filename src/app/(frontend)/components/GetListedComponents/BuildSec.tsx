"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_URL, IMG_URL } from "@/config";

import build3 from "../../../../../public/images/get-listed-3.png";

// 🟩 Corrected interface to match Handis card fields
interface HandisCard {
  handistitle: string;
  handisbuttonname: string;
  image: string;
}

const BuildSec: React.FC = () => {
  const [card, setCard] = useState<HandisCard>({
    handistitle: "",
    handisbuttonname: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastHandisCard = async () => {
      try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_listedhandis`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data?.cards) && json.data.cards.length > 0) {
          // 🟩 Get last (3rd) Handis card
        // Get 3rd card (index 2)
const thirdCard = json.data.cards[2];
setCard(thirdCard);

        }
      } catch (err) {
        console.error("❌ Failed to fetch Handis card", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastHandisCard();
  }, []);

  if (loading) {
    return <p>Loading meaningful section...</p>;
  }

  // 🟩 Build full image URL (in case backend gives relative path)
const imageUrl = card.image?.startsWith("http")
  ? card.image
  : `${IMG_URL}${card.image?.replace(/^\//, "")}`;


  return (
    <div className="build-outer">
      <div className="containers">
        <div className="build1">
          {/* 🧠 Render HTML content from backend (last Handis card) */}
          <div dangerouslySetInnerHTML={{ __html: card.handistitle }} />
        </div>
      </div>

      <div className="build-grad">
        <div className="buildimg-outer">
          {/* 🖼️ Backend image (if available), otherwise fallback */}
          <Image
            src={imageUrl || build3}
            alt="Meaningful section"
            width={900}
            height={492}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default BuildSec;
