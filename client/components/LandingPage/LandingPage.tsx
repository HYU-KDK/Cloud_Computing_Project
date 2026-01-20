import React from 'react';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import FeaturesSection from './FeaturesSection';
import JourneySection from './JourneySection';
import FooterSection from './FooterSection';
import { ArrowUp } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="font-sans text-black bg-white">
            <HeroSection onStart={onStart} />
            <ProblemSection />
            <FeaturesSection />
            <JourneySection />
            <FooterSection onStart={onStart} />

            <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all z-50 border-2 border-white"
                aria-label="Scroll to top"
            >
                <ArrowUp size={24} />
            </button>
        </div>
    );
};

export default LandingPage;
