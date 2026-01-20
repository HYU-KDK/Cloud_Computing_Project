import Discovery from "../components/Discovery";
import { useNavigate } from "react-router-dom";

const DiscoveryPage = () => {
  const navigate = useNavigate();

  return (
    <Discovery
      title="DISCOVER PAPERS"
      papers={[]}
      onContinue={() => navigate("/dashboard")}
    />
  );
};

export default DiscoveryPage;
