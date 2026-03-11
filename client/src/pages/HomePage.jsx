
import HeroSection from "../components/UI/HeroSection";
import Navbar from "../components/UI/Navbar";

import HowSkyferWorks from "../components/UI/SkyferWorks";
import SkyferFeaturesGrid from "../components/UI/FeatureGrid";
import WhySkyfer from "../components/UI/WhySkyfer";
import Footer from "../components/UI/Footer";
import Contact from "../components/UI/Contact";
import Testimonial from "../components/UI/Testimonial";

const HomePage = () => {
	return (
		<>
			<Navbar />
			<HeroSection />
			<SkyferFeaturesGrid/>
			<WhySkyfer/>
			<HowSkyferWorks />
			<Contact />
			<Testimonial/>
			<Footer/>
		</>
	);
};

export default HomePage;
