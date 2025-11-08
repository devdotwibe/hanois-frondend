import React from "react";
import axios from "axios";
import Link from "next/link";
import BusinessCard from "../ReusableComponents/Cards/BusinessCard";
import { API_URL, IMG_URL } from "@/config";

interface Card {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  image: string;
}

interface Banner {
  subdescription: string;
  subbuttonname: string;
  language: string;
}

// 🟩 Simple HTML cleanup helper
function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, ""); // remove HTML tags
}

// 🟩 Extract span text if present
function extractSpan(html: string) {
  const spanMatch = html.match(/<span[^>]*>(.*?)<\/span>/i);
  const spanText = spanMatch ? spanMatch[1] : "";
  const plainText = stripHtml(html).replace(spanText, "").trim();
  return { mainTitle: plainText, spanText };
}

// 🟩 Fetch all required data on server
async function getData(lang: string) {
  const [bannerRes, cardRes] = await Promise.all([
    axios.get(`${API_URL}banner`),
    axios.get(`${API_URL}page/get?sectionKey=get_banner_cards`),
  ]);

  const banners: Banner[] = bannerRes.data?.data?.banners || [];
  const cards: Card[] = cardRes.data?.data?.cards || [];

  const normalize = (l: string) => (l || "").trim().toLowerCase();
  const selectedBanner = banners.find(
    (b) => normalize(b.language) === lang.toLowerCase()
  );

  const subDescription = selectedBanner?.subdescription || "";
  const subButton = selectedBanner?.subbuttonname || "";

  return { cards, subDescription, subButton };
}

export default async function BusinessSec({ lang }: { lang: string }) {
  const { cards, subDescription, subButton } = await getData(lang);

  return (
    <div className={`business-wrap ${lang === "ar" ? "rtl" : ""}`}>
      <div className="containers">
        <div className="businerr-row">
          <div className="business-div1">
            {/* 🧩 Description & Button from API */}
            {subDescription && (
              <div
                className="business-div11"
                dangerouslySetInnerHTML={{ __html: subDescription }}
              />
            )}

            {subButton && (
              <Link
                href={
                  lang === "ar"
                    ? "/serviceprovider/signup?lang=ar"
                    : "/serviceprovider/signup"
                }
                className="get-listed"
              >
                {subButton}
              </Link>
            )}
          </div>

          <div className="business-div2">
            {/* 🟩 Dynamic cards */}
            {cards.length > 0 ? (
              cards.map((card, index) => {
                const title =
                  lang === "ar" ? card.title_ar : card.title_en || "";
                const content =
                  lang === "ar" ? card.content_ar : card.content_en || "";
                const imageUrl = card.image
                  ? `${IMG_URL}${card.image}`
                  : "/images/placeholder.png";

                // 🧠 Extract <span> text manually
                const { mainTitle, spanText } = extractSpan(title);

                return (
                  <BusinessCard
                    key={index}
                    title1={mainTitle}
                    spanText={spanText}
                    discption={content}
                    imageSrc={imageUrl}
                  />
                );
              })
            ) : (
              <p className="no-data">No cards available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
