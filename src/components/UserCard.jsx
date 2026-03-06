import axios from "axios";
import React from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Code2, Heart, X, Terminal } from "lucide-react";

// Added isInteractive default so it can still be used in EditProfile as a preview!
const UserCard = ({ user, isInteractive = true }) => {
  const {
    _id = "preview",
    firstName = "Developer",
    lastName = "",
    photoUrl = "",
    age = "0",
    gender = "Unknown",
    about = "No bio provided.",
    skills = [],
  } = user || {};

  const dispatch = useDispatch();

  // Your exact API logic!
  const handleSendRequest = async (status, UserId) => {
    try {
      const res = await axios.post(
        API_BASE_URL + "/request/send/" + status + "/" + UserId,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(UserId));
    } catch (error) {
      // 🛡️ FIX: Clean console error logging
      console.error(
        "Error sending connection request:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // --- Framer Motion Swipe Physics ---
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (!isInteractive) return;
    const swipeThreshold = 100;

    if (info.offset.x > swipeThreshold) {
      handleSendRequest("interested", _id); // Swiped Right
    } else if (info.offset.x < -swipeThreshold) {
      handleSendRequest("ignored", _id); // Swiped Left
    }
  };

  const skillsArray =
    typeof skills === "string"
      ? skills.split(",")
      : Array.isArray(skills)
        ? skills
        : [];
  const displayImage =
    photoUrl ||
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

  return (
    <motion.div
      className={`relative w-full max-w-sm h-[550px] rounded-[2rem] overflow-hidden shadow-2xl bg-base-300 border border-base-200/50 ${
        isInteractive ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      style={{ x: isInteractive ? x : 0, rotate: isInteractive ? rotate : 0 }}
      drag={isInteractive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
    >
      {/* Profile Image */}
      <img
        src={displayImage}
        alt="Profile"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Dynamic Swipe Overlays */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute inset-0 bg-success/20 z-10 pointer-events-none flex items-center justify-center"
      >
        <h1 className="text-5xl font-black text-success border-4 border-success p-4 rounded-xl rotate-12 backdrop-blur-sm tracking-widest shadow-lg shadow-success/50">
          COMMIT
        </h1>
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute inset-0 bg-error/20 z-10 pointer-events-none flex items-center justify-center"
      >
        <h1 className="text-5xl font-black text-error border-4 border-error p-4 rounded-xl -rotate-12 backdrop-blur-sm tracking-widest shadow-lg shadow-error/50">
          DROP
        </h1>
      </motion.div>

      {/* Dark Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-base-300 via-base-300/80 to-transparent z-0 h-full mt-20"></div>

      {/* Profile Details */}
      <div className="absolute bottom-0 w-full p-6 z-20 text-white flex flex-col gap-2">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-2 drop-shadow-md">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-sm font-medium text-gray-300 flex items-center gap-2 mt-1 uppercase tracking-wider">
              <Terminal size={14} className="text-primary" /> {age} • {gender}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed opacity-90">
          {about}
        </p>

        {/* Skills Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {skillsArray.slice(0, 3).map(
            (skill, index) =>
              skill.trim() && (
                <span
                  key={index}
                  className="badge badge-primary badge-outline border-primary/50 text-xs py-3 px-3 backdrop-blur-md bg-base-300/50 uppercase tracking-wider"
                >
                  <Code2 size={12} className="mr-1" /> {skill.trim()}
                </span>
              ),
          )}
          {skillsArray.length > 3 && (
            <span className="badge badge-ghost text-xs py-3">
              +{skillsArray.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons (For manual clicks) */}
        {isInteractive && (
          <div className="flex justify-center items-center w-full mt-4 gap-6">
            <button
              onClick={() => handleSendRequest("ignored", _id)}
              className="btn btn-circle btn-lg bg-base-300/80 backdrop-blur-md border-none text-error hover:bg-error hover:text-white transition-all hover:scale-110 shadow-xl"
            >
              <X size={32} strokeWidth={3} />
            </button>
            <button
              onClick={() => handleSendRequest("interested", _id)}
              className="btn btn-circle btn-lg bg-base-300/80 backdrop-blur-md border-none text-success hover:bg-success hover:text-white transition-all hover:scale-110 shadow-xl"
            >
              <Heart size={28} strokeWidth={3} className="fill-current" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;
