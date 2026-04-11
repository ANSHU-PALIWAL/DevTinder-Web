import React, { useEffect, useState, useRef } from "react";
import NavBar from "./NavBar";
import PublicNavBar from "./PublicNavBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X } from "lucide-react";

// Routes accessible without authentication
const PUBLIC_ROUTES = ["/login", "/home", "/about", "/blogs", "/contact"];

const isPublicRoute = (pathname) => {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  // match /blogs/:slug
  if (pathname.startsWith("/blogs/")) return true;
  return false;
};

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const locationUpdatedRef = useRef(false);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(API_BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      const isUnauthorized = error.response?.status === 401;
      const isServerDown = !error.response;

      // Only redirect to /login for protected routes — public pages stay accessible
      if (
        (isUnauthorized || isServerDown) &&
        !isPublicRoute(location.pathname)
      ) {
        navigate("/login");
      }
      console.error(error.message);
    }
  };

  const updateLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
              const res = await axios.patch(
                API_BASE_URL + "/profile/location",
                { lat: latitude, lng: longitude },
                { withCredentials: true },
              );
              if (res.data?.data) {
                dispatch(addUser(res.data.data));
              }
            } catch (error) {
              console.error(error);
            }
          },
          (error) => {
            console.warn(error.message);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
        );
      }
    };

  useEffect(() => {
    fetchUser();
  }, []);

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    // Logged-out user hits the root — send to public home page
    if (!userData && location.pathname === "/") {
      navigate("/home");
    }

    // Logged-in user on login page — send to feed
    if (userData && isLoginPage) {
      navigate("/");
    }

    if (userData && !locationUpdatedRef.current) {
      locationUpdatedRef.current = true;
      updateLocation();
    }
  }, [userData, location.pathname, navigate]);

  // 🚀 FIX 1: ALWAYS show the popup if not dismissed, independent of the browser event
  useEffect(() => {
    if (userData && !isLoginPage) {
      const isDismissed = localStorage.getItem("dismissedInstall");
      if (!isDismissed) {
        const timer = setTimeout(() => setShowInstallPopup(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [userData, isLoginPage]);

  // 🚀 FIX 2: Silently listen for the native prompt in the background
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleDismissForever = () => {
    localStorage.setItem("dismissedInstall", "true");
    setShowInstallPopup(false);
  };

  const handleDismissForNow = () => {
    setShowInstallPopup(false);
  };

  // 🚀 FIX 3: Smart Install Click Handler
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // The browser is ready, show the native installer
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        handleDismissForever();
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for Safari/iOS or strict browsers
      alert(
        "To install: Tap your browser's 'Share' or 'Menu' icon, then select 'Add to Home Screen'.",
      );
      handleDismissForever();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">
      {userData ? <NavBar /> : <PublicNavBar />}

      <main
        className={`flex-grow flex flex-col ${userData && !isLoginPage ? "pt-20 pb-8 px-4 sm:px-6 lg:px-8" : ""}`}
      >
        <Outlet />
      </main>

      {userData && <Footer />}

      <AnimatePresence>
        {showInstallPopup && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20, rotate: -2 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -50, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:bottom-8 z-100 md:w-[400px] bg-white/95 backdrop-blur-xl border border-white/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] rounded-3xl md:rounded-4xl p-4 sm:p-6 overflow-hidden group"
          >
            {/* Decorative Glow */}
            <div className="absolute -top-16 -left-16 w-32 h-32 sm:w-40 sm:h-40 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover:scale-150"></div>
            
            <button
              onClick={handleDismissForNow}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 sm:p-2 rounded-full transition-all z-20 cursor-pointer"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
            </button>

            <div className="flex gap-3 sm:gap-5 items-start relative z-10">
              <div className="bg-linear-to-br from-emerald-400 to-emerald-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white shadow-xl shadow-emerald-500/30 shrink-0 relative overflow-hidden group-hover:shadow-emerald-500/50 transition-shadow duration-500">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                <Smartphone size={24} className="sm:w-[28px] sm:h-[28px]" strokeWidth={2} />
              </div>
              
              <div className="flex-1 pr-6 sm:pr-8">
                <h4 className="font-extrabold text-slate-800 text-base sm:text-lg tracking-tight leading-tight mb-1">
                  Install App
                </h4>
                <p className="text-[11px] sm:text-[13px] text-slate-500 leading-relaxed font-medium mb-3 sm:mb-5">
                  Get ConnectNeighbour on your home screen for blazing fast native performance.
                </p>
                
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 text-white text-[10px] sm:text-[12px] font-extrabold uppercase tracking-widest rounded-lg sm:rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Smartphone size={14} className="sm:w-[16px] sm:h-[16px]" />
                  Add to Home Screen
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Body;
