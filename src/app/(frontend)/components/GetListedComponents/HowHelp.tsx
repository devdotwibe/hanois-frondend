"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://hanois.dotwibe.com/api/api/page/get?sectionKey=get_listedhandis";

const HowHelp = () => {
  const [card, setCard] = useState<{ handistitle: string }>({
    handistitle: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🟩 Fetch the 4th Handis card
  useEffect(() => {
    const fetchHandisCard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(API_URL);

        if (
          res.data.success &&
          Array.isArray(res.data.data?.cards) &&
          res.data.data.cards.length >= 4
        ) {
          // 🟩 Get 4th card
          const fourthCard = res.data.data.cards[3];
          setCard({
            handistitle: fourthCard.handistitle || "",
          });
        } else {
          setError("⚠️ Fourth Handis card not found");
        }
      } catch (err) {
        console.error("❌ Failed to fetch Handis card:", err);
        setError("❌ Failed to load section");
      } finally {
        setLoading(false);
      }
    };

    fetchHandisCard();
  }, []);

  return (
    <div className="how-help">
      <div className="containers">
        <div className="bg-light">
          {/* 🟩 Loading and Error States */}
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* 🟩 Render when data ready */}
          {!loading && !error && (
            <>
              {/* Render HTML content safely from 4th card */}
              <div
                className="help-text"
                dangerouslySetInnerHTML={{ __html: card.handistitle }}
              />

              {/* 🟩 Static button text */}
              <button className="g-listed">Get Listed</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowHelp;
