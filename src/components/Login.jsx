import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, Mail, Lock, User as UserIcon } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup

  // Form States
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
      if (isLogin) {
        // LOGIN API CALL
        const res = await axios.post(
          API_BASE_URL + "/login",
          { emailId, password },
          { withCredentials: true },
        );
        dispatch(addUser(res.data));
        navigate("/");
      } else {
        // SIGNUP API CALL (Ensure you have this route in your backend!)
        const res = await axios.post(
          API_BASE_URL + "/signup",
          { firstName, lastName, emailId, password },
          { withCredentials: true },
        );
        dispatch(addUser(res.data)); // Assuming signup returns the user data
        navigate("/profile");
      }
    } catch (err) {
      setError(err?.response?.data || err?.response || "Something went wrong");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 min-h-[85vh]">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-base-300/40 rounded-[2.5rem] shadow-2xl overflow-hidden border border-base-200/50 backdrop-blur-md">
        {/* Left Side: Dynamic Terminal Mockup */}
        <div className="hidden md:flex flex-col justify-center p-14 bg-gradient-to-br from-base-300 to-base-200 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10">
            <TerminalSquare size={48} className="text-primary mb-6" />
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">
              {isLogin ? "Welcome Back." : "Join the Network."}
            </h1>
            <p className="text-lg opacity-70 mb-8 max-w-sm">
              {isLogin
                ? "Ready to find your next pair programming soulmate? Access your dashboard."
                : "Create an account to start matching with top-tier developers in your area."}
            </p>

            <div className="mockup-code bg-base-300 shadow-2xl border border-base-100/50 text-sm">
              <pre data-prefix="$">
                <code>
                  {isLogin
                    ? "npm run devtinder --login"
                    : "npx create-dev-profile"}
                </code>
              </pre>
              <pre data-prefix=">" className="text-warning">
                <code>authenticating credentials...</code>
              </pre>
              <pre data-prefix=">" className="text-success">
                <code>
                  {isLogin ? "Access granted." : "Profile initialized."}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-base-100/60 z-10 relative">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? "Sign In" : "Sign Up"}
            </h2>
            <p className="text-base-content/60">
              {isLogin
                ? "Enter your email and password to connect."
                : "Fill in your details to get started."}
            </p>
          </div>

          <div className="space-y-4">
            {/* Animated Signup Fields (First Name & Last Name) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  className="grid grid-cols-2 gap-4 overflow-hidden"
                >
                  <div className="relative">
                    <UserIcon
                      size={18}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
                    />
                    <input
                      type="text"
                      value={firstName}
                      placeholder="First Name"
                      className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <UserIcon
                      size={18}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
                    />
                    <input
                      type="text"
                      value={lastName}
                      placeholder="Last Name"
                      className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
              />
              <input
                type="email"
                value={emailId}
                placeholder="Email Address"
                className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
              />
              <input
                type="password"
                value={password}
                placeholder="Password"
                className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-error text-sm font-medium px-1 bg-error/10 p-2 rounded-lg border border-error/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/40 border-none rounded-xl"
              onClick={handleAuth}
            >
              {isLogin ? "Login to Dashboard" : "Create Account"}
            </motion.button>

            {/* Toggle State */}
            <div className="text-center mt-6 text-sm text-base-content/70">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(""); // clear errors on swap
                }}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
