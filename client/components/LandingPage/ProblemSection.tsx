import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ProblemSection: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-white border-b-[3px] border-black">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

                {/* Problem */}
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 border-2 border-black text-red-600 font-extrabold text-[10px] pixel-font uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <AlertCircle size={14} /> The Problem
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black leading-tight kr-sans">
                        쌓여가는 논문,<br />
                        <span className="text-gray-300 line-through decoration-[3px] decoration-red-500">읽어도 남지 않는 지식.</span>
                    </h2>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed kr-sans">
                        매일 쏟아지는 최신 연구들. <br />
                        하지만 PDF를 다운로드 받고 나면, <br />
                        어느새 "나중에 읽어야지" 폴더만 무거워지고 있지 않나요?
                    </p>
                </div>

                {/* Solution */}
                <div className="relative bg-gray-50 border-[3px] border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_#00C853]">
                    <div className="absolute -top-6 -right-6 bg-[#00C853] text-black pixel-font text-sm p-4 border-[3px] border-black rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        SOLUTION!
                    </div>

                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3 kr-sans">
                        <CheckCircle2 className="text-[#00C853]" size={32} />
                        <span className="pixel-font">Pickle</span>은 다릅니다.
                    </h3>

                    <ul className="space-y-4 font-bold text-gray-700 kr-sans">
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-black"></span>
                            단순히 읽는 것을 넘어 '마스터'하게 만듭니다.
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-black"></span>
                            게임처럼 캐릭터를 키우며 성취감을 느낍니다.
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-black"></span>
                            AI가 핵심만 쏙쏙, 퀴즈로 확실하게 검증합니다.
                        </li>
                    </ul>
                </div>

            </div>
        </section>
    );
};

export default ProblemSection;
