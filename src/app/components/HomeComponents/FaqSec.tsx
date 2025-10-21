
"use client";
import { useState } from "react";

const faqData = [
  {
    question: "How Does Yoora CRM Compare To The Competition?",
    answer:
      "Yoora CRM offers the most affordable, comprehensive platform to manage the entire customer journey, from generating leads, to closing deals and supporting your customers. With a full suite of CRM, sales enablement, marketing automation, and help desk/customer support capabilities, it's all you need to manage the entire customer lifecycle. Most of our competitors offer one or two of these functions as separate products, leaving you with the headache of integrating them and increasing the overall price point.",
  },
  {
    question: "Can I Change Plans Or Cancel My Subscription At Any Time?",
    answer:
      "Yoora CRM offers the most affordable, comprehensive platform to manage",
    linkText: "Explore our web development services",
  },
  {
    question: "How Secure Is My Data With?",
    answer:
      "Yoora CRM offers the most affordable, comprehensive platform to manage",
    linkText: "Explore our brand identity services",
  },
  {
    question: "What Is The Uptime Guarantee?",
    answer:
      "Yoora CRM offers the most affordable, comprehensive platform to manage",
  },
  {
    question: "How Can I Get My Money Back?",
    answer:
      "Yoora CRM offers the most affordable, comprehensive platform to manage",
    linkText: "Explore our hosting & support services",
  },
];

export default function FaqSec() {
  // ✅ default to first item open (index 0)
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">

      <div className="containers">

        <h3>Frequently asked <span>questions</span></h3>
         <div className="faq-container">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <button className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.question}
              <span className="icon">{activeIndex === index ? "–" : "+"}</span>
            </button>

            <div
              className="faq-answer"
              style={{
                maxHeight: activeIndex === index ? "500px" : "0",
                padding: activeIndex === index ? "10px 0" : "0",
              }}
            >
              <p>{faq.answer}</p>
              
            </div>
          </div>
        ))}
      </div>


      </div>




    </section>
  );
}
