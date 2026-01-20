import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import OnboardingPage from "../pages/OnboardingPage";
import DashboardPage from "../pages/DashboardPage";
import WorkspacePage from "../pages/WorkspacePage";

const AppRouter = () => {
  const { user } = useUser();
  const isAuthed = Boolean(user?.id);

  return (
    <Routes>
      {/* 온보딩 */}
      <Route
        path="/onboarding"
        element={
          isAuthed ? <Navigate to="/dashboard" replace /> : <OnboardingPage />
        }
      />

      {/* 대시보드 */}
      <Route
        path="/dashboard"
        element={
          isAuthed ? <DashboardPage /> : <Navigate to="/onboarding" replace />
        }
      />

      {/* 워크스페이스 */}
      <Route
        path="/workspace/:paperId"
        element={
          isAuthed ? <WorkspacePage /> : <Navigate to="/onboarding" replace />
        }
      />

      {/* 기본 진입 */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthed ? "/dashboard" : "/onboarding"} replace />
        }
      />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthed ? "/dashboard" : "/onboarding"} replace />
        }
      />
    </Routes>
  );
};

export default AppRouter;
