"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function FaqSec({ lang }: { lang: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [faqData, setFaqData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Fetch FAQ data from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://hanois.dotwibe.com/api/api/faq");
        const allFaqs = res.data?.data?.faqs || [];

        // Filter by selected language
        const filteredFaqs = allFaqs.filter(
          (faq: any) => faq.language?.toLowerCase() === lang.toLowerCase()
        );

        // Remove empty items
        const cleanedFaqs = filteredFaqs.filter(
          (faq: any) =>
            faq.question?.trim() !== "" && faq.answer?.trim() !== ""
        );

        setFaqData(cleanedFaqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [lang]);

  const text = {
    en: {
      title1: "Frequently asked",
      title2: "questions",
    },
    ar: {
      title1: "الأسئلة",
      title2: "الشائعة",
    },
  };

  const t = lang === "ar" ? text.ar : text.en;

  return (
    <section className={`faq-section ${lang === "ar" ? "rtl" : ""}`}>
      <div className="containers">
        <h3>
          {t.title1} <span>{t.title2}</span>
        </h3>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading FAQs...</p>
        ) : faqData.length === 0 ? (
          <p style={{ textAlign: "center" }}>No FAQs available.</p>
        ) : (
          <div className="faq-container">
            {faqData.map((faq, index) => (
              <div
                key={faq.id || index}
                className={`faq-item ${activeIndex === index ? "active" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <div  className="faq-question1"
                    dangerouslySetInnerHTML={{
                      __html: faq.question,
                    }}
                  />
                  <span className="icon">
                    {activeIndex === index ? "–" : "+"}
                  </span>
                </button>

                <div
                  className="faq-answer"
                  style={{
                    maxHeight: activeIndex === index ? "500px" : "0",
                    padding: activeIndex === index ? "10px 0" : "0",
                  }}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: faq.answer,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
