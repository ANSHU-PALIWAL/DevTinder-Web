import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { User as UserIcon, Heart, X, MapPin } from "lucide-react";

const RadarView = () => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const loggedInUser = useSelector((store) => store.user);

  // Exact coordinates of the logged in user
  const userLng = loggedInUser?.location?.coordinates?.[0] || 77.209;
  const userLat = loggedInUser?.location?.coordinates?.[1] || 28.6139;

  useEffect(() => {
    const fetchRadarFeed = async () => {
      try {
        const res = await axios.get(
          API_BASE_URL + "/feed/radar?distance=100000",
          { withCredentials: true },
        );
        setNearbyUsers(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load radar data. Please enable location services.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRadarFeed();
  }, []);

  const handleAction = async (status, userId) => {
    try {
      await axios.post(
        API_BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      setNearbyUsers((prev) => prev.filter((u) => u._id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const initialViewState = {
    longitude: userLng,
    latitude: userLat,
    zoom: 11,
    pitch: 45,
    bearing: 0,
  };

  if (loading) {
    return (
      <div className="grow flex items-center justify-center min-h-[calc(100vh-80px)]">
        <span className="loading loading-bars loading-lg text-emerald-500"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grow flex flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-80px)]">
        <MapPin size={48} className="text-rose-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2 text-slate-800">
          Location Required
        </h2>
        <p className="text-slate-500 max-w-md font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold mt-6 transition-all active:scale-95 shadow-lg"
        >
          Refresh Permission
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-50 grow flex flex-col">
      <div className="absolute inset-0 z-0">
        <Map
          initialViewState={initialViewState}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          {/* Exact Marker for Logged In User */}
          <Marker longitude={userLng} latitude={userLat} anchor="bottom">
            <div className="relative group cursor-pointer flex flex-col items-center z-50">
              <div className="absolute -inset-2 bg-blue-400 rounded-full opacity-40 animate-ping"></div>

              <div className="relative w-14 h-14 rounded-full border-4 border-blue-500 shadow-xl overflow-hidden bg-white z-10 transition-transform duration-300 hover:scale-110">
                <img
                  src={
                    loggedInUser?.photoUrl ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-t-blue-500 border-x-transparent z-10"></div>

              <span className="absolute -top-8 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-lg uppercase tracking-widest border border-blue-500 z-20 whitespace-nowrap">
                You Are Here
              </span>
            </div>
          </Marker>

          {/* Exact Markers for Nearby Users */}
          {nearbyUsers.map((user) => {
            const lng = user?.location?.coordinates?.[0];
            const lat = user?.location?.coordinates?.[1];

            // Only map users with strict valid exact coordinates
            if (!lng || !lat || (lng === 0 && lat === 0)) return null;

            // Optional distance calculation label for exact Map markers
            const distanceKm = user.distance
              ? (user.distance / 1000).toFixed(1)
              : "";

            return (
              <Marker
                key={user._id}
                longitude={lng}
                latitude={lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedUser(user);
                }}
              >
                <div className="relative group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -inset-2 bg-emerald-400 rounded-full opacity-30 animate-ping group-hover:bg-emerald-500 group-hover:opacity-50 transition-all"></div>

                  <div
                    className={`relative w-12 h-12 rounded-full border-4 shadow-xl overflow-hidden transition-all duration-300 bg-white ${selectedUser?._id === user._id ? "border-emerald-500 scale-125" : "border-white group-hover:border-emerald-200"}`}
                  >
                    <img
                      src={
                        user.photoUrl ||
                        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                      }
                      alt={user.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-x-transparent transition-all duration-300 ${selectedUser?._id === user._id ? "border-t-emerald-500 scale-125" : "border-t-white group-hover:border-t-emerald-200"}`}
                  ></div>

                  {distanceKm && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-20 text-slate-700 border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-max">
                      <MapPin size={10} className="text-emerald-500" />
                      {distanceKm} km
                    </div>
                  )}
                </div>
              </Marker>
            );
          })}
        </Map>
      </div>

      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-slate-50/80 to-transparent pointer-events-none z-10 hidden md:block"></div>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 w-full sm:left-1/2 sm:-translate-x-1/2 sm:w-[400px] sm:bottom-6 bg-white sm:rounded-3xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 p-6 z-50 flex flex-col"
            style={{ maxHeight: "85vh", overflowY: "auto" }}
          >
            {/* Minimal Mobile Drag Handle */}
            <div
              className="w-12 h-1 bg-gray-200 rounded-full mb-6 cursor-pointer hover:bg-gray-300 transition-colors sm:hidden self-center"
              onClick={() => setSelectedUser(null)}
            />

            {/* Desktop Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors hidden sm:flex items-center justify-center z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="w-full grow flex flex-col">
              {/* Minimal Header Profile */}
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <img
                    src={
                      selectedUser.photoUrl ||
                      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    }
                    alt={selectedUser.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
                    <UserIcon size={14} className="text-gray-400" />
                    {selectedUser.age || "--"} yrs • {selectedUser.gender || "Unknown"}
                  </div>
                  {/* Distance display if available */}
                  {selectedUser.distance && (
                     <div className="mt-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md w-max">
                       {(selectedUser.distance / 1000).toFixed(1)} km away
                     </div>
                  )}
                </div>
              </div>

              {/* Bio & Details */}
              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                  About
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {selectedUser.about || "This neighbor hasn't added a bio yet."}
                </p>

                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedUser.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-[11px] font-semibold rounded-lg border border-gray-200/60"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Minimal Action Grid */}
              <div className="flex items-center justify-between gap-3 mt-auto pt-2">
                <button
                  onClick={() => handleAction("ignored", selectedUser._id)}
                  className="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 hover:text-gray-900 transition-colors active:scale-95"
                >
                  <X size={18} strokeWidth={2.5} />
                  Pass
                </button>
                <button
                  onClick={() => handleAction("interested", selectedUser._id)}
                  className="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95"
                >
                  <Heart size={18} strokeWidth={2.5} className="fill-white/20" />
                  Connect
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadarView;
