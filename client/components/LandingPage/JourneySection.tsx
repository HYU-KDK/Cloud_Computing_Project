import React from 'react';

const JourneySection: React.FC = () => {
    const steps = [
        { num: "01", title: "Identity", desc: "관심 분야(AI, 물리 등)와 내 학술 레벨을 설정합니다." },
        { num: "02", title: "Reading", desc: "AI가 추천하는 논문을 읽고 핵심 내용을 파악합니다." },
        { num: "03", title: "Evolution", desc: "퀴즈를 풀어 검증하고 캐릭터를 레벨업 시킵니다." },
    ];

    return (
        <section className="py-24 px-6 bg-black text-white border-b-[3px] border-black">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-20 text-[#00C853]">HOW IT WORKS</h2>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-[#222] z-0"></div>

                    {steps.map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-black border-4 border-[#00C853] rounded-full flex items-center justify-center text-3xl font-black text-[#00C853] shadow-[0_0_15px_rgba(0,200,83,0.4)] mb-8">
                                {step.num}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-gray-400 font-medium leading-relaxed max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JourneySection;
