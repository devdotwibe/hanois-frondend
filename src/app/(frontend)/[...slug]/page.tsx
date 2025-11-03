import Banner from "../components/HomeComponents/Banner";
import BusinessSec from "../components/HomeComponents/BusinessSec";
import FaqSec from "../components/HomeComponents/FaqSec";
import ReadySec from "../components/HomeComponents/ReadySec";

export default function HomePage({ params }: { params: { slug?: string[] } }) {

   const lang = params.slug?.[0] === "ar" ? "ar" : "en";

  return (
    <div className={`home-page ${lang === "ar" ? "rtl" : ""}`}>

      <Banner lang={lang} />

      <ReadySec lang={lang} />

      <BusinessSec lang={lang} />

      <FaqSec lang={lang} />

    </div>
  );
}
