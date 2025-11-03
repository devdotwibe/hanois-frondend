"use client";
import { useState } from "react";

export default function FaqSec({ lang }: { lang: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const text = {
    en: {
      title1: "Frequently asked",
      title2: "questions",
      faqData: [
        {
          question: "How Does Yoora CRM Compare To The Competition?",
          answer:
            "Yoora CRM offers the most affordable, comprehensive platform to manage the entire customer journey, from generating leads, to closing deals and supporting your customers. With a full suite of CRM, sales enablement, marketing automation, and help desk/customer support capabilities, it's all you need to manage the entire customer lifecycle. Most competitors only offer one or two of these features as separate products.",
        },
        {
          question: "Can I Change Plans Or Cancel My Subscription At Any Time?",
          answer:
            "Yes! You can easily upgrade, downgrade, or cancel your Yoora CRM plan anytime directly from your account settings.",
        },
        {
          question: "How Secure Is My Data?",
          answer:
            "Your data is encrypted in transit and at rest. Yoora CRM uses industry-standard security protocols to ensure the safety of your business information.",
        },
        {
          question: "What Is The Uptime Guarantee?",
          answer:
            "Yoora CRM provides a 99.9% uptime guarantee with robust cloud infrastructure to ensure uninterrupted service.",
        },
        {
          question: "How Can I Get My Money Back?",
          answer:
            "If you are not satisfied within the first 30 days, you can request a full refund — no questions asked.",
        },
      ],
    },

    ar: {
      title1: "الأسئلة",
      title2: "الشائعة",
      faqData: [
        {
          question: "كيف يقارن Yoora CRM بالمنافسين؟",
          answer:
            "يوفر Yoora CRM منصة شاملة وبأسعار معقولة لإدارة رحلة العميل بأكملها — من إنشاء العملاء المحتملين إلى إتمام الصفقات ودعم العملاء. يتيح لك النظام مجموعة متكاملة من أدوات CRM والأتمتة التسويقية ودعم العملاء لتبسيط جميع مراحل التعامل مع العميل.",
        },
        {
          question: "هل يمكنني تغيير الخطة أو إلغاء الاشتراك في أي وقت؟",
          answer:
            "نعم! يمكنك بسهولة ترقية أو تخفيض أو إلغاء خطة Yoora CRM الخاصة بك في أي وقت من إعدادات الحساب.",
        },
        {
          question: "ما مدى أمان بياناتي؟",
          answer:
            "يتم تشفير بياناتك أثناء الإرسال والتخزين. يستخدم Yoora CRM بروتوكولات أمان قياسية في الصناعة لحماية معلومات عملك.",
        },
        {
          question: "ما هو ضمان وقت التشغيل؟",
          answer:
            "يضمن Yoora CRM وقت تشغيل بنسبة 99.9٪ بفضل البنية التحتية السحابية القوية لضمان خدمة مستمرة دون انقطاع.",
        },
        {
          question: "كيف يمكنني استرداد أموالي؟",
          answer:
            "إذا لم تكن راضيًا خلال أول 30 يومًا، يمكنك طلب استرداد كامل للمبلغ — دون أي أسئلة.",
        },
      ],
    },
  };

  const t = lang === "ar" ? text.ar : text.en;

  return (
    <section className={`faq-section ${lang === "ar" ? "rtl" : ""}`}>
      <div className="containers">
        <h3>
          {t.title1} <span>{t.title2}</span>
        </h3>

        <div className="faq-container">
          {t.faqData.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFaq(index)}
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {faq.question}
                <span className="icon">{activeIndex === index ? "–" : "+"}</span>
              </button>

              <div
                className="faq-answer"
                style={{
                  maxHeight: activeIndex === index ? "500px" : "0",
                  padding: activeIndex === index ? "10px 0" : "0",
                }}
                dir={lang === "ar" ? "rtl" : "ltr"}
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
