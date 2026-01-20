
import React, { useState, useMemo } from 'react';
import { Gender, AcademicLevel, AppLanguage } from '../types';
import { CATEGORIZED_INTERESTS } from '../constants';
import { Check, ArrowRight, X, Plus, GraduationCap, Flame, Sparkles, ChevronLeft, Globe } from 'lucide-react';
import pickleLogo from '../assets/logo.png';

interface OnboardingProps {
  onComplete: (gender: Gender, interests: string[], level: AcademicLevel, lang: AppLanguage) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [lang, setLang] = useState<AppLanguage>('ko');
  const [gender, setGender] = useState<Gender | null>(null);
  const [level, setLevel] = useState<AcademicLevel | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const t = {
    ko: {
      engine: "학술적 성장을 위한 엔진",
      langSelect: "언어 선택 / Select Language",
      continue: "계속하기",
      identity: "정체성 선택",
      male: "남성",
      female: "여성",
      back: "이전",
      next: "다음",
      levelTitle: "현재 학술적 수준",
      interests: "연구 관심 분야",
      searchPlaceholder: "주제 또는 키워드 검색...",
      start: "퀘스트 시작",
      interestsMin: "최소 3개 이상의 분야를 선택하세요.",
      beginner: "초보자",
      beginnerDesc: "기초적인 핵심 논문 위주로 학습합니다.",
      intermediate: "중급자",
      intermediateDesc: "고전 논문과 최신 동향을 균형 있게 학습합니다.",
      advanced: "상급자",
      advancedDesc: "최첨단 연구 성과와 심화 논문에 집중합니다."
    },
    en: {
      engine: "Academic Growth Engine",
      langSelect: "Select Language",
      continue: "CONTINUE",
      identity: "Select Identity",
      male: "MALE",
      female: "FEMALE",
      back: "BACK",
      next: "NEXT",
      levelTitle: "Academic Level",
      interests: "Research Interests",
      searchPlaceholder: "Search topics or keywords...",
      start: "START QUEST",
      interestsMin: "Select at least 3 interests.",
      beginner: "Beginner",
      beginnerDesc: "Focus on core foundational papers.",
      intermediate: "Intermediate",
      intermediateDesc: "Balanced classics and SOTA.",
      advanced: "Advanced",
      advancedDesc: "Strictly cutting-edge research."
    }
  }[lang];

  const filteredSuggestionsObject = useMemo(() => {
    if (!inputValue.trim()) return {};

    const results: Record<string, string[]> = {};
    const lowerInput = inputValue.toLowerCase();

    Object.entries(CATEGORIZED_INTERESTS).forEach(([category, interests]) => {
      // Filter interests starting with input or matching abbreviation in parentheses
      const matchedInterests = interests.filter(interest => {
        const lowerInterest = interest.toLowerCase();
        // Check if starts with input OR if abbreviation (inside parentheses) starts with input
        return (lowerInterest.startsWith(lowerInput) || lowerInterest.includes(`(${lowerInput}`))
          && !selectedInterests.includes(interest);
      });

      if (matchedInterests.length > 0) {
        results[category] = matchedInterests;
      }
    });

    return results;
  }, [inputValue, selectedInterests]);

  const hasSuggestions = Object.keys(filteredSuggestionsObject).length > 0;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) setSelectedInterests(prev => prev.filter(i => i !== interest));
    else { setSelectedInterests(prev => [...prev, interest]); setInputValue(''); setShowSuggestions(false); }
  };

  const levels: { id: AcademicLevel; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'beginner', label: t.beginner, desc: t.beginnerDesc, icon: <GraduationCap size={20} /> },
    { id: 'intermediate', label: t.intermediate, desc: t.intermediateDesc, icon: <Flame size={20} /> },
    { id: 'advanced', label: t.advanced, desc: t.advancedDesc, icon: <Sparkles size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 antialiased">
      <div className="max-w-xl w-full">
        <div className="text-center mb-12">
          <img src={pickleLogo} alt="Pickle" className="h-24 mx-auto mb-6 object-contain" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{t.engine}</p>
        </div>

        <div className="bg-white border-[3px] border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {step === 0 && (
            <section className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-extrabold tracking-tight">{t.langSelect}</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setLang('ko')} className={`p-6 border-2 font-black transition-all ${lang === 'ko' ? 'bg-black text-white' : 'bg-white text-black border-gray-100 hover:border-black'}`}>한국어 (KO)</button>
                <button onClick={() => setLang('en')} className={`p-6 border-2 font-black transition-all ${lang === 'en' ? 'bg-black text-white' : 'bg-white text-black border-gray-100 hover:border-black'}`}>ENGLISH (EN)</button>
              </div>
              <button onClick={() => setStep(1)} className="w-full py-5 bg-black text-white font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2">{t.continue} <ArrowRight size={18} /></button>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-extrabold tracking-tight">{t.identity}</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setGender('male')} className={`p-6 border-2 font-black transition-all ${gender === 'male' ? 'bg-black text-white shadow-lg' : 'bg-white border-gray-100 hover:border-black'}`}>{t.male}</button>
                <button onClick={() => setGender('female')} className={`p-6 border-2 font-black transition-all ${gender === 'female' ? 'bg-black text-white shadow-lg' : 'bg-white border-gray-100 hover:border-black'}`}>{t.female}</button>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="flex-1 py-5 border-2 border-black font-black uppercase text-xs">{t.back}</button>
                <button onClick={() => gender && setStep(2)} disabled={!gender} className="flex-[2] py-5 bg-black text-white font-black uppercase text-sm tracking-widest">{t.next}</button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-extrabold tracking-tight">{t.levelTitle}</h2>
              <div className="space-y-4">
                {levels.map((l) => (
                  <button key={l.id} onClick={() => setLevel(l.id)} className={`w-full p-6 border-2 text-left transition-all ${level === l.id ? 'bg-black text-white' : 'bg-white border-gray-100 hover:border-black'}`}>
                    <div className="flex items-center gap-4 mb-1"><span className={level === l.id ? 'text-white' : 'text-indigo-600'}>{l.icon}</span><span className="font-extrabold text-xl">{l.label}</span></div>
                    <p className={`text-xs ${level === l.id ? 'text-gray-300' : 'text-gray-500'}`}>{l.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-5 border-2 border-black font-black uppercase text-xs">{t.back}</button>
                <button onClick={() => level && setStep(3)} disabled={!level} className="flex-[2] py-5 bg-black text-white font-black uppercase text-sm tracking-widest">{t.next}</button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-extrabold tracking-tight">{t.interests}</h2>
              <div className="relative">
                <div className="flex items-center border-2 border-black p-4 bg-gray-50 focus-within:bg-white">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
                    placeholder={t.searchPlaceholder}
                    className="flex-1 bg-transparent outline-none font-bold text-sm"
                  />
                  <Plus size={20} />
                </div>
                {showSuggestions && hasSuggestions && (
                  <div className="absolute z-50 w-full mt-2 bg-white border-2 border-black shadow-lg max-h-64 overflow-y-auto">
                    {Object.entries(filteredSuggestionsObject).map(([category, interests]) => (
                      <div key={category}>
                        <div className="px-5 py-2 bg-gray-100 font-extrabold text-xs text-gray-500 uppercase tracking-wider sticky top-0">
                          {category}
                        </div>
                        {interests.map((s) => (
                          <button
                            key={s}
                            onClick={() => toggleInterest(s)}
                            className="w-full text-left px-5 py-3 text-sm font-bold border-b hover:bg-black hover:text-white transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-gray-50/50 border-2 border-dashed">
                {selectedInterests.map(i => <button key={i} onClick={() => toggleInterest(i)} className="flex items-center gap-2 px-3 py-2 bg-black text-white text-[10px] font-bold group shadow-sm">{i}<X size={12} /></button>)}
                {selectedInterests.length < 3 && <p className="text-[10px] text-gray-400 font-bold italic mt-2">{t.interestsMin}</p>}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-5 border-2 border-black font-black uppercase text-xs">{t.back}</button>
                <button onClick={() => selectedInterests.length >= 3 && onComplete(gender!, selectedInterests, level!, lang)} disabled={selectedInterests.length < 3} className="flex-[2] py-5 bg-black text-white font-black uppercase text-sm tracking-widest">{t.start}</button>
              </div>
            </section >
          )}
        </div >
      </div >
    </div >
  );
};

export default Onboarding;
