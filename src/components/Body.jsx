import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X } from "lucide-react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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

      if ((isUnauthorized || isServerDown) && location.pathname !== "/login") {
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
            await axios.patch(
              API_BASE_URL + "/profile/location",
              { lat: latitude, lng: longitude },
              { withCredentials: true },
            );
          } catch (error) {
            console.error(error);
          }
        },
        (error) => {
          console.warn(error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    if (userData && isLoginPage) {
      navigate("/");
    }

    if (userData) {
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
      {!isLoginPage && <NavBar />}

      <main
        className={`flex-grow flex flex-col ${!isLoginPage ? "pt-20 pb-8 px-4 sm:px-6 lg:px-8" : ""}`}
      >
        <Outlet />
      </main>

      {!isLoginPage && <Footer />}

      <AnimatePresence>
        {showInstallPopup && (
          <motion.div
            initial={{ y: 150, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 150, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="fixed bottom-6 left-1/2 z-[100] w-[90%] max-w-sm bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-2xl p-4 flex flex-col gap-4"
          >
            <button
              onClick={handleDismissForNow}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3 pt-1">
              <div className="bg-emerald-100/80 p-2.5 rounded-xl text-emerald-600 shrink-0 shadow-sm border border-emerald-200/50">
                <Smartphone size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-[15px] tracking-tight">
                  Add to Home Screen
                </h4>
                <p className="text-[13px] text-slate-500 mt-1 leading-relaxed font-medium pr-4">
                  For the best native experience, add ConnectNeighbour directly
                  to your device.
                </p>
              </div>
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Install App
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Body;
