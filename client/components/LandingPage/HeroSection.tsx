import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    onStart: () => void;
}

import pixelNight from '../../assets/pixel_night.jpg';
import pickleLogo from '../../assets/logo.png';

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 border-b-[3px] border-black bg-cover bg-center" style={{ backgroundImage: `url(${pixelNight})` }}>
            <div className="absolute inset-0 bg-black/60"></div> {/* Overlay for readability */}

            <div className="relative max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000 z-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-white bg-black/80 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] mb-4">
                    <span className="text-[10px] pixel-font uppercase tracking-widest text-[#00C853]">Academic Growth Engine</span>
                </div>

                {/* Animated Logo */}
                <img
                    src={pickleLogo}
                    alt="Pickle Logo"
                    className="w-32 h-32 mx-auto animate-bounce mb-4"
                />

                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl pixel-font tracking-tighter leading-snug mb-6 text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    PICKLE
                    <span className="text-[#00C853]">.</span>
                </h1>

                <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-12">
                    <span className="pixel-font text-sm md:text-base text-[#00C853]">Don't just read, Master.</span><br />
                    <span className="kr-sans mt-2 block">학술적 성장을 위한 엔진, 피클</span>
                </p>



                {/* OTA Button */}

            </div>
        </section>
    );
};

export default HeroSection;
