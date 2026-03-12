import axios from "axios";
import React from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { User as UserIcon, Heart, X } from "lucide-react";

const UserCard = ({ user, isInteractive = true, onAction }) => {
  const {
    _id = "preview",
    firstName = "Neighbor",
    lastName = "",
    photoUrl = "",
    age = "0",
    gender = "Unknown",
    about = "No bio provided.",
    skills = [],
  } = user || {};

  const dispatch = useDispatch();

  const handleSendRequest = async (status, UserId) => {
    try {
      const res = await axios.post(
        API_BASE_URL + "/request/send/" + status + "/" + UserId,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(UserId));

      if (onAction) onAction(UserId);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (!isInteractive) return;
    const swipeThreshold = 100;

    if (info.offset.x > swipeThreshold) {
      handleSendRequest("interested", _id);
    } else if (info.offset.x < -swipeThreshold) {
      handleSendRequest("ignored", _id);
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
      className={`relative w-full max-w-sm h-[550px] rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200 border border-slate-100 bg-white ${
        isInteractive ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      style={{ x: isInteractive ? x : 0, rotate: isInteractive ? rotate : 0 }}
      drag={isInteractive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
    >
      <img
        src={displayImage}
        alt="Profile"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute inset-0 bg-emerald-500/20 z-10 pointer-events-none flex items-center justify-center"
      >
        <h1 className="text-5xl font-black text-emerald-500 border-4 border-emerald-500 px-6 py-4 rounded-3xl rotate-12 backdrop-blur-md tracking-widest shadow-2xl">
          CONNECT
        </h1>
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute inset-0 bg-rose-500/20 z-10 pointer-events-none flex items-center justify-center"
      >
        <h1 className="text-5xl font-black text-rose-500 border-4 border-rose-500 px-6 py-4 rounded-3xl -rotate-12 backdrop-blur-md tracking-widest shadow-2xl">
          PASS
        </h1>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-4/5 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-0 pointer-events-none"></div>

      <div className="absolute bottom-0 w-full p-6 z-20 text-white flex flex-col gap-3">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-2 drop-shadow-md text-white leading-tight">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mt-2 uppercase tracking-widest">
              <UserIcon size={14} className="text-emerald-400" /> {age} •{" "}
              {gender}
            </p>
          )}
        </div>

        <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed font-medium">
          {about}
        </p>

        <div className="flex flex-wrap gap-2 mt-1">
          {skillsArray.slice(0, 3).map(
            (skill, index) =>
              skill.trim() && (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest flex items-center shadow-sm"
                >
                  {skill.trim()}
                </span>
              ),
          )}
          {skillsArray.length > 3 && (
            <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest">
              +{skillsArray.length - 3}
            </span>
          )}
        </div>

        {isInteractive && (
          <div className="flex justify-center items-center w-full mt-3 gap-6">
            <button
              onClick={() => handleSendRequest("ignored", _id)}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-rose-500 hover:bg-rose-50 transition-all hover:scale-110 shadow-xl cursor-pointer"
            >
              <X size={28} strokeWidth={3} />
            </button>
            <button
              onClick={() => handleSendRequest("interested", _id)}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-all hover:scale-110 shadow-xl shadow-emerald-500/30 cursor-pointer"
            >
              <Heart size={26} strokeWidth={3} className="fill-current" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;
