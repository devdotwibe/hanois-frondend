"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://hanois.dotwibe.com/api/api/page/get?sectionKey=get_listedhelp";

const HowHelp = () => {
  const [card, setCard] = useState<{ helptext: string; helpbuttonname: string }>({
    helptext: "",
    helpbuttonname: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🟩 Fetch Help Card Data
  useEffect(() => {
    const fetchHelpCard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(API_URL);

        if (res.data.success && res.data.data?.card) {
          setCard({
            helptext: res.data.data.card.helptext || "",
            helpbuttonname: res.data.data.card.helpbuttonname || "",
          });
        } else {
          setError("⚠️ No help card data found");
        }
      } catch (err) {
        console.error("❌ Failed to fetch help card:", err);
        setError("❌ Failed to load help section");
      } finally {
        setLoading(false);
      }
    };

    fetchHelpCard();
  }, []);

  return (
    <div className="how-help">
      <div className="containers">
        <div className="bg-light">
          {/* 🟩 Loading and Error States */}
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* 🟩 Only render when data is ready */}
          {!loading && !error && (
            <>
              {/* Render HTML content from backend safely */}
              <div
                className="help-text"
                dangerouslySetInnerHTML={{ __html: card.helptext }}
              />

              <button className="g-listed">
                {card.helpbuttonname || "Get Listed"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowHelp;
