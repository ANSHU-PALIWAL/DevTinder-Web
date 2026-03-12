import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Check,
  X,
  Send,
  Clock,
  User as UserIcon,
} from "lucide-react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [activeTab, setActiveTab] = useState("received");

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        API_BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const fetchRequests = async (tab) => {
    try {
      dispatch(addRequests(null));

      const endpoint =
        tab === "received" ? "/user/requests/received" : "/user/requests/sent";

      const res = await axios.get(API_BASE_URL + endpoint, {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 min-h-[85vh]">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <UserPlus
              className="text-emerald-600"
              size={28}
              strokeWidth={2.5}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Requests
          </h1>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200 w-fit">
          <button
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
              activeTab === "received"
                ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("received")}
          >
            Received
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
              activeTab === "sent"
                ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent
          </button>
        </div>
      </div>

      {!requests ? (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-bars loading-lg text-emerald-500"></span>
        </div>
      ) : requests.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center text-center p-10 mt-10 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 max-w-lg mx-auto"
        >
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
            {activeTab === "received" ? (
              <UserPlus size={36} className="text-emerald-500" />
            ) : (
              <Send size={36} className="text-emerald-500" />
            )}
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-slate-800 tracking-tight">
            {activeTab === "received" ? "Inbox Zero!" : "No Sent Requests"}
          </h1>
          <p className="text-slate-500 leading-relaxed font-medium">
            {activeTab === "received"
              ? "You have no pending connection requests right now. Go explore your neighborhood!"
              : "You haven't reached out to any neighbors yet. Head back to the feed to connect!"}
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {requests.map((request) => {
              const targetUser =
                activeTab === "received"
                  ? request.fromUserId
                  : request.toUserId;

              const { firstName, lastName, photoUrl, age, skills, about } =
                targetUser || {};
              const skillsArray = Array.isArray(skills) ? skills : [];
              const displayImage =
                photoUrl ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

              return (
                <motion.div
                  key={request._id}
                  layout
                  initial={{
                    opacity: 0,
                    x: activeTab === "received" ? -50 : 50,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-emerald-100 transition-colors group"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <img
                      src={displayImage}
                      alt={`${firstName} ${lastName}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-slate-50 group-hover:ring-emerald-50 transition-all shadow-sm"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {firstName} {lastName}
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-slate-100">
                          {age}y
                        </span>
                      </h2>
                      <p className="text-sm text-slate-500 font-medium line-clamp-1 mb-2 max-w-md mt-1">
                        {about || "No bio available."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skillsArray.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-md text-[9px] font-bold uppercase tracking-widest flex items-center"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    {activeTab === "received" ? (
                      <>
                        <button
                          className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm active:scale-95 flex-1 sm:flex-none cursor-pointer"
                          onClick={() => reviewRequest("rejected", request._id)}
                          title="Decline"
                        >
                          <X size={22} strokeWidth={3} />
                        </button>
                        <button
                          className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/30 active:scale-95 flex-1 sm:flex-none cursor-pointer"
                          onClick={() => reviewRequest("accepted", request._id)}
                          title="Accept"
                        >
                          <Check size={22} strokeWidth={3} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest">
                        <Clock size={14} /> Pending
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Requests;
