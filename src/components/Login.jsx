import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Heart,
  Handshake,
} from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [emailId, setEmailId] = useState("Anshu@gmail.com");
  const [password, setPassword] = useState("Anshu@123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const payload = isLogin
        ? { emailId, password }
        : { firstName, lastName, emailId, password };
      const res = await axios.post(API_BASE_URL + endpoint, payload, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
      navigate(isLogin ? "/" : "/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-[#F8FAFC] min-h-[90vh] font-sans antialiased">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100">
        {/* Left Side: The Premium Design you liked */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-[#F1F5F9] relative overflow-hidden">
          {/* Those high-end blurred circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/50 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/50 rounded-full blur-[100px] -ml-32 -mb-32" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8 text-emerald-600">
              <MapPin size={28} strokeWidth={2.5} />
              <span className="font-bold text-lg tracking-tight text-slate-800 uppercase">
                ConnectNeighbour
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              {isLogin
                ? "Welcome back to the street."
                : "Your neighbors are waiting."}
            </h1>

            <p className="text-slate-600 text-base mb-10 leading-relaxed max-w-sm">
              {isLogin
                ? "Sign in to see who's nearby, borrow a hand, or share a coffee."
                : "Join the most trusted hyper-local network. It's time to know who lives next door."}
            </p>

            {/* Feature Icons */}
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-emerald-500">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                  Privacy First: No numbers shared
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-500">
                  <Handshake size={20} />
                </div>
                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                  Mutual Match Only
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-rose-500">
                  <Heart size={20} />
                </div>
                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                  1km - 5km Local Radius
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Form with Minimalist Fonts */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Please enter your details to continue.
            </p>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      First Name
                    </label>
                    <input
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
                      placeholder="Rahul"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Last Name
                    </label>
                    <input
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
                      placeholder="Sharma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
                  placeholder="name@email.com"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
                {error}
              </p>
            )}

            <button
              onClick={handleAuth}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-100 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>

            <div className="pt-6 text-center">
              <span className="text-slate-400 text-xs font-medium">
                {isLogin ? "New to the neighborhood?" : "Already a member?"}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="ml-2 text-emerald-600 font-bold hover:underline cursor-pointer text-xs uppercase tracking-wider"
              >
                {isLogin ? "Join Now" : "Log In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
