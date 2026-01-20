import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const RequireUser = () => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default RequireUser;