import { useNavigate } from "react-router-dom";

const Discovery = () => {
  const navigate = useNavigate();

  return (
    <div className="border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl font-black mb-4">Discovery</h2>
      <p className="text-sm text-gray-600 mb-6">
        This is a placeholder Discovery component.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="px-4 py-3 border-2 border-black font-black uppercase tracking-widest bg-black text-white"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Discovery;
