import CharacterStats from "../components/CharacterStats";
import { useNavigate } from "react-router-dom";

const GrowthPage = () => {
  const navigate = useNavigate();

  return (
    <CharacterStats
      user={null as any}
      onBack={() => navigate("/dashboard")}
      onUpdateUser={() => {}}
    />
  );
};

export default GrowthPage;
