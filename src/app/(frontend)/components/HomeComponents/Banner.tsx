import React from 'react'

const Banner = ({ lang }: { lang: string }) => {


  const text = {
    en: {
      title: (
        <>
          Bringing people and <span>professionals together</span>
        </>
      ),
      desc: "An awesome & powerful tool for your business — increase business revenue with enterprise-grade links built to acquire and engage customers.",
      placeholder: "Search for a Service provider",
      button: "Search",
    },
    ar: {
      title: (
        <>
          <span>جمع الناس</span> والمحترفين معًا
        </>
      ),
      desc: "أداة قوية ورائعة لعملك — قم بزيادة إيرادات عملك باستخدام روابط احترافية مصممة لجذب العملاء والتفاعل معهم.",
      placeholder: "ابحث عن مقدم الخدمة",
      button: "بحث",
    },
  };

  const t = lang === "ar" ? text.ar : text.en;

  return (
    <div className={`banner-wrapp ${lang === "ar" ? "rtl" : ""}`} >

      <div className="containers">

        <div className="banner-div">

          <h2>{t.title}</h2>

          <p>{t.desc}</p>

            <div className="search-container">

              <input type="text" placeholder={t.placeholder}  dir={lang === "ar" ? "rtl" : "ltr"}/>

              <button>{t.button}</button>

            </div>

        </div>
      </div>

    </div>
  )
}

export default Banner