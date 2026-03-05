import axios from "axios";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare } from "lucide-react";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(API_BASE_URL + "/feed", {
        withCredentials: true,
      });
      // Your logic: taking the nested data array
      dispatch(addFeed(res?.data?.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // 1. Loading State
  if (!feed) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[75vh]">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  // 2. Premium Empty State
  if (feed.length <= 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 min-h-[75vh]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-base-300/50 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-base-200 max-w-md w-full"
        >
          <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <TerminalSquare size={36} className="text-primary opacity-50" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Out of Devs!
          </h1>
          <p className="text-base-content/60 leading-relaxed mb-6">
            You've reviewed all developers in your area. Update your profile or check back later to find more pair-programming matches.
          </p>
        </motion.div>
      </div>
    );
  }

  // 3. The 3D Stacked Deck UI
  return (
    <div className="flex-grow flex items-center justify-center w-full min-h-[75vh] pb-10 overflow-hidden">
      <div className="relative w-full max-w-sm h-[550px]">
        <AnimatePresence>
          {/* Slicing to show only 3 cards max for performance, reversing to stack correctly */}
          {[...feed].slice(0, 3).reverse().map((user, index, array) => {
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
                  scale: 1 - depth * 0.05
                }}
                exit={{ x: 300, opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
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