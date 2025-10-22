




// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import flageng from "../../../public/images/eng.png";

// const LanguageSwitcher = () => {
//   const [open, setOpen] = useState(false);
//   const [lang, setLang] = useState("en");

//   const handleLanguageChange = (language: string) => {
//     setLang(language);
//     setOpen(false);

//     if (language === "ar") {
//       document.body.setAttribute("dir", "rtl");
//     } else {
//       document.body.setAttribute("dir", "ltr");
//     }
//   };

//   return (
//     <div className="language-switcher">
//       <button onClick={() => setOpen(!open)} className="lang-btn">
//         <Image src={flageng} alt="English" width={16} height={16} />
//         <span className="lang-text">{lang === "en" ? "Eng" : "عربى"}</span>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="12"
//           height="12"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           className="lang-arrow"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {open && (
//         <div className="lang-dropdown">
//           <button
//             className="lang-option"
//             onClick={() => handleLanguageChange("en")}
//           >
//             <Image src={flageng} alt="English" width={16} height={16} />
//             English
//           </button>

//           <button
//             className="lang-option"
//             onClick={() => handleLanguageChange("ar")}
//           >
//             <Image src={flageng} alt="Arabic" width={16} height={16} />
//             العربية
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LanguageSwitcher;



"use client";
import React, { useState } from "react";
import Image from "next/image";
import flageng from "../../../public/images/eng.png";

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");

  const handleLanguageChange = (language: string) => {
    setLang(language);
    setOpen(false);

    if (language === "ar") {
      document.body.setAttribute("dir", "rtl");
      document.body.classList.add("lan-arabi");
    } else {
      document.body.setAttribute("dir", "ltr");
      document.body.classList.remove("lan-arabi");
    }
  };

  return (
    <div className="language-switcher">
      <button onClick={() => setOpen(!open)} className="lang-btn">
        <Image src={flageng} alt="English" width={16} height={16} />
        <span className="lang-text">{lang === "en" ? "Eng" : "عربى"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="lang-arrow"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="lang-dropdown">
          <button
            className="lang-option"
            onClick={() => handleLanguageChange("en")}
          >
            <Image src={flageng} alt="English" width={16} height={16} />
            English
          </button>

          <button
            className="lang-option"
            onClick={() => handleLanguageChange("ar")}
          >
            <Image src={flageng} alt="Arabic" width={16} height={16} />
            العربية
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

