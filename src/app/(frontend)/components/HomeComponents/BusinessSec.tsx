"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import BusinessCard from "../ReusableComponents/Cards/BusinessCard";
import { API_URL } from "@/config";

import image1 from "../../../../../public/images/lead.png";
import image2 from "../../../../../public/images/grow.png";
import image3 from "../../../../../public/images/support.png";

const BusinessSec = ({ lang }: { lang: string }) => {
  const [subDescription, setSubDescription] = useState<string>("");
  const [subButton, setSubButton] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 🟩 Fetch banner data (subdescription & subbuttonname)
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}banner`);
        const banners = res.data?.data?.banners || [];

        // Normalize language key (en/ar)
        const normalize = (l: string) => (l || "").trim().toLowerCase();
        const selected = banners.find(
          (b: any) => normalize(b.language) === lang.toLowerCase()
        );

        if (selected) {
          // Decode escaped HTML if needed
          const parser = new DOMParser();
          const decodedSubDesc =
            parser.parseFromString(selected.subdescription, "text/html").body
              .innerHTML || selected.subdescription;

          setSubDescription(decodedSubDesc);
          setSubButton(selected.subbuttonname || "");
        }
      } catch (err) {
        console.error("❌ Error fetching banner data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, [lang]);

  // 🔹 Fallback text (in case API has empty data)
  const text = {
    en: {
      heading1: "Here's how Handis",
      span1: "can help your",
      span2: "business!",
      paragraph:
        "Build more meaningful and lasting relationships — better understand their needs, identify new opportunities to help, and address any problems faster.",
      button: "Get Started",
      cards: [
        {
          title1: "Lead customers to ",
          spanText: "your business",
          discption:
            "Handis Support helps you provide personalized support when and where customers need it, so customers stay happy.",
          imageSrc: image1,
        },
        {
          title1: "Grow without growing pains",
          discption:
            "Handis is powerful enough to handle the most complex business, yet flexible enough to scale with you as you grow.",
          imageSrc: image2,
        },
        {
          title1: "Support on every",
          spanText: "Step",
          discption:
            "Productive agents are happy agents. Give them all the support tools and information they need to best serve your customers.",
          imageSrc: image3,
        },
      ],
    },

    ar: {
      heading1: "إليك كيف يمكن لـ Handis",
      span1: "أن يساعد",
      span2: "عملك!",
      paragraph:
        "قم ببناء علاقات أكثر معنى واستمرارية — افهم احتياجات عملائك بشكل أفضل، وحدد فرصًا جديدة للمساعدة، وعالج أي مشكلات بشكل أسرع.",
      button: "انضم الآن",
      cards: [
        {
          title1: "اجذب العملاء إلى عملك",
          discption:
            "يساعدك Handis Support على تقديم دعم مخصص عندما وأينما يحتاج العملاء إليه، ليظل العملاء سعداء.",
          imageSrc: image1,
        },
        {
          title1: "نَمُ دون متاعب",
          discption:
            "يتمتع Handis بالقوة الكافية للتعامل مع أكثر الأعمال تعقيدًا، ومع ذلك فهو مرن بما يكفي للتوسع معك أثناء نموك.",
          imageSrc: image2,
        },
        {
          title1: "دعم في كل",
          spanText: "خطوة",
          discption:
            "الموظفون المنتجون هم الموظفون السعداء. امنحهم جميع أدوات الدعم والمعلومات التي يحتاجونها لخدمة عملائك بأفضل شكل.",
          imageSrc: image3,
        },
      ],
    },
  };

  const t = lang === "ar" ? text.ar : text.en;

  return (
    <div className={`business-wrap ${lang === "ar" ? "rtl" : ""}`}>
      <div className="containers">
        <div className="businerr-row">
          <div className="business-div1">
            {/* 🧩 Dynamic or fallback description */}
            {subDescription ? (
              <div
                className="business-div11"
                dangerouslySetInnerHTML={{ __html: subDescription }}
              />
            ) : (
              <>
                <h3>
                  {t.heading1}
                  <span>{t.span1}</span>
                  <span>{t.span2}</span>
                </h3>
                <p>{t.paragraph}</p>
              </>
            )}

            <Link
              href={
                lang === "ar"
                  ? "/serviceprovider/signup?lang=ar"
                  : "/serviceprovider/signup"
              }
              className="get-listed"
            >
              {subButton || t.button}
            </Link>
          </div>

          <div className="business-div2">
            {t.cards.map((item, index) => (
              <BusinessCard
                key={index}
                title1={item.title1}
                spanText={item.spanText}
                discption={item.discption}
                imageSrc={item.imageSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSec;
