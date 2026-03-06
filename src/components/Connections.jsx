import axios from "axios";
import { useEffect } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice"; // Ensure this path is correct!
import { motion } from "framer-motion";
import { Users, MessageSquare, Terminal, Code2 } from "lucide-react";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(API_BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      // 🛡️ FIX: Clean console error logging
      console.error(
        "Error fetching connections:",
        error.response?.data?.message || error.message,
      );
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[75vh]">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 min-h-[75vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-base-300/50 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-base-200 max-w-md w-full"
        >
          <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Users size={36} className="text-primary opacity-50" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            No Connections Yet
          </h1>
          <p className="text-base-content/60 leading-relaxed mb-6">
            Keep swiping! Once someone commits back to your profile, they will
            appear here ready to chat.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 min-h-[85vh]">
      <div className="mb-8 flex items-center gap-3">
        <Users className="text-primary" size={32} />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Your Network
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection, index) => {
          const { _id, firstName, lastName, photoUrl, age, skills, about } =
            connection;
          const skillsArray = Array.isArray(skills) ? skills : [];
          const displayImage = photoUrl || "https://via.placeholder.com/150";

          return (
            <motion.div
              key={_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-base-300/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-base-200/50 hover:border-primary/30 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={displayImage}
                  alt={`${firstName} ${lastName}`}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-primary ring-offset-base-300 ring-offset-2 shadow-lg"
                />
                <div>
                  <h2 className="text-xl font-bold">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-sm text-base-content/60 flex items-center gap-1 mt-1">
                    <Terminal size={14} className="text-primary" /> {age} years
                    old
                  </p>
                </div>
              </div>

              <p className="text-sm text-base-content/70 line-clamp-2 mb-4 flex-grow">
                {about || "No bio available."}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {skillsArray.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge badge-sm badge-outline text-xs py-2"
                  >
                    <Code2 size={10} className="mr-1" /> {skill}
                  </span>
                ))}
                {skillsArray.length > 3 && (
                  <span className="badge badge-sm badge-ghost text-xs py-2">
                    +{skillsArray.length - 3}
                  </span>
                )}
              </div>

              <button className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform border-none rounded-xl">
                <MessageSquare size={18} />
                Message
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
