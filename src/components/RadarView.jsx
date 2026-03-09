import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, AlertCircle, X } from "lucide-react"; // 👈 Added X
import UserCard from "./UserCard"; // 👈 Imported your UserCard!

const hashStr = (str) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const RadarView = () => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚀 NEW STATE: Tracks which user the modal is open for
  const [selectedUser, setSelectedUser] = useState(null);

  const loggedInUser = useSelector((store) => store.user);

  useEffect(() => {
    const fetchRadarFeed = async () => {
      try {
        const res = await axios.get(
          API_BASE_URL + "/feed/radar?distance=100000",
          {
            withCredentials: true,
          },
        );
        setNearbyUsers(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load radar data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRadarFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[75vh]">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center min-h-[75vh]">
        <AlertCircle size={48} className="text-error mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Radar Offline</h2>
        <p className="text-base-content/60 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-6"
        >
          Refresh Permission
        </button>
      </div>
    );
  }

  const RINGS = [
    { maxDist: 2000, radius: 130, label: "0 - 2km" }, // 0 - 2km
    { maxDist: 5000, radius: 180, label: "2 - 5km" }, // 2 - 5km
    { maxDist: 10000, radius: 230, label: "5 - 10km" }, // 5 - 10km
    { maxDist: Infinity, radius: 280, label: "10km+" }, // 10km+
  ];

  const ringGroups = [[], [], [], []];

  nearbyUsers.forEach((user) => {
    for (let i = 0; i < RINGS.length; i++) {
      if (user.distance <= RINGS[i].maxDist) {
        ringGroups[i].push(user);
        break;
      }
    }
  });

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[85vh] p-4 overflow-hidden relative">
      <div className="mb-6 md:mb-10 text-center z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
          <Navigation className="text-primary" size={32} />
          Developers Near You
        </h1>
        <p className="text-sm md:text-base text-base-content/60 mt-2">
          Discover pair programming partners within 100km.
        </p>
      </div>

      <div className="relative w-[600px] h-[600px] flex items-center justify-center bg-base-300/20 rounded-full border border-base-200 shadow-2xl scale-[0.6] sm:scale-75 md:scale-100 origin-center transition-transform">
        {RINGS.map((ring, idx) => (
          <div
            key={idx}
            className="absolute rounded-full border border-primary/20 pointer-events-none flex items-start justify-center"
            style={{ width: ring.radius * 2, height: ring.radius * 2 }}
          >
            <span className="text-[10px] font-bold text-primary/40 bg-base-100/80 px-1 rounded -mt-2 backdrop-blur-sm z-0">
              {ring.label}
            </span>
          </div>
        ))}

        <motion.div
          animate={{ scale: [1, 2, 3], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-20 h-20 bg-primary/30 rounded-full pointer-events-none"
        />

        <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-4 ring-primary bg-base-200 overflow-hidden shadow-xl shadow-primary/20">
            <img
              src={
                loggedInUser?.photoUrl ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="mt-2 text-[10px] md:text-xs font-bold bg-base-300 px-3 py-1 rounded-full shadow-lg border border-base-200 text-primary uppercase tracking-widest">
            You
          </span>
        </div>

        {ringGroups.map((group, ringIndex) => {
          const ringRadius = RINGS[ringIndex].radius;

          return group.map((user, userIndex) => {
            const angle =
              (userIndex * (Math.PI * 2)) / group.length + ringIndex * 0.5;
            const finalRadius = ringRadius;

            const targetX = Math.cos(angle) * finalRadius;
            const targetY = Math.sin(angle) * finalRadius;

            const distanceKm = (user.distance / 1000).toFixed(1);

            return (
              <motion.div
                key={user._id}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, x: targetX, y: targetY }}
                transition={{
                  delay: userIndex * 0.1 + ringIndex * 0.2,
                  type: "spring",
                  stiffness: 60,
                  damping: 12,
                }}
                className="absolute z-40 flex flex-col items-center group cursor-pointer hover:z-50"
              >
                {/* 🚀 FIXED: Replaced <Link> with a clickable trigger that opens the Modal! */}
                <div
                  onClick={() => setSelectedUser(user)}
                  className="relative pointer-events-auto"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full ring-2 ring-secondary bg-base-200 overflow-hidden shadow-lg transition-transform group-hover:scale-125 group-hover:ring-4">
                    <img
                      src={
                        user.photoUrl ||
                        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                      }
                      alt={user.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute -bottom-2 -right-4 bg-base-300 border border-base-200 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-20">
                    <MapPin size={10} className="text-secondary" />
                    {distanceKm}km
                  </div>
                </div>

                <div className="absolute top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-base-300 border border-base-200 px-3 py-1.5 rounded-xl shadow-2xl pointer-events-none w-max text-center z-50">
                  <p className="font-bold text-xs md:text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] md:text-xs text-base-content/60 uppercase">
                    {user.skills?.[0] || "Developer"}
                  </p>
                </div>
              </motion.div>
            );
          });
        })}
      </div>

      {/* 📸 NEW: The Swipe Modal! */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-base-300/80 backdrop-blur-md p-4"
          >
            <div className="relative w-full max-w-sm">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute -top-14 right-0 btn btn-circle btn-sm bg-base-100 border-base-300 hover:bg-base-200 text-base-content shadow-xl z-50"
              >
                <X size={20} />
              </button>

              <UserCard
                user={selectedUser}
                isInteractive={true}
                onAction={(userId) => {
                  // Hide the user from the radar instantly
                  setNearbyUsers((prev) =>
                    prev.filter((u) => u._id !== userId),
                  );
                  // Close the modal
                  setSelectedUser(null);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadarView;
