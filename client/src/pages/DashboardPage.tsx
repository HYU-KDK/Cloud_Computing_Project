import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useUser } from "../context/UserContext";
import { useRecommendations } from "../hooks/useRecommendations";
import Character from "../components/common/Character";

type LibraryItem = {
  paper_id?: string;
  title: string;
  authors: string[];
  url?: string;
  isRead?: boolean;
};

const normalizeTitle = (t: string) => t.toLowerCase().trim().replace(/\s+/g, " ");

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, setUser, clearUser } = useUser();

  const [tab, setTab] = useState<"recommendations" | "library">("recommendations");
  const [libraryTab, setLibraryTab] = useState<"to-read" | "completed">("to-read");

  const { data, loading, error, refresh } = useRecommendations("coldstart");

  const library = useMemo<LibraryItem[]>(() => {
    return ((user as any)?.readList ?? []) as LibraryItem[];
  }, [user]);

  const filteredLibrary = useMemo(() => {
    return library.filter((p) => (libraryTab === "completed" ? !!p.isRead : !p.isRead));
  }, [library, libraryTab]);

  const isInLibrary = (paperTitle: string) => {
    const norm = normalizeTitle(paperTitle);
    return library.some((p) => normalizeTitle(p.title) === norm);
  };

  const addToLibrary = (paper: { paper_id: string; title: string; authors: string[]; url: string }) => {
    if (!user) return;

    // 중복 방지
    if (isInLibrary(paper.title)) return;

    const next: any = { ...(user as any) };
    const nextList: any[] = Array.isArray(next.readList) ? [...next.readList] : [];

    nextList.push({
      paper_id: paper.paper_id,
      title: paper.title,
      authors: paper.authors ?? [],
      url: paper.url,
      isRead: false,
    });

    next.readList = nextList;
    setUser(next);
  };

  const markAsRead = (paperTitle: string, isRead: boolean) => {
    if (!user) return;

    const norm = normalizeTitle(paperTitle);
    const next: any = { ...(user as any) };
    const nextList: any[] = Array.isArray(next.readList) ? [...next.readList] : [];

    next.readList = nextList.map((p) => {
      if (normalizeTitle(p.title) === norm) return { ...p, isRead };
      return p;
    });

    setUser(next);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 상단 타이틀 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {user?.gender ? `Character: ${user.gender}` : ""}{" "}
              {user && (user as any)?.level ? ` • Level: ${(user as any).level}` : ""}{" "}
              {user && typeof (user as any)?.totalCorrectCount === "number"
                ? ` • Points: ${(user as any).totalCorrectCount}`
                : ""}
            </p>
          </div>
          {user?.gender && typeof (user as any)?.currentStage === "number" && (
             <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Character
                </div>
                <div className="text-sm font-extrabold">
                  Stage {(user as any).currentStage}
                </div>
              </div>
              <div className="border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Character
                gender={user.gender}
                stage={(user as any).currentStage}
                size={72}
              />
            </div>
          </div>
        )}

          <div className="flex gap-2">
            <button
              onClick={() => setTab("recommendations")}
              className={`px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest ${
                tab === "recommendations" ? "bg-black text-white" : "bg-white"
              }`}
            >
              Recommendations
            </button>
            <button
              onClick={() => setTab("library")}
              className={`px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest ${
                tab === "library" ? "bg-black text-white" : "bg-white"
              }`}
            >
              My Library
            </button>

            <button
              onClick={clearUser}
              className="px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-white hover:bg-gray-50"
              title="Reset user (for testing)"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 탭: Recommendations */}
        {tab === "recommendations" && (
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-black">Booklet Recommendations</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Coldstart 키워드 기반 추천 (8~12편)
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => refresh()}
                  className="px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-white hover:bg-gray-50"
                >
                  Refresh
                </button>
                <button
                  onClick={() => navigate("/discovery")}
                  className="px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-white hover:bg-gray-50"
                >
                  Discovery
                </button>
              </div>
            </div>

            {loading && (
              <div className="py-10 text-center text-sm text-gray-500 font-bold">
                Loading recommendations...
              </div>
            )}

            {!loading && error && (
              <div className="py-6 border-2 border-red-300 bg-red-50 text-red-700 p-4">
                <div className="font-black mb-1">Failed to load recommendations</div>
                <div className="text-sm break-words">{error}</div>
                <div className="mt-3 text-xs text-red-700/80">
                  백엔드에 <span className="font-mono">/api/recommendations</span>가 아직 없으면 이 메시지가 정상입니다.
                </div>
              </div>
            )}

            {!loading && !error && (!data?.papers || data.papers.length === 0) && (
              <div className="py-12 text-center text-sm text-gray-500 font-bold">
                No recommendations yet.
              </div>
            )}

            {!loading && !error && data?.papers && data.papers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.papers.map((p) => {
                  const inLib = isInLibrary(p.title);
                  return (
                    <div
                      key={p.paper_id}
                      className="border-2 border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="text-xs text-gray-400 font-black uppercase tracking-widest mb-2">
                        {p.reason_label ?? "Recommended"}
                      </div>

                      <h3 className="text-lg font-extrabold leading-snug">
                        {p.title}
                      </h3>

                      <div className="text-xs text-gray-500 mt-2">
                        {(p.authors ?? []).slice(0, 3).join(", ")}
                        {(p.authors?.length ?? 0) > 3 ? "…" : ""}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/workspace/${p.paper_id}`)}
                          className="px-3 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-black text-white"
                        >
                          Read
                        </button>

                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-white hover:bg-gray-50"
                        >
                          Open URL
                        </a>

                        <button
                          onClick={() => addToLibrary(p as any)}
                          disabled={inLib}
                          className={`px-3 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest ${
                            inLib ? "bg-gray-200 text-gray-500" : "bg-white hover:bg-gray-50"
                          }`}
                          title={inLib ? "Already in library" : "Add to library"}
                        >
                          {inLib ? "In Library" : "Save"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 탭: Library */}
        {tab === "library" && (
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-black">My Library</h2>
                <p className="text-xs text-gray-500 mt-1">
                  저장한 논문을 To Read / Completed로 관리
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setLibraryTab("to-read")}
                  className={`px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest ${
                    libraryTab === "to-read" ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  To Read ({library.filter((p) => !p.isRead).length})
                </button>
                <button
                  onClick={() => setLibraryTab("completed")}
                  className={`px-4 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest ${
                    libraryTab === "completed" ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  Completed ({library.filter((p) => !!p.isRead).length})
                </button>
              </div>
            </div>

            {filteredLibrary.length === 0 ? (
              <div className="py-14 text-center text-sm text-gray-500 font-bold">
                {libraryTab === "to-read"
                  ? "No papers saved yet. Go to Recommendations and click Save."
                  : "No completed papers yet. Finish a quiz in Workspace."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLibrary.map((p) => (
                  <div
                    key={p.paper_id ?? p.title}
                    className="border-2 border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <h3 className="text-lg font-extrabold leading-snug">{p.title}</h3>
                    <div className="text-xs text-gray-500 mt-2">
                      {(p.authors ?? []).slice(0, 3).join(", ")}
                      {(p.authors?.length ?? 0) > 3 ? "…" : ""}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {p.paper_id && (
                        <button
                          onClick={() => navigate(`/workspace/${p.paper_id}`)}
                          className="px-3 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-black text-white"
                        >
                          Open Workspace
                        </button>
                      )}

                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-white hover:bg-gray-50"
                        >
                          Open URL
                        </a>
                      )}

                      <button
                        onClick={() => markAsRead(p.title, !p.isRead)}
                        className="px-3 py-2 border-2 border-black font-bold text-xs uppercase tracking-widest bg-white hover:bg-gray-50"
                      >
                        {p.isRead ? "Mark To Read" : "Mark Completed"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default DashboardPage;
