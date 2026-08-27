import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Contact, Mail, Lock, ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-mesh-gradient flex items-center justify-center px-4 py-12 overflow-hidden text-slate-800">
      {/* Soft Light Pastel Ambient Glows */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-200/60 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Top Logo Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-200 ring-4 ring-white animate-float mb-3">
            <Contact size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-purple-950 sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm font-semibold text-purple-700/80">
            Sign in to access your contact directory
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-purple-100 p-7 sm:p-9 shadow-xl shadow-purple-900/5">

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-purple-900">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-purple-400">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition duration-200 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-900">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-purple-400">
                  <Lock size={17} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition duration-200 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition duration-200 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-300 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Signing in..." : "Sign in to Dashboard"}</span>
              {!loading && <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-7 border-t border-purple-100/80 pt-5 text-center text-xs font-semibold text-slate-500">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-bold text-purple-700 hover:text-purple-900 hover:underline transition"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Bottom Feature Badges in Mint Pastel */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-600 text-xs font-semibold">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-emerald-800">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Secure Storage</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3 py-1 text-purple-800">
            <Zap size={14} className="text-purple-600" />
            <span>Instant Search</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-teal-100/80 px-3 py-1 text-teal-800">
            <Users size={14} className="text-teal-600" />
            <span>Categorized</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
