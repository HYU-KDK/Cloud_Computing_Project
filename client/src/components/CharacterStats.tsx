import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Character from "./common/Character";

const CharacterStats = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return (
      <div className="p-8">
        <div className="font-black mb-4">No user data</div>
        <button
          onClick={() => navigate("/onboarding")}
          className="px-4 py-3 border-2 border-black font-black uppercase tracking-widest bg-black text-white"
        >
          Go to Onboarding
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black mb-6">Character Growth</h2>

        <div className="flex items-center gap-6 mb-6">
          <Character
            gender={user.gender}
            stage={(user as any).currentStage ?? 0}
            size={120}
          />

          <div>
            <div className="text-sm text-gray-500">
              Gender: <span className="font-black">{user.gender}</span>
            </div>
            <div className="text-sm text-gray-500">
              Stage:{" "}
              <span className="font-black">
                {(user as any).currentStage ?? 0}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Total Correct:{" "}
              <span className="font-black">
                {(user as any).totalCorrectCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-3 border-2 border-black font-black uppercase tracking-widest bg-black text-white"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CharacterStats;
