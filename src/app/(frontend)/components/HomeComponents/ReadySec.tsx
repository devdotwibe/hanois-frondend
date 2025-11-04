import React from 'react'
import Link from 'next/link'
import BannerCardWrapper from './BannerCardWrapper'

const ReadySec = ({ lang }: { lang: string }) => {


  const text = {
    en: {
      title: (
        <>
          Ready to change the way <span>you find services?</span>

        </>
      ),
      desc: (<>Ask about Yoora products, pricing, implementation, or anything else.
        <span>Our highly trained reps are standing by, ready to help.</span></>
      ),

      link_title: "Full access. No credit card required.",
      button: "Sign Up Now",
    },
    ar: {
      title: (
        <>
          <span>جمع الناس</span> والمحترفين معًا
        </>
      ),
      desc: "أداة قوية ورائعة لعملك — قم بزيادة إيرادات عملك باستخدام روابط احترافية مصممة لجذب العملاء والتفاعل معهم.",
      link_title: "ابحث عن مقدم الخدمة",
      button: "بحث",
    },
  };

  const t = lang === "ar" ? text.ar : text.en;

  return (
    <div className='readt-sec'>


      <div className="bg-blue1">
        <div className="containers">
          <div className="cards-wrapp">
            <BannerCardWrapper />
          </div>

        </div>
      </div>

      <div className="bg-dark-blue">
        <div className="containers">
          <div className="ready-div">

            <h3>{t.title}</h3>

            <p>{t.desc}</p>

            <Link href="/signup" className='signup-btn'>{t.button}</Link>
            <h6>{t.link_title}</h6>

          </div>

        </div>

      </div>












    </div>
  )
}

export default ReadySec