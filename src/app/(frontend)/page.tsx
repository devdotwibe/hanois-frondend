
import ArchetectCommunity from "./components/ArchetectCommunity";
import Banner from "./components/HomeComponents/Banner";
import BusinessSec from "./components/HomeComponents/BusinessSec";
import FaqSec from "./components/HomeComponents/FaqSec";
import ReadySec from "./components/HomeComponents/ReadySec";

type Lang = "en" | "ar";

export default function Home() {

   const lang: Lang = "en";

    return (

        <div className={`home-page ${lang === "ar" ? "rtl" : ""}`}>

        <Banner lang={lang} />

        <ReadySec lang={lang} />

        <BusinessSec lang={lang} />

        <ArchetectCommunity />

        <FaqSec lang={lang} />

        </div>
    );
}
