import React from 'react';

interface FooterSectionProps {
    onStart: () => void;
}

const FooterSection: React.FC<FooterSectionProps> = ({ onStart }) => {
    return (
        <footer className="py-20 px-6 bg-white text-center">
            <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight pixel-font">
                    Start your journey of<br />
                    intellectual growth.
                </h2>

                <button
                    onClick={onStart}
                    className="inline-flex items-center gap-2 px-10 py-5 bg-[#00C853] text-black text-lg font-black uppercase tracking-widest border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                    <span className="pixel-font">Start Pickle</span>
                </button>

                <p className="text-[10px] font-bold text-gray-400 mt-12 pixel-font">
                    © 2026 Pickle (Academic Growth Engine). All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default FooterSection;
