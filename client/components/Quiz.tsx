
import React, { useState, useEffect } from 'react';
import { Quiz as QuizType, QuizQuestion, AppLanguage } from '../types';
import { HelpCircle, ChevronRight, Trophy, RefreshCw, Sparkles } from 'lucide-react';

interface QuizProps {
  quiz: QuizType;
  onComplete: (correctCount: number) => void;
  onRefreshQuiz?: () => void;
  lang?: AppLanguage;
}

const Quiz: React.FC<QuizProps> = ({ quiz, onComplete, onRefreshQuiz, lang = 'ko' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setCurrentIndex(0); setSelectedAnswer(null); setShortAnswer(''); setShowResult(false); setCorrectAnswers(0); setIsFinished(false);
  }, [quiz]);

  const currentQuestion = quiz.questions[currentIndex];

  const t = {
    ko: { results: "결과 리포트", mastery: "★ 마스터 성공!", threshold: "기준 미달 (3개 이상 필요)", confirm: "확인 및 종료", refresh: "새 퀴즈 도전", validate: "답변 제출", next: "다음 문제", finish: "최종 결과 확인", expected: "정답 키워드", question: "문제" },
    en: { results: "Results Report", mastery: "★ Mastery Achieved!", threshold: "Failed threshold (Requires 3+)", confirm: "Confirm & Exit", refresh: "New Quiz Challenge", validate: "Validate Answer", next: "Next Challenge", finish: "Finish Quiz", expected: "Expected Concept", question: "Question" }
  }[lang];

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) { setCurrentIndex(currentIndex + 1); setSelectedAnswer(null); setShortAnswer(''); setShowResult(false); } 
    else { setIsFinished(true); }
  };

  const handleCheck = () => {
    const isCorrect = currentQuestion.type === 'mcq' ? selectedAnswer === currentQuestion.answer : shortAnswer.toLowerCase().trim().includes(currentQuestion.answer.toLowerCase().trim());
    if (isCorrect) setCorrectAnswers(prev => prev + 1);
    setShowResult(true);
  };

  if (isFinished) {
    const isMastered = correctAnswers >= 3;
    return (
      <div className="bg-white p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center animate-in zoom-in-95">
        <h2 className="pixel-font text-2xl mb-4">{t.results}</h2>
        <div className="flex justify-center mb-6"><div className={`p-6 rounded-full border-4 border-black ${isMastered ? 'bg-yellow-400 animate-bounce' : 'bg-gray-100'}`}><Trophy size={48} /></div></div>
        <div className="text-6xl font-black mb-4">{correctAnswers} / {quiz.questions.length}</div>
        <div className="mb-10">{isMastered ? <p className="text-indigo-600 font-black text-xl uppercase academic-font">{t.mastery}</p> : <p className="text-gray-400 font-bold uppercase text-xs">{t.threshold}</p>}</div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onComplete(correctAnswers)} className="bg-black text-white px-8 py-4 pixel-font text-[10px] uppercase shadow-md">{t.confirm}</button>
          {onRefreshQuiz && <button onClick={onRefreshQuiz} className="bg-white text-black border-4 border-black px-8 py-4 pixel-font text-[10px] uppercase shadow-md flex items-center gap-2 justify-center"><RefreshCw size={14} /> {t.refresh}</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-center mb-6">
        <span className="pixel-font text-[10px] text-gray-400 uppercase">{t.question} {currentIndex + 1} / {quiz.questions.length}</span>
        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-black transition-all" style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}></div></div>
      </div>
      <h3 className="text-xl font-bold mb-8 leading-tight">{currentQuestion.question}</h3>
      <div className="space-y-3 mb-8">
        {currentQuestion.type === 'mcq' ? currentQuestion.options?.map((opt, idx) => (
          <button key={idx} disabled={showResult} onClick={() => setSelectedAnswer(opt)} className={`w-full text-left p-4 border-2 transition-all ${selectedAnswer === opt ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black'} ${showResult && opt === currentQuestion.answer ? 'bg-green-50 border-green-500' : ''}`}>{opt}</button>
        )) : (
          <div className="space-y-2"><input type="text" disabled={showResult} value={shortAnswer} onChange={(e) => setShortAnswer(e.target.value)} placeholder="..." className="w-full p-4 border-4 border-black focus:bg-white outline-none font-bold" /></div>
        )}
      </div>
      {showResult && (
        <div className={`p-5 mb-8 border-l-8 ${ (currentQuestion.type === 'mcq' ? selectedAnswer === currentQuestion.answer : shortAnswer.toLowerCase().trim().includes(currentQuestion.answer.toLowerCase().trim())) ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600' }`}>
          <p className="text-sm text-gray-800 font-bold mb-3">{currentQuestion.explanation}</p>
          {currentQuestion.type === 'short' && <p className="text-[10px] font-black uppercase text-indigo-600">{t.expected}: "{currentQuestion.answer}"</p>}
        </div>
      )}
      <div className="flex justify-end">
        {!showResult ? <button onClick={handleCheck} disabled={currentQuestion.type === 'mcq' ? !selectedAnswer : !shortAnswer.trim()} className="bg-black text-white px-10 py-4 pixel-font text-[10px] uppercase shadow-md disabled:opacity-20">{t.validate}</button> : <button onClick={handleNext} className="bg-black text-white px-10 py-4 pixel-font text-[10px] uppercase shadow-md">{currentIndex === quiz.questions.length - 1 ? t.finish : t.next}</button>}
      </div>
    </div>
  );
};

export default Quiz;
