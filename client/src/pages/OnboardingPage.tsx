import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gender, AcademicLevel } from "../types";
import { INTEREST_OPTIONS } from "../constants";
import { useUser } from "../context/UserContext";
import {
  Check,
  ArrowRight,
  X,
  Plus,
  GraduationCap,
  Flame,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // ✅ 렌더 중 navigate 금지 → useEffect로 리다이렉트
  useEffect(() => {
    if (user?.id) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [gender, setGender] = useState<Gender | null>(null);
  const [level, setLevel] = useState<AcademicLevel | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    return INTEREST_OPTIONS.filter(
      (option) =>
        option.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedInterests.includes(option)
    );
  }, [inputValue, selectedInterests]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest));
    } else {
      setSelectedInterests((prev) => [...prev, interest]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const match = INTEREST_OPTIONS.find(
        (opt) => opt.toLowerCase() === inputValue.trim().toLowerCase()
      );
      const toAdd = match || inputValue.trim();
      if (!selectedInterests.includes(toAdd)) {
        setSelectedInterests((prev) => [...prev, toAdd]);
      }
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const levels: {
    id: AcademicLevel;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "beginner",
      label: "Beginner",
      desc: "Identify core foundational papers that shaped the field.",
      icon: <GraduationCap size={20} />,
    },
    {
      id: "intermediate",
      label: "Intermediate",
      desc: "Explore a balanced mix of classics and modern state-of-the-art.",
      icon: <Flame size={20} />,
    },
    {
      id: "advanced",
      label: "Advanced",
      desc: "Focus strictly on cutting-edge research and 2024-2025 breakthroughs.",
      icon: <Sparkles size={20} />,
    },
  ];

  const handleComplete = async () => {
    if (!gender || !level || selectedInterests.length < 3) return;

    setLoading(true);

    const localUser: any = {
      id: (crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      gender,
      level,
      interestKeywords: selectedInterests,
      totalCorrectCount: 0,
      currentStage: 0,
      readList: [],
      mustReadList: [],
      masteredPaperIds: [],
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character_gender: gender,
          interest_keywords: selectedInterests,
          academic_level: level,
        }),
      });

      if (res.ok) {
        const json = await res.json();

        const merged: any = { ...localUser };
        if (json?.user?.id) merged.id = json.user.id;
        if (json?.progress?.total_correct !== undefined)
          merged.totalCorrectCount = json.progress.total_correct;
        if (json?.progress?.stage !== undefined)
          merged.currentStage = json.progress.stage;

        setUser(merged);
      } else {
        setUser(localUser);
      }
    } catch {
      setUser(localUser);
    } finally {
      setLoading(false);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 antialiased">
      <div className="max-w-xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-black text-white mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
            <Check size={28} />
          </div>
          <h1 className="text-5xl font-black academic-font italic tracking-tight mb-3 text-black">
            PaperQuest
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Academic Growth Engine
          </p>
        </div>

        <div className="bg-white border-[3px] border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {step === 1 && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-[0.2em]">
                  Step 01
                </h3>
                <h2 className="text-3xl font-extrabold text-black tracking-tight">
                  Select Identity
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setGender("male")}
                  className={`p-6 border-[3px] font-bold transition-all text-sm tracking-wide flex flex-col items-center gap-2 ${
                    gender === "male"
                      ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                      : "bg-white text-black border-gray-100 hover:border-black"
                  }`}
                >
                  MALE
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`p-6 border-[3px] font-bold transition-all text-sm tracking-wide flex flex-col items-center gap-2 ${
                    gender === "female"
                      ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                      : "bg-white text-black border-gray-100 hover:border-black"
                  }`}
                >
                  FEMALE
                </button>
              </div>

              <button
                onClick={() => gender && setStep(2)}
                disabled={!gender}
                className="w-full py-5 bg-black text-white font-extrabold text-sm flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-[0px_8px_16px_rgba(0,0,0,0.1)] disabled:opacity-20 uppercase tracking-widest"
              >
                CONTINUE <ArrowRight size={18} />
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-[0.2em]">
                  Step 02
                </h3>
                <h2 className="text-3xl font-extrabold text-black tracking-tight">
                  Academic Level
                </h2>
              </div>

              <div className="space-y-4">
                {levels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`w-full p-6 border-[3px] text-left transition-all group ${
                      level === l.id
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-100 hover:border-black"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-1">
                      <div
                        className={`transition-colors ${
                          level === l.id ? "text-white" : "text-indigo-600"
                        }`}
                      >
                        {l.icon}
                      </div>
                      <span className="font-extrabold tracking-tight text-xl">
                        {l.label}
                      </span>
                    </div>
                    <p
                      className={`text-[13px] font-medium leading-relaxed ${
                        level === l.id ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {l.desc}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 border-[3px] border-black font-extrabold text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors bg-white z-10"
                >
                  <ChevronLeft size={16} /> BACK
                </button>
                <button
                  onClick={() => level && setStep(3)}
                  disabled={!level}
                  className="flex-[2] py-5 bg-black text-white font-extrabold text-sm flex items-center justify-center gap-3 disabled:opacity-20 uppercase tracking-widest"
                >
                  NEXT <ArrowRight size={18} />
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-[0.2em]">
                  Step 03
                </h3>
                <h2 className="text-3xl font-extrabold text-black tracking-tight">
                  Research Interests
                </h2>
                <p className="text-gray-400 text-xs font-semibold mt-1 italic">
                  Please select or type at least 3 topics to begin.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center border-[3px] border-black p-4 bg-gray-50 focus-within:bg-white focus-within:ring-4 focus-within:ring-black/5 transition-all">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search topics (e.g. LLM, Physics, Biology...)"
                    className="flex-1 bg-transparent outline-none font-bold text-sm text-black placeholder:text-gray-300"
                  />
                  <Plus size={20} className="text-black ml-2" />
                </div>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-64 overflow-y-auto">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => toggleInterest(suggestion)}
                        className="w-full text-left px-5 py-4 text-sm font-bold text-black hover:bg-black hover:text-white transition-colors border-b-2 border-gray-50 last:border-b-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5 min-h-[100px] p-4 bg-gray-50/50 border-2 border-dashed border-gray-200">
                {selectedInterests.length === 0 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                      Selected interests will appear here
                    </span>
                  </div>
                )}
                {selectedInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-black text-white text-[12px] font-bold tracking-tight hover:bg-red-600 transition-all group shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    {interest}
                    <X size={14} className="group-hover:scale-110" />
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-5 border-[3px] border-black font-extrabold text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors bg-white z-10"
                >
                  <ChevronLeft size={16} /> BACK
                </button>
                <button
                  onClick={handleComplete}
                  disabled={selectedInterests.length < 3 || loading}
                  className="flex-[2] py-5 bg-black text-white font-extrabold text-sm flex items-center justify-center gap-3 disabled:opacity-20 uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] transition-all"
                >
                  {loading ? "SAVING..." : "START QUEST"} <ArrowRight size={18} />
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
