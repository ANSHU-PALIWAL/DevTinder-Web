import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Gets the current URL path
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(API_BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      // RULE 1: If the API fails (401) OR the server is completely offline (Network Error)
      const isUnauthorized = error.response?.status === 401;
      const isServerDown = !error.response;

      if ((isUnauthorized || isServerDown) && location.pathname !== "/login") {
        navigate("/login");
      }
      console.error("Auth check failed:", error.message);
    }
  };

  // 🌍 NEW: Silent Background GPS Tracker
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
            // Silently succeeds in the background!
          } catch (error) {
            console.error("Failed to sync location:", error);
          }
        },
        (error) => {
          // If the user clicks "Block" on the location prompt, we just catch it gracefully.
          console.warn("Location access denied or unavailable:", error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // RULE 2: The Bouncer Effect (Watches the URL and User Data)
  useEffect(() => {
    // If the user IS logged in, and tries to visit the login page, kick them to the Feed (/)
    if (userData && location.pathname === "/login") {
      navigate("/");
    }

    // 🚀 TRIGGER: If the user is logged in successfully, ask for their location!
    if (userData) {
      updateLocation();
    }
  }, [userData, location.pathname, navigate]);

  // Clean UI Check: Is the user currently looking at the login page?
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content font-sans">
      {/* Only show NavBar if we are NOT on the login page */}
      {!isLoginPage && <NavBar />}

      <main
        className={`flex-grow flex flex-col ${!isLoginPage ? "pt-20 pb-8 px-4 sm:px-6 lg:px-8" : ""}`}
      >
        <Outlet />
      </main>

      {/* Only show Footer if we are NOT on the login page */}
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default Body;
