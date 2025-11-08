"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_URL } from "@/config";
import build3 from "../../../../../public/images/get-listed-3.png";

interface MeaningfulCard {
  meaningfull: string;
  image: string;
}

const BuildSec: React.FC = () => {
  const [card, setCard] = useState<MeaningfulCard>({ meaningfull: "", image: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeaningfulCard = async () => {
      try {
        const res = await fetch(`${API_URL}page/get?sectionKey=get_listedmeaningfull`);
        const json = await res.json();

        if (json.success && json.data?.card) {
          setCard(json.data.card);
        }
      } catch (err) {
        console.error("❌ Failed to fetch meaningful card", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeaningfulCard();
  }, []);

  if (loading) {
    return <p>Loading meaningful section...</p>;
  }

  return (
    <div className="build-outer">
      <div className="containers">
        <div className="build1">
          {/* 🧠 Render HTML content from API */}
          <div dangerouslySetInnerHTML={{ __html: card.meaningfull }} />
        </div>
      </div>

      <div className="build-grad">
        <div className="buildimg-outer">
          {/* 🖼️ Static local image (keep this as-is) */}
          <Image src={build3} alt="Meaningful section" width={900} height={492} />
        </div>
      </div>
    </div>
  );
};

export default BuildSec;
