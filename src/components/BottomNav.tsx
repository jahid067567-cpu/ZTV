import { Home, Library } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glass rounded-2xl px-2 py-2 flex gap-1 glow-sm">
      <button
        onClick={() => navigate("/")}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
          isActive("/")
            ? "gradient-primary text-primary-foreground glow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>
      <button
        onClick={() => navigate("/library")}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
          isActive("/library")
            ? "gradient-primary text-primary-foreground glow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        <Library className="w-5 h-5" />
        <span>Library</span>
      </button>
    </div>
  );
};

export default BottomNav;
