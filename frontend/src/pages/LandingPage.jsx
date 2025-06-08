import FeatureSection from "../components/FeatureSection";
import FooterComponent from "../components/FooterComponent";
import HeroSection from "../components/HeroSection";
import NavBar from "../components/NavBar";


const LandingPage = () => {

    return (
        <div>
            <NavBar />
            <main>
                <HeroSection />
                <FeatureSection />
                <FooterComponent />
            </main>
        </div>
    );
};

export default LandingPage;
