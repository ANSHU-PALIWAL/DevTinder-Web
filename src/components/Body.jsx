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
  const location = useLocation();
  const userData = useSelector((store) => store.user);

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

  useEffect(() => {
    if (userData && location.pathname === "/login") {
      navigate("/");
    }

    if (userData) {
      updateLocation();
    }
  }, [userData, location.pathname, navigate]);

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {!isLoginPage && <NavBar />}

      <main
        className={`flex-grow flex flex-col ${!isLoginPage ? "pt-20 pb-8 px-4 sm:px-6 lg:px-8" : ""}`}
      >
        <Outlet />
      </main>

      {!isLoginPage && <Footer />}
    </div>
  );
};

export default Body;
