import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    user && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-grow flex items-center justify-center p-4 sm:p-8 min-h-[85vh] w-full"
      >
        <EditProfile user={user} />
      </motion.div>
    )
  );
};

export default Profile;
