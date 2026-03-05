import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, TerminalSquare } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[75vh] text-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Floating Terminal Icon */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex justify-center mb-6 text-primary opacity-80"
        >
          <TerminalSquare size={120} strokeWidth={1} />
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-2xl mb-2">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Route Not Found
        </h2>
        <p className="text-base-content/60 max-w-md mx-auto mb-8 text-lg leading-relaxed">
          Looks like this branch got deleted or the route doesn't exist in the repository. Let's get you back to safety.
        </p>

        {/* Action Button */}
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-lg shadow-xl shadow-primary/30 border-none rounded-2xl"
          >
            <Home className="mr-2" size={20} />
            Return to Base
          </motion.button>
        </Link>
      </motion.div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default NotFound;