
import Banner from "./components/HomeComponents/Banner";
import BusinessSec from "./components/HomeComponents/BusinessSec";
import FaqSec from "./components/HomeComponents/FaqSec";
import ReadySec from "./components/HomeComponents/ReadySec";

export default function Home() {
  return (
    <div className="home-page">


      <Banner />

      <ReadySec />

      <BusinessSec />

      <FaqSec />


    </div>
  );
}
