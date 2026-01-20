import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    onStart: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 border-b-[3px] border-black bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 rounded-full">
                    <Sparkles size={16} className="text-[#00C853]" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-800">Academic Growth Engine</span>
                </div>

                {/* Main Title */}
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                    PICKLE
                    <span className="text-[#00C853]">.</span>
                </h1>

                <p className="text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Don't just read, <span className="text-black bg-[#00C853]/20 px-2">Master.</span><br />
                    학술적 성장을 위한 엔진, 피클
                </p>

                {/* Visual Placeholder for Character Evolution */}
                <div className="relative h-64 w-full max-w-lg mx-auto my-12 flex items-end justify-center gap-8">
                    {/* Lv.0 Novice */}
                    <div className="flex flex-col items-center gap-2 opacity-50">
                        <div className="w-16 h-16 bg-gray-200 border-2 border-black animate-pulse flex items-center justify-center">
                            <span className="text-[10px] font-mono">Lv.0</span>
                        </div>
                        <span className="text-xs font-bold text-gray-400">Novice</span>
                    </div>

                    <ArrowRight className="text-gray-300 mb-6" />

                    {/* Lv.5 Master */}
                    <div className="flex flex-col items-center gap-2 scale-125 transform transition-all duration-500 hover:scale-150">
                        {/* Glowing effect */}
                        <div className="absolute inset-0 bg-[#00C853] blur-3xl opacity-20 rounded-full"></div>
                        <div className="relative w-24 h-24 bg-black border-4 border-[#00C853] flex items-center justify-center shadow-[0_0_20px_rgba(0,200,83,0.5)]">
                            <span className="text-white font-black font-mono">Lv.5</span>
                        </div>
                        <span className="text-sm font-black text-[#00C853]">Master</span>
                    </div>
                </div>

                {/* OTA Button */}
                <button
                    onClick={onStart}
                    className="group relative px-8 py-5 bg-black text-white text-lg font-black tracking-widest uppercase hover:bg-[#00C853] hover:text-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(100,100,100,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                >
                    무료로 시작하기
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00C853]"></span>
                    </span>
                </button>

            </div>
        </section>
    );
};

export default HeroSection;
