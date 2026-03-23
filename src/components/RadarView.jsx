import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Radio, AlertCircle, X } from "lucide-react";
import UserCard from "./UserCard";

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
        <span className="loading loading-bars loading-lg text-emerald-500"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center min-h-[75vh]">
        <AlertCircle size={48} className="text-rose-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2 text-slate-800">
          Radar Offline
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

  const RINGS = [
    { maxDist: 10000, radius: 130, label: "0 - 10km" },
    { maxDist: 25000, radius: 180, label: "10 - 25km" },
    { maxDist: 50000, radius: 230, label: "25 - 50km" },
    { maxDist: 100000, radius: 280, label: "50 - 100km" },
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
      <div className="mb-8 md:mb-12 text-center z-10 mt-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-3">
          <Radio className="text-emerald-500" size={32} />
          Neighbors Nearby
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-medium mt-2">
          Discover and connect with people in your local area.
        </p>
      </div>

      <div className="relative w-[600px] h-[600px] flex items-center justify-center bg-slate-50/50 rounded-full border border-slate-200/50 shadow-[0_0_100px_rgba(16,185,129,0.05)] scale-[0.55] sm:scale-75 md:scale-100 origin-center transition-transform">
        {RINGS.map((ring, idx) => (
          <div
            key={idx}
            className="absolute rounded-full border border-slate-200 pointer-events-none flex items-start justify-center"
            style={{ width: ring.radius * 2, height: ring.radius * 2 }}
          >
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full -mt-2.5 shadow-sm z-0 uppercase tracking-widest border border-slate-100">
              {ring.label}
            </span>
          </div>
        ))}

        <motion.div
          animate={{ scale: [1, 2.5, 4], opacity: [0.4, 0.1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-24 h-24 bg-emerald-400/30 rounded-full pointer-events-none"
        />

        <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
            <img
              src={
                loggedInUser?.photoUrl ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="mt-3 text-[10px] md:text-xs font-bold bg-slate-800 text-white px-3 py-1 rounded-full shadow-lg uppercase tracking-widest border border-slate-700">
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
                <div
                  onClick={() => setSelectedUser(user)}
                  className="relative pointer-events-auto"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full ring-4 ring-white bg-slate-100 overflow-hidden shadow-lg transition-transform duration-300 ease-out group-hover:scale-125 group-hover:shadow-2xl group-hover:ring-emerald-100">
                    <img
                      src={
                        user.photoUrl ||
                        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                      }
                      alt={user.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute -bottom-2 -right-4 bg-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-20 text-slate-700 border border-slate-100">
                    <MapPin size={10} className="text-emerald-500" />
                    {distanceKm} km
                  </div>
                </div>

                <div className="absolute top-16 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] pointer-events-none w-max text-center z-50">
                  <p className="font-bold text-sm text-slate-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">
                    {user.skills?.[0] || "Neighbor"}
                  </p>
                </div>
              </motion.div>
            );
          });
        })}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
          >
            <div className="relative w-full max-w-sm">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute -top-14 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-rose-500 hover:bg-slate-50 transition-colors shadow-xl z-50 cursor-pointer"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <UserCard
                user={selectedUser}
                isInteractive={true}
                onAction={(userId) => {
                  setNearbyUsers((prev) =>
                    prev.filter((u) => u._id !== userId),
                  );
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
