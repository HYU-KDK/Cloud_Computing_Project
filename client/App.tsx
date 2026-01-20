import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, AppState, Paper, PaperSummary, Quiz as QuizType, Gender, AcademicLevel, AppLanguage } from './types';
import { STAGE_THRESHOLDS } from './constants';
import { analyzePaper, recommendPapers, getMustReadPapers, initializeUser, fetchUser, updateUserStats, syncUserPaper } from './services/apiService';
import Onboarding from './components/Onboarding';
import Discovery from './components/Discovery';
import Booklet from './components/Booklet';
import Quiz from './components/Quiz';
import Character from './components/Character';
import CharacterStats from './components/CharacterStats';
import LandingPage from './components/LandingPage/LandingPage';
import { Search, Loader2, BookOpen, GraduationCap, ArrowLeft, Trophy, Library, Sparkles, Landmark, Calendar, User as UserIcon, CheckCircle2, Bookmark, BookmarkPlus, Star, RefreshCw, FileText, Beaker, Microscope, Lightbulb, FileUp, Globe } from 'lucide-react';
import pickleLogo from './assets/logo.png';

// Localization Dictionary - UI의 모든 텍스트를 포함하도록 확장
export const i18n = {
  ko: {
    library: "내 라이브러리",
    toRead: "읽을 목록",
    completed: "완료함",
    discover: "새 논문 찾기",
    mustRead: "필독 리스트",
    pts: "지식 포인트",
    level: "현재 단계",
    upload: "PDF 업로드",
    back: "돌아가기",
    mastery: "마스터 완료",
    knowledge: "지식 합성",
    validating: "지식 검증 단계",
    tldr: "핵심 요약 (TL;DR)",
    contributions: "주요 기여점",
    intro: "서론 및 배경",
    method: "방법론 및 아키텍처",
    experiments: "실험 및 결과",
    conclusion: "결론 및 시사점",
    sourceDoc: "원본 문서 보기",
    selectStatus: "상태 선택",
    markAsRead: "읽은 논문으로 추가",
    markAsToRead: "읽을 목록에 추가",
    uploading: "데이터 분석 중...",
    emptyLibrary: "라이브러리가 비어 있습니다.",
    ptsNeeded: "다음 단계 진화까지 필요한 포인트",
    roadmap: "학술 성장 로드맵",
    mustReadTitle: "나만을 위한 필독 리스트",
    mustReadDesc: "학문적 성장을 위해 반드시 읽어야 할 고전과 최신 논문 큐레이션입니다.",
    discoverTitle: "새로운 논문 발견",
    activeResearch: "현재 연구 중",
    authors: "주요 저자",
    characterEvolution: "캐릭터 성장 현황",
    backToLibrary: "라이브러리로 돌아가기",
    cancel: "취소",
    evolutionTitle: "진화!",
    stageElevated: "학술적 단계가 상승했습니다",
    knowPoints: "지식 포인트",
    ptsRequired: "포인트 더 필요",
    viewMustReads: "필독 리스트 보기",
    researchInsight: "연구 통찰 입력:",
    validate: "검증하기",
    nextChallenge: "다음 도전",
    finishQuiz: "결과 확인",
    masteryAchieved: "★ 마스터 성공!",
    thresholdNotMet: "지식 기준 미달 (3개 이상 정답 필요)",
    confirmExit: "확인 및 종료",
    newQuizChallenge: "새 퀴즈 도전",
    foundationalWorks: "기초 연구 자료",
    discoveryDescription: "당신의 라이브러리를 구축하세요. 이미 읽은 논문은 완료로 표시하고, 나중에 공부할 논문은 저장하세요.",
    searchPlaceholder: "특정 키워드 검색 (예: 'LLM 추론')...",
    refreshSuggestions: "추천 새로고침",
    search: "검색",
    resynthesizing: "큐레이션 다시 생성 중...",
    filteringHistory: "독서 이력을 분석하여 새로운 기초 통찰을 제공합니다.",
    noFoundational: "검색된 기초 연구 자료가 없습니다.",
    confirmSelection: "선택 완료",
    saved: "저장됨",
    saveToRead: "읽을 목록에 저장",
    inLibrary: "라이브러리에 있음",
    alreadyRead: "이미 읽음"
  },
  en: {
    library: "My Library",
    toRead: "To Read",
    completed: "Completed",
    discover: "Discover",
    mustRead: "Must-Read List",
    pts: "Knowledge Points",
    level: "Current Level",
    upload: "Upload PDF",
    back: "Back",
    mastery: "Mastered",
    knowledge: "Knowledge Synthesis",
    validating: "Validating Knowledge",
    tldr: "Executive Summary (TL;DR)",
    contributions: "Key Contributions",
    intro: "Introduction",
    method: "Methodology",
    experiments: "Experiments & Results",
    conclusion: "Conclusion",
    sourceDoc: "Source Document",
    selectStatus: "Select Status",
    markAsRead: "Add as Read",
    markAsToRead: "Add to Read List",
    uploading: "Analyzing data...",
    emptyLibrary: "Library is empty.",
    ptsNeeded: "Points needed for evolution.",
    roadmap: "Evolution Roadmap",
    mustReadTitle: "MUST-READ CURATION",
    mustReadDesc: "Foundational and cutting-edge works essential for your growth.",
    discoverTitle: "DISCOVER NEW PAPERS",
    activeResearch: "Active Research",
    authors: "Primary Authors",
    characterEvolution: "Character Evolution",
    backToLibrary: "Back to Library",
    cancel: "Cancel",
    evolutionTitle: "EVOLUTION!",
    stageElevated: "Academic Stage Elevated",
    knowPoints: "KNOWLEDGE POINTS",
    ptsRequired: "more points required",
    viewMustReads: "View Must-Reads",
    researchInsight: "Research Insight:",
    validate: "Validate",
    nextChallenge: "Next Challenge",
    finishQuiz: "Finish",
    masteryAchieved: "★ Mastery Achieved!",
    thresholdNotMet: "Threshold not met (Requires 3+)",
    confirmExit: "Confirm & Exit",
    newQuizChallenge: "New Quiz Challenge",
    foundationalWorks: "Foundational Works",
    discoveryDescription: "Build your library. Mark papers you've already completed or save new ones to study later.",
    searchPlaceholder: "Search keywords (e.g., 'LLM reasoning')...",
    refreshSuggestions: "Refresh Suggestions",
    search: "Search",
    resynthesizing: "Re-synthesizing curation...",
    filteringHistory: "Filtering history to provide fresh insights",
    noFoundational: "No foundational works found.",
    confirmSelection: "Confirm Selection",
    saved: "Saved",
    saveToRead: "Save To Read",
    inLibrary: "In Library",
    alreadyRead: "Already Read"
  }
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // Default to LANDING
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [summary, setSummary] = useState<PaperSummary | null>(null);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(false);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPaper, setCurrentPaper] = useState<Paper | null>(null);

  // States for PDF Import Modal
  const [pdfImportModal, setPdfImportModal] = useState<{ file: File, title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for library tab
  const [libraryTab, setLibraryTab] = useState<'to-read' | 'completed'>('to-read');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [discoveryTitle, setDiscoveryTitle] = useState<string>(i18n.ko.mustReadTitle);
  const [discoveryPapers, setDiscoveryPapers] = useState<Paper[]>([]);


  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const savedUserId = localStorage.getItem('paperquest_user_id');
        if (savedUserId) {
          const userData = await fetchUser(savedUserId);
          if (userData) {
            setUser(userData);
            setAppState(AppState.DASHBOARD);
          } else {
            setAppState(AppState.LANDING);
          }
        } else {
          setAppState(AppState.LANDING);
        }
      } catch (error) {
        console.error("User fetch failed", error);
        setAppState(AppState.LANDING);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const saveUserLocal = (userId: string) => {
    localStorage.setItem('paperquest_user_id', userId);
  };

  const handleStartOnboarding = () => {
    setAppState(AppState.ONBOARDING);
  };

  const handleOnboardingComplete = async (gender: Gender, interests: string[], level: AcademicLevel, lang: AppLanguage) => {
    setLoading(true);
    try {
      // Backend creates user and generates must-read list
      const newUser = await initializeUser({
        gender,
        level,
        language: lang,
        interestKeywords: interests
      });

      setUser(newUser);
      saveUserLocal(newUser.id);

      // Onboarding 완료 후엔 Dashboard로 이동하기 전에 
      // 만약 신규 유저라면 Discovery 단계를 거칠 수도 있지만,
      // 여기서는 일단 바로 Dashboard로 가거나 기존 로직 유지
      // 하지만 Onboarding 완료 시점엔 usually Dashboard or Discovery
      // 기존 코드는 handleOnboardingComplete 내부에서 setAppState를 호출하지 않았었나?
      // 기존 코드를 확인해보니 initializeUser 후 setUser 하고 끝나는 것 같음.
      // 하지만 UI 전환은 필요함.
      localStorage.setItem('paperquest_user_id', newUser.id);
      setAppState(AppState.DASHBOARD);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetApp = () => {
    localStorage.removeItem('paperquest_user_id');
    setUser(null);
    setAppState(AppState.LANDING);
    setSelectedPaper(null);
    setSummary(null);
    setQuiz(null);
  };

  const t = i18n[user?.language || 'ko'];

  const handleOpenMustReadList = () => {
    if (!user) return;
    setDiscoveryPapers(user.mustReadList);
    setDiscoveryTitle(t.mustReadTitle);
    setAppState(AppState.DISCOVERY);
  };

  const handleRefreshMustReads = async () => {
    if (!user) return;
    setDiscoveryLoading(true);
    try {
      const readTitles = user.readList.filter(p => p.isRead).map(p => p.title);
      // Fetches explicit must-reads (or recommendations filtered)
      const freshList = await getMustReadPapers(user.interestKeywords, user.level, readTitles);
      // Note: We are not persisting this list to DB in this simplified flow, just showing it. 
      // Ideally we should update user's mustReadList in DB.
      // For now, local update is fine for session, but let's assume readonly until added.
      setDiscoveryPapers(freshList);
    } catch (err) {
      console.error("Failed to refresh must-reads", err);
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !(window as any).pdfjsLib) return;

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      const maxPages = Math.min(pdf.numPages, 5);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((item: any) => item.str).join(" ");
      }

      setPdfImportModal({ title: file.name.replace('.pdf', ''), abstract: fullText.substring(0, 5000) });
    } catch (err) {
      console.error("PDF Parsing failed", err);
      alert("Failed to parse PDF.");
    } finally {
      setLoading(false);
    }
  };

  const finalizePdfImport = async (isRead: boolean) => {
    if (!pdfImportModal || !user) return;

    const newPaper: Paper = {
      id: Math.random().toString(36).substr(2, 9), // ID will be replaced by backend
      title: pdfImportModal.title,
      authors: ["Unknown Investigator"],
      url: "#",
      source: "Uploaded PDF",
      abstract: pdfImportModal.abstract,
      isRead: isRead
    };

    try {
      await syncUserPaper(user.id, newPaper, isRead, isRead); // Sync to DB
      const updatedUser = await fetchUser(user.id);
      setUser(updatedUser);
    } catch (e) {
      console.error(e);
      alert("Failed to save PDF entry.");
    }

    setPdfImportModal(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePaperSelect = async (paper: Paper) => {
    if (!user) return;

    // Check if we already have the summary locally in user object
    if (paper.summary && paper.quiz) {
      setSelectedPaper(paper);
      setSummary(paper.summary);
      setQuiz(paper.quiz);
      setAppState(AppState.WORKSPACE);
      return;
    }

    setLoading(true);
    setSelectedPaper(paper);
    try {
      const { summary: newSummary, quiz: newQuiz } = await analyzePaper(paper.title, paper.abstract, user.language);

      // Update DB with analysis (we count this as adding to library if analyzed)
      // Or at least cache it.
      await syncUserPaper(user.id, { ...paper, summary: newSummary, quiz: newQuiz }, paper.isRead || false, true);

      // Refresh User State
      const updatedUser = await fetchUser(user.id);
      setUser(updatedUser);

      setSummary(newSummary);
      setQuiz(newQuiz);
      setAppState(AppState.WORKSPACE);
    } catch (err) {
      console.error(err);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshQuiz = async () => {
    if (!user || !selectedPaper) return;
    setLoading(true);
    try {
      const { quiz: newQuiz } = await analyzePaper(selectedPaper.title, selectedPaper.abstract, user.language);

      // Save new quiz to DB
      await syncUserPaper(user.id, { ...selectedPaper, quiz: newQuiz }, selectedPaper.isRead || false, true);

      const updatedUser = await fetchUser(user.id);
      setUser(updatedUser);

      setQuiz(newQuiz);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (correctCount: number) => {
    if (!user || !selectedPaper) return;
    const paperTitleNormalized = selectedPaper.title.toLowerCase().trim();
    const achievedMastery = correctCount >= 3;
    const isAlreadyMastered = user.masteredPaperIds.includes(paperTitleNormalized);

    const newTotal = user.totalCorrectCount + correctCount;
    const oldStage = user.currentStage;
    let newStage = 0;
    for (let i = 0; i < STAGE_THRESHOLDS.length; i++) {
      if (newTotal >= STAGE_THRESHOLDS[i]) newStage = i + 1;
    }

    try {
      // Update stats
      await updateUserStats(user.id, {
        totalCorrectCount: newTotal,
        currentStage: newStage,
        masteredPaperId: (achievedMastery && !isAlreadyMastered) ? paperTitleNormalized : undefined
      });

      // Mark as Read
      await syncUserPaper(user.id, selectedPaper, true, true);

      // Refresh User
      const updatedUser = await fetchUser(user.id);
      setUser(updatedUser);

      if (newStage > oldStage) setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 5000);

      setAppState(AppState.DASHBOARD);
      setSelectedPaper(null); setSummary(null); setQuiz(null);
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  const filteredLibrary = useMemo(() => {
    if (!user) return [];
    return user.readList.filter(p => libraryTab === 'completed' ? p.isRead : !p.isRead);
  }, [user?.readList, libraryTab]);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fcfcfc] space-y-4">
      <Loader2 className="animate-spin text-black" size={48} />
      <p className="pixel-font text-[10px] uppercase text-center max-w-xs">{t.uploading}</p>
    </div>
  );

  if (appState === AppState.LANDING) {
    return <LandingPage onStart={handleStartOnboarding} />;
  }

  if (appState === AppState.ONBOARDING) return <Onboarding onComplete={handleOnboardingComplete} />;

  if (appState === AppState.DISCOVERY) return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Discovery
        papers={discoveryPapers}
        readList={user?.readList || []}
        lang={user?.language || 'ko'}
        onToggleRead={async (p, s) => {
          if (!user) return;
          // save to DB
          try {
            await syncUserPaper(user.id, p, s, true);
            const updatedUser = await fetchUser(user.id);
            setUser(updatedUser);
          } catch (e) { console.error(e); }
        }}
        onContinue={() => setAppState(AppState.DASHBOARD)}
        isLoading={discoveryLoading}
        onSearch={async (q) => {
          if (!user) return; setDiscoveryLoading(true);
          try { const res = await recommendPapers(user.readList, user.interestKeywords, user.level, q); setDiscoveryPapers(res); }
          finally { setDiscoveryLoading(false); }
        }}
        onRefresh={discoveryTitle === t.mustReadTitle ? handleRefreshMustReads : undefined}
        title={discoveryTitle}
        description={discoveryTitle === t.mustReadTitle ? t.mustReadDesc : t.discoveryDescription}
      />
    </div>
  );
  return (
    <div className="min-h-screen bg-[#f8f8f8] text-black pb-20">
      <header className="sticky top-0 z-50 bg-white border-b-2 border-black px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppState(AppState.DASHBOARD)}>
          <BookOpen size={24} />
          <img src={pickleLogo} alt="Pickle" className="h-8 object-contain" />
        </div>
        <div className="flex items-center gap-6">
          {user && (
            <button
              onClick={handleResetApp}
              className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors"
            >
              Log Out
            </button>
          )}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] pixel-font text-gray-400">{t.pts}</span>
            <span className="text-lg font-black">{user?.totalCorrectCount} PTS</span>
          </div>
          {user && <div className="cursor-pointer" onClick={() => setAppState(AppState.CHARACTER_STATS)}><Character user={user} size="sm" /></div>}
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        {appState === AppState.DASHBOARD ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black italic mb-2 academic-font uppercase">{t.library}</h2>
                <p className="text-gray-500 font-semibold italic">{t.level}: <span className="text-indigo-600 font-black uppercase">{user?.level}</span></p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleOpenMustReadList} className="flex items-center gap-2 text-[10px] pixel-font px-4 py-3 border-2 border-black bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase hover:bg-black hover:text-white transition-all">
                  <Star size={12} fill="currentColor" /> {t.mustRead}
                </button>
                <input type="file" accept=".pdf" ref={fileInputRef} className="hidden" onChange={handlePdfUpload} />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] pixel-font px-4 py-3 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase hover:bg-black hover:text-white transition-all"><FileUp size={12} /> {t.upload}</button>
                <button onClick={() => { setDiscoveryTitle(t.discoverTitle); setAppState(AppState.DISCOVERY); }} className="flex items-center gap-2 text-[10px] pixel-font px-4 py-3 border-2 border-black bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase hover:bg-black hover:text-white transition-all"><Sparkles size={12} /> {t.discover}</button>
              </div>
            </div>

            <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
              <button onClick={() => setLibraryTab('to-read')} className={`pb-4 px-2 flex items-center gap-2 font-black text-xs uppercase relative ${libraryTab === 'to-read' ? 'text-black' : 'text-gray-400'}`}>
                <Bookmark size={14} /> {t.toRead} {libraryTab === 'to-read' && <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-black"></div>}
              </button>
              <button onClick={() => setLibraryTab('completed')} className={`pb-4 px-2 flex items-center gap-2 font-black text-xs uppercase relative ${libraryTab === 'completed' ? 'text-black' : 'text-gray-400'}`}>
                <CheckCircle2 size={14} /> {t.completed} {libraryTab === 'completed' && <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-black"></div>}
              </button>
            </div>

            {filteredLibrary.length === 0 ? (
              <div className="py-24 text-center border-4 border-dashed border-gray-200 bg-white/50">
                <Library className="mx-auto mb-4 text-gray-200" size={64} />
                <p className="text-gray-400 font-bold italic uppercase">{t.emptyLibrary}</p>
                <button
                  onClick={() => setAppState(AppState.DISCOVERY)}
                  className="mt-6 bg-black text-white px-8 py-4 pixel-font text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:scale-105 transition-all uppercase"
                >
                  {t.viewMustReads}
                </button>
              </div>
            ) : (
              <Booklet papers={filteredLibrary} onSelect={handlePaperSelect} masteredIds={user?.masteredPaperIds || []} lang={user?.language || 'ko'} />
            )}
          </div>
        ) : appState === AppState.CHARACTER_STATS ? (
          <CharacterStats user={user!} onBack={() => setAppState(AppState.DASHBOARD)} onUpdateUser={setUser} onReset={handleResetApp} />
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
            <div className="lg:col-span-1 space-y-8">
              <button onClick={() => setAppState(AppState.DASHBOARD)} className="flex items-center gap-3 font-black text-sm border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white uppercase"><ArrowLeft size={18} /> {t.backToLibrary}</button>
              <div className="bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">{t.activeResearch}</h3>
                <h4 className="text-3xl font-extrabold mb-4 leading-tight">{selectedPaper?.title}</h4>
                <p className="text-xs text-gray-400 font-black mb-6 uppercase italic">{t.authors}: {selectedPaper?.authors.join(', ')}</p>
                <a href={selectedPaper?.url} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black bg-indigo-50 text-indigo-700 px-4 py-2 border border-indigo-200 uppercase">{t.sourceDoc} <Globe size={14} /></a>
              </div>
              <div className="flex flex-col items-center p-10 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] cursor-pointer" onClick={() => setAppState(AppState.CHARACTER_STATS)}>
                <Character user={user!} size="lg" />
                <p className="mt-8 pixel-font text-[8px] uppercase text-gray-400">{t.characterEvolution}</p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-10">
              {summary && (
                <div className="bg-white p-10 border-2 border-black paper-page shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 mb-8 text-indigo-600 border-b-2 pb-4">
                    <GraduationCap size={24} /> <span className="font-black text-lg uppercase academic-font">{t.knowledge}</span>
                  </div>
                  <section className="mb-10 bg-gray-50 p-6 border-l-8 border-black">
                    <h5 className="font-black text-[10px] uppercase text-gray-400 mb-3">{t.tldr}</h5>
                    <p className="text-xl font-bold italic academic-font">"{summary.tldr}"</p>
                  </section>
                  <section className="mb-10">
                    <h5 className="font-black text-sm uppercase mb-4 flex items-center gap-2"><Lightbulb size={16} /> {t.contributions}</h5>
                    <ul className="space-y-4">{(summary.contributions || []).map((c, i) => <li key={i} className="flex gap-4 items-start"><div className="w-6 h-6 shrink-0 bg-black text-white text-[10px] pixel-font flex items-center justify-center mt-1">{i + 1}</div><p className="text-gray-800 font-bold">{c}</p></li>)}</ul>
                  </section>
                  <div className="space-y-10 border-t-2 pt-10">
                    <section><h5 className="font-black text-[11px] uppercase text-indigo-600 mb-3">{t.intro}</h5><p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4">{summary.introduction}</p></section>
                    <section><h5 className="font-black text-[11px] uppercase text-indigo-600 mb-3">{t.method}</h5><p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4">{summary.method}</p></section>
                    <section><h5 className="font-black text-[11px] uppercase text-indigo-600 mb-3">{t.experiments}</h5><p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4">{summary.experiments}</p></section>
                    <section><h5 className="font-black text-[11px] uppercase text-indigo-600 mb-3">{t.conclusion}</h5><p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4">{summary.conclusion}</p></section>
                  </div>
                </div>
              )}
              {quiz && (
                <div id="quiz-section" className="pt-4">
                  <div className="flex items-center gap-3 mb-6 bg-yellow-50 border-2 border-yellow-200 p-4 inline-flex">
                    <Trophy size={20} className="text-yellow-600" /> <span className="font-black text-sm uppercase text-yellow-800">{t.validating}</span>
                  </div>
                  <Quiz quiz={quiz} onComplete={handleQuizComplete} onRefreshQuiz={handleRefreshQuiz} lang={user?.language} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {pdfImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black p-8 max-w-lg w-full shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <h3 className="text-2xl font-black mb-4 uppercase academic-font">{t.selectStatus}</h3>
            <p className="text-sm font-bold text-gray-500 mb-8 italic">"{pdfImportModal.title}"</p>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => finalizePdfImport(true)} className="flex items-center justify-center gap-3 py-4 bg-green-600 text-white font-black uppercase text-xs border-2 border-black hover:bg-green-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><CheckCircle2 size={16} /> {t.markAsRead}</button>
              <button onClick={() => finalizePdfImport(false)} className="flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white font-black uppercase text-xs border-2 border-black hover:bg-indigo-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><BookmarkPlus size={16} /> {t.markAsToRead}</button>
              <button onClick={() => setPdfImportModal(null)} className="py-2 text-[10px] font-black uppercase text-gray-400 hover:text-black mt-4">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {showLevelUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 pointer-events-none">
          <div className="text-center space-y-12 p-10">
            <h2 className="pixel-font text-6xl text-yellow-400 animate-pulse tracking-[0.2em]">{t.evolutionTitle}</h2>
            <p className="text-white font-black text-3xl uppercase tracking-[0.4em] animate-bounce">{t.stageElevated}</p>
            <div className="flex justify-center scale-[2]"><Character user={user!} size="lg" /></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
