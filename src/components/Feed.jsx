import axios from "axios";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(API_BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[75vh]">
        <span className="loading loading-bars loading-lg text-emerald-500"></span>
      </div>
    );
  }

  if (feed.length <= 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 min-h-[75vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 max-w-md w-full"
        >
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
            <Compass size={36} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-slate-800 tracking-tight">
            You're all caught up!
          </h1>
          <p className="text-slate-500 leading-relaxed mb-6 font-medium">
            You have seen all the neighbors in your current radius. Update your
            profile or check back later to connect with new people nearby.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center w-full min-h-[75vh] pb-10 overflow-hidden">
      <div className="relative w-full max-w-sm h-[550px]">
        <AnimatePresence>
          {[...feed]
            .slice(0, 3)
            .reverse()
            .map((user, index, array) => {
              const isTopCard = index === array.length - 1;
              const depth = array.length - 1 - index;

              return (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{
                    opacity: 1 - depth * 0.15,
                    y: depth * 15,
                    scale: 1 - depth * 0.05,
                  }}
                  exit={{
                    x: 300,
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    pointerEvents: isTopCard ? "auto" : "none",
                    zIndex: index,
                  }}
                >
                  <UserCard user={user} isInteractive={true} />
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;
