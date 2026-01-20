import React from 'react';
import { User, BrainCircuit, Trophy } from 'lucide-react';

const FeaturesSection: React.FC = () => {
    const features = [
        {
            icon: <User size={40} strokeWidth={1.5} />,
            title: "Character Evolution",
            desc: "6단계 성장 시스템. 지식이 쌓일수록 나의 캐릭터도 함께 진화합니다.",
            bg: "bg-blue-50"
        },
        {
            icon: <BrainCircuit size={40} strokeWidth={1.5} />,
            title: "AI Analysis Engine",
            desc: "AWS Bedrock & Claude 3 Sonnet이 복잡한 논문을 3줄로 즉시 요약합니다.",
            bg: "bg-green-50"
        },
        {
            icon: <Trophy size={40} strokeWidth={1.5} />,
            title: "Mastery System",
            desc: "퀴즈(MCQ)를 통과해야만 인정받는 진짜 지식. EXP를 모아 마스터가 되세요.",
            bg: "bg-yellow-50"
        }
    ];

    return (
        <section className="py-24 px-6 bg-[#f8f9fa] border-b-[3px] border-black">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-4">KEY FEATURES</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest">Why Pickle works</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className={`group relative p-8 border-[3px] border-black bg-white hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                            <div className={`inline-flex p-4 rounded-full border-2 border-black mb-6 ${f.bg} group-hover:scale-110 transition-transform`}>
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-3">{f.title}</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
