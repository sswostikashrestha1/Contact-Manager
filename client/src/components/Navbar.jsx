import { Contact, LogOut, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-100 bg-white/80 backdrop-blur-xl shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

        {/* Logo Branding */}
        <div
          className="group flex cursor-pointer items-center gap-3 transition-transform duration-200 active:scale-95"
          onClick={() => navigate("/")}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 shadow-md shadow-purple-200 ring-2 ring-purple-100 transition-all duration-300 group-hover:shadow-purple-300">
            <Contact size={20} className="text-white transition-transform duration-300 group-hover:rotate-6" />
            <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-slate-800 group-hover:text-purple-700 transition-colors">
                Nexus <span className="text-purple-600 font-semibold">Contacts</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                <Sparkles size={10} /> Pro
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
              Smart Directory & Management
            </p>
          </div>
        </div>

        {/* Right side user menu */}
        <div className="flex items-center gap-3 sm:gap-4">

          {user && (
            <div className="flex items-center gap-3 rounded-full border border-purple-100 bg-purple-50/70 py-1.5 pl-2 pr-4 shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-emerald-400 text-white font-bold text-xs ring-2 ring-white">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={15} />}
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-purple-950 leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] font-medium text-purple-700 truncate max-w-[140px]">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 shadow-xs"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;
