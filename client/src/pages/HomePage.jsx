
import HeroSection from "../components/UI/HeroSection";
import Navbar from "../components/UI/Navbar";

import HowSkyferWorks from "../components/UI/SkyferWorks";
import SkyferFeaturesGrid from "../components/UI/FeatureGrid";
import WhySkyfer from "../components/UI/WhySkyfer";
import Footer from "../components/UI/Footer";
import Contact from "../components/UI/Contact";
import Testimonial from "../components/UI/Testimonial";
import Plans from "../components/UI/Plan";

const HomePage = () => {
	return (
		<>
			<Navbar />
			<HeroSection />
			<SkyferFeaturesGrid/>
			<WhySkyfer/>
			<HowSkyferWorks />
			<Plans/>
			<Contact />
			<Testimonial/>
			<Footer/>
		</>
	);
};

export default HomePage;
