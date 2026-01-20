import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useUser } from "../context/UserContext";
import Character from "../components/common/Character";
import { STAGE_THRESHOLDS, computeStageFromTotalCorrect } from "../constants";

// Stage thresholds: 0->1:5, 1->2:15, 2->3:30, 3->4:50, 4->5:75 (누적 정답 수)

type Summary = {
  tldr: string;
  contributions: string[];
  methodology: string;
  results: string;
  limitations?: string;
};

type QuizOption = { id: string; text: string };
type QuizQuestion =
  | {
      id: string;
      type: "mcq";
      prompt: string;
      options: QuizOption[];
      answer: string; // option id
      explanation: string;
      evidence?: string;
    }
  | {
      id: string;
      type: "short";
      prompt: string;
      answerText: string; // short answer (simple)
      explanation: string;
      evidence?: string;
    };

type Quiz = {
  version?: string;
  questions: QuizQuestion[];
};



const dummySummary: Summary = {
  tldr:
    "This is a placeholder summary. Connect the backend to generate an evidence-grounded summary from the paper.",
  contributions: [
    "Key contribution #1 (placeholder)",
    "Key contribution #2 (placeholder)",
    "Key contribution #3 (placeholder)",
  ],
  methodology: "Method summary (placeholder).",
  results: "Results/experiments summary (placeholder).",
  limitations: "Limitations/caveats (placeholder).",
};

const dummyQuiz: Quiz = {
  version: "dummy-v1",
  questions: [
    {
      id: "q1",
      type: "mcq",
      prompt: "What is the main problem statement of the paper?",
      options: [
        { id: "a", text: "Option A (placeholder)" },
        { id: "b", text: "Option B (placeholder)" },
        { id: "c", text: "Option C (placeholder)" },
        { id: "d", text: "Option D (placeholder)" },
      ],
      answer: "b",
      explanation: "Explanation (placeholder).",
      evidence: "Evidence: (placeholder section / snippet).",
    },
    {
      id: "q2",
      type: "mcq",
      prompt: "Which method best describes the approach?",
      options: [
        { id: "a", text: "Method A (placeholder)" },
        { id: "b", text: "Method B (placeholder)" },
        { id: "c", text: "Method C (placeholder)" },
        { id: "d", text: "Method D (placeholder)" },
      ],
      answer: "c",
      explanation: "Explanation (placeholder).",
      evidence: "Evidence: (placeholder section / snippet).",
    },
    {
      id: "q3",
      type: "mcq",
      prompt: "Which result is supported by the experiments?",
      options: [
        { id: "a", text: "Result A (placeholder)" },
        { id: "b", text: "Result B (placeholder)" },
        { id: "c", text: "Result C (placeholder)" },
        { id: "d", text: "Result D (placeholder)" },
      ],
      answer: "a",
      explanation: "Explanation (placeholder).",
      evidence: "Evidence: (placeholder section / snippet).",
    },
    {
      id: "q4",
      type: "mcq",
      prompt: "What is a noted limitation?",
      options: [
        { id: "a", text: "Limitation A (placeholder)" },
        { id: "b", text: "Limitation B (placeholder)" },
        { id: "c", text: "Limitation C (placeholder)" },
        { id: "d", text: "Limitation D (placeholder)" },
      ],
      answer: "d",
      explanation: "Explanation (placeholder).",
      evidence: "Evidence: (placeholder section / snippet).",
    },
    {
      id: "q5",
      type: "short",
      prompt: "In one sentence, describe the paper’s core contribution.",
      answerText: "Any reasonable paraphrase capturing the core idea.",
      explanation:
        "Short answers are graded leniently in MVP (placeholder). In backend, you can grade with LLM + rubric.",
      evidence: "Evidence: (placeholder section / snippet).",
    },
  ],
};

const WorkspacePage = () => {
  const navigate = useNavigate();
  const { paperId } = useParams();
  const { user, setUser } = useUser();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [tab, setTab] = useState<"summary" | "quiz">("summary");

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  const gender = user?.gender;
  const stage = (user as any)?.currentStage ?? 0;

  const masteredIds: string[] = Array.isArray((user as any)?.masteredPaperIds)
    ? (user as any).masteredPaperIds
    : [];

  const alreadyMastered = Boolean(
    paperId && masteredIds.includes(paperId)
  );

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setSubmitted(false);
      setResult(null);
      setAnswers({});

      // 백엔드가 있으면 여기서 fetch
      // (없는 경우를 대비해 try/catch + dummy fallback)
      try {
        // 예시 엔드포인트 (원하면 나중에 백엔드에 맞춰 변경)
        const [sRes, qRes] = await Promise.all([
          fetch(`/api/papers/${paperId}/summary`),
          fetch(`/api/papers/${paperId}/quiz`),
        ]);

        if (sRes.ok) {
          const sJson = await sRes.json();
          setSummary(sJson?.summary ?? sJson ?? dummySummary);
        } else {
          setSummary(dummySummary);
        }

        if (qRes.ok) {
          const qJson = await qRes.json();
          setQuiz(qJson?.quiz ?? qJson ?? dummyQuiz);
        } else {
          setQuiz(dummyQuiz);
        }
      } catch {
        setSummary(dummySummary);
        setQuiz(dummyQuiz);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [paperId]);

  const totalQuestions = useMemo(() => quiz?.questions.length ?? 0, [quiz]);

  const setMcqAnswer = (qid: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  };

  const setShortAnswer = (qid: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: text }));
  };

  const grade = () => {
    if (!quiz) return { correct: 0, total: 0 };
    let correct = 0;
    for (const q of quiz.questions) {
      const a = answers[q.id];
      if (q.type === "mcq") {
        if (a && a === q.answer) correct += 1;
      } else {
        // MVP: 단답은 "작성했으면 1점" (백엔드에서 LLM 채점으로 교체)
        if (a && a.trim().length > 0) correct += 1;
      }
    }
    return { correct, total: quiz.questions.length };
  };

    const handleSubmit = () => {
    if (!user || !quiz || !paperId) return;

    const r = grade();
    setResult(r);
    setSubmitted(true);

    const currentTotal = (user as any).totalCorrectCount ?? 0;

    // ✅ 핵심: 이미 적립된 논문이면 점수 0
    const earnedPoints = alreadyMastered ? 0 : r.correct;
    const newTotal = currentTotal + earnedPoints;

    const oldStage = (user as any).currentStage ?? 0;
    const newStage = computeStageFromTotalCorrect(newTotal);

    const updated: any = { ...(user as any) };
    updated.totalCorrectCount = newTotal;
    updated.currentStage = newStage;

    // ✅ 최초 적립일 때만 masteredPaperIds에 추가
    const existing: string[] = Array.isArray(updated.masteredPaperIds)
      ? updated.masteredPaperIds
      : [];

    if (!alreadyMastered) {
      updated.masteredPaperIds = [...existing, paperId];
    } else {
      updated.masteredPaperIds = existing;
    }

    // (선택) 읽음 표시: 라이브러리에 있으면 isRead=true
    if (Array.isArray(updated.readList)) {
      updated.readList = updated.readList.map((p: any) => {
        if (p.paper_id === paperId) return { ...p, isRead: true };
        return p;
      });
    }

    setUser(updated);
  };

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="font-black text-xl mb-2">No user found</div>
            <p className="text-sm text-gray-600 mb-6">
              온보딩부터 진행해야 합니다.
            </p>
            <button
              onClick={() => navigate("/onboarding")}
              className="px-4 py-3 border-2 border-black font-black uppercase tracking-widest bg-black text-white"
            >
              Go to Onboarding
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 상단 */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-black tracking-tight mt-4">Workspace</h1>
            <p className="text-sm text-gray-500 mt-1">
              Paper ID: <span className="font-mono">{paperId}</span>
            </p>
          </div>

          {gender && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Current Stage
                </div>
                <div className="text-sm font-extrabold">Stage {stage}</div>
                <div className="text-xs text-gray-500">
                  Points: {(user as any).totalCorrectCount ?? 0}
                </div>
              </div>
              <div className="border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Character gender={gender} stage={stage} size={88} />
              </div>
            </div>
          )}
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("summary")}
            className={`px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest ${
              tab === "summary" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setTab("quiz")}
            className={`px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest ${
              tab === "quiz" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Quiz ({totalQuestions})
          </button>
        </div>

        {loading && (
          <div className="py-16 text-center text-sm text-gray-500 font-bold">
            Loading workspace...
          </div>
        )}

        {!loading && tab === "summary" && summary && (
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                TL;DR
              </div>
              <div className="text-xl font-extrabold italic leading-relaxed">
                “{summary.tldr}”
              </div>
            </div>

            <div className="mb-8">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Contributions
              </div>
              <ul className="space-y-2">
                {summary.contributions.map((c, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="w-6 h-6 shrink-0 bg-black text-white text-[10px] font-black flex items-center justify-center mt-1">
                      {idx + 1}
                    </div>
                    <div className="text-sm font-bold text-gray-800">{c}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-gray-100 pt-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Method
                </div>
                <div className="text-sm text-gray-700 font-medium leading-relaxed">
                  {summary.methodology}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Results
                </div>
                <div className="text-sm text-gray-700 font-medium leading-relaxed">
                  {summary.results}
                </div>
              </div>
            </div>

            {summary.limitations && (
              <div className="mt-8 border-t-2 border-gray-100 pt-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Limitations
                </div>
                <div className="text-sm text-gray-700 font-medium leading-relaxed">
                  {summary.limitations}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && tab === "quiz" && quiz && (
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {!submitted ? (
              <>
                <div className="mb-6">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Answer the questions, then submit.
                  </div>
                </div>

                <div className="space-y-8">
                  {quiz.questions.map((q, idx) => (
                    <div key={q.id} className="border-2 border-black p-5">
                      <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        Q{idx + 1} • {q.type === "mcq" ? "Multiple Choice" : "Short Answer"}
                      </div>
                      <div className="text-base font-extrabold mb-4">{q.prompt}</div>

                      {q.type === "mcq" ? (
                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const checked = answers[q.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setMcqAnswer(q.id, opt.id)}
                                className={`w-full text-left px-4 py-3 border-2 border-black font-bold text-sm ${
                                  checked ? "bg-black text-white" : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <textarea
                          value={answers[q.id] ?? ""}
                          onChange={(e) => setShortAnswer(q.id, e.target.value)}
                          className="w-full min-h-[120px] border-2 border-black p-3 font-medium text-sm outline-none"
                          placeholder="Write your answer..."
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-3 border-2 border-black font-black uppercase tracking-widest bg-black text-white"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setTab("summary")}
                    className="px-5 py-3 border-2 border-black font-black uppercase tracking-widest bg-white hover:bg-gray-50"
                  >
                    Back to Summary
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="text-2xl font-black">Result</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Correct: <span className="font-black">{result?.correct ?? 0}</span> /{" "}
                    {result?.total ?? 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total Points: <span className="font-black">{(user as any).totalCorrectCount ?? 0}</span>
                  </div>
                </div>
                {alreadyMastered && (
                  <div className="mb-6 border-2 border-yellow-300 bg-yellow-50 p-4 text-yellow-900">
                    <div className="font-black mb-1">Already mastered</div>
                    <div className="text-sm">
                      You have already earned points for this paper. This attempt will not add points.
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {quiz.questions.map((q, idx) => {
                    const a = answers[q.id];
                    const isCorrect =
                      q.type === "mcq"
                        ? a === q.answer
                        : Boolean(a && a.trim().length > 0);

                    return (
                      <div key={q.id} className="border-2 border-black p-5">
                        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                          Q{idx + 1} • {isCorrect ? "Correct" : "Review"}
                        </div>
                        <div className="text-base font-extrabold mb-3">{q.prompt}</div>

                        <div className="text-sm mb-3">
                          <span className="font-black">Your answer:</span>{" "}
                          <span className="font-mono">
                            {q.type === "mcq" ? (a || "(none)") : (a || "(empty)")}
                          </span>
                        </div>

                        {q.type === "mcq" && (
                          <div className="text-sm mb-3">
                            <span className="font-black">Correct answer:</span>{" "}
                            <span className="font-mono">{q.answer}</span>
                          </div>
                        )}

                        <div className="text-sm text-gray-700">
                          <div className="font-black mb-1">Explanation</div>
                          <div className="leading-relaxed">{q.explanation}</div>
                        </div>

                        {q.evidence && (
                          <div className="mt-4 text-xs text-gray-500">
                            <div className="font-black uppercase tracking-widest mb-1">
                              Evidence
                            </div>
                            <div className="leading-relaxed">{q.evidence}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-5 py-3 border-2 border-black font-black uppercase tracking-widest bg-black text-white"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setResult(null);
                      setAnswers({});
                    }}
                    className="px-5 py-3 border-2 border-black font-black uppercase tracking-widest bg-white hover:bg-gray-50"
                  >
                    Retry
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default WorkspacePage;
