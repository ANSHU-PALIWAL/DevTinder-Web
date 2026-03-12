import axios from "axios";
import { useEffect } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { motion } from "framer-motion";
import { Users, MessageSquare, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
      console.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[75vh]">
        <span className="loading loading-bars loading-lg text-emerald-500"></span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 min-h-[75vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 max-w-md w-full"
        >
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
            <Users size={36} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-slate-800 tracking-tight">
            No Neighbors Yet
          </h1>
          <p className="text-slate-500 leading-relaxed mb-6 font-medium">
            Keep exploring your local area! Once a neighbor connects back with
            you, they will appear here ready to chat.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 min-h-[85vh]">
      <div className="mb-8 flex items-center gap-3 mt-4">
        <div className="p-2.5 bg-emerald-50 rounded-xl">
          <Users className="text-emerald-600" size={28} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Your Neighbors
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection, index) => {
          const { _id, firstName, lastName, photoUrl, age, skills, about } =
            connection;
          const skillsArray = Array.isArray(skills) ? skills : [];
          const displayImage =
            photoUrl ||
            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

          return (
            <motion.div
              key={_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-emerald-200 hover:shadow-[0_10px_40px_rgba(16,185,129,0.08)] transition-all duration-300 flex flex-col group"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={displayImage}
                  alt={`${firstName} ${lastName}`}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-50 group-hover:ring-emerald-50 transition-all shadow-sm"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mt-1.5 uppercase tracking-widest">
                    <UserIcon size={14} className="text-emerald-500" /> {age}{" "}
                    years old
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-5 flex-grow leading-relaxed">
                {about || "No bio available."}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {skillsArray.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                  >
                    {skill}
                  </span>
                ))}
                {skillsArray.length > 3 && (
                  <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    +{skillsArray.length - 3}
                  </span>
                )}
              </div>

              <div className="flex gap-3 w-full mt-auto">
                <button className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  Message
                </button>
                <Link
                  to="/match/profile"
                  state={{ user: connection }}
                  className="flex-1 py-3 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <UserIcon size={18} />
                  Profile
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
