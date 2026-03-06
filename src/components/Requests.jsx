import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, CheckCircle2, XCircle, Send, Clock } from "lucide-react";

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
      console.error(
        "Error reviewing request:",
        error.response?.data?.message || error.message,
      );
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
      console.error(
        "Error fetching requests:",
        error.response?.data?.message || error.message,
      );
    }
  };

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 min-h-[85vh]">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <UserPlus className="text-primary" size={32} />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Requests
          </h1>
        </div>

        <div className="tabs tabs-boxed bg-base-300/50 p-1 rounded-xl w-fit shadow-sm border border-base-200">
          <button
            className={`tab px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "received" ? "bg-primary text-primary-content shadow-md" : "text-base-content/60 hover:text-primary"}`}
            onClick={() => setActiveTab("received")}
          >
            Received
          </button>
          <button
            className={`tab px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "sent" ? "bg-primary text-primary-content shadow-md" : "text-base-content/60 hover:text-primary"}`}
            onClick={() => setActiveTab("sent")}
          >
            Sent
          </button>
        </div>
      </div>

      {!requests ? (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
      ) : requests.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center text-center p-10 mt-10 bg-base-300/50 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-base-200 max-w-lg mx-auto"
        >
          <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            {activeTab === "received" ? (
              <UserPlus size={36} className="text-primary opacity-50" />
            ) : (
              <Send size={36} className="text-primary opacity-50" />
            )}
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {activeTab === "received" ? "Inbox Zero!" : "No Sent Requests"}
          </h1>
          <p className="text-base-content/60 leading-relaxed">
            {activeTab === "received"
              ? "You have no pending connection requests right now. Go swipe on some developers!"
              : "You haven't committed to any developers yet. Go find your next pair programming partner!"}
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
                  className="bg-base-300/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border border-base-200/50 flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <img
                      src={displayImage}
                      alt={`${firstName} ${lastName}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-base-100 shadow-lg"
                    />
                    <div>
                      <h2 className="text-xl font-bold">
                        {firstName} {lastName}{" "}
                        <span className="text-sm font-normal text-base-content/60 ml-2">
                          {age}y
                        </span>
                      </h2>
                      <p className="text-sm text-base-content/70 line-clamp-1 mb-2 max-w-md">
                        {about || "No bio available."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skillsArray.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="badge badge-sm badge-primary badge-outline text-[10px] py-1"
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
                          className="btn btn-circle btn-outline btn-error hover:bg-error hover:text-white transition-all shadow-md flex-1 sm:flex-none"
                          onClick={() => reviewRequest("rejected", request._id)}
                          title="Reject"
                        >
                          <XCircle size={24} />
                        </button>
                        <button
                          className="btn btn-circle bg-success/10 text-success hover:bg-success hover:text-white border-none transition-all shadow-md flex-1 sm:flex-none"
                          onClick={() => reviewRequest("accepted", request._id)}
                          title="Accept"
                        >
                          <CheckCircle2 size={24} />
                        </button>
                      </>
                    ) : (
                      <div className="badge badge-primary badge-outline py-4 px-4 gap-2 font-bold shadow-sm uppercase tracking-wider text-xs">
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
