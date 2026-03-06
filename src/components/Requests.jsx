import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice"; // Ensure this path is correct!
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, CheckCircle2, XCircle, Code2 } from "lucide-react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const reviewRequest = async (status, _id) => {
    try {
      // Added 'await' here to ensure the backend updates before Redux removes it visually
      await axios.post(
        API_BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      // 🛡️ FIX: Clean console error logging
      console.error(
        "Error reviewing request:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      // 🛡️ FIX: Clean console error logging
      console.error(
        "Error fetching requests:",
        error.response?.data?.message || error.message,
      );
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[75vh]">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 min-h-[75vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-base-300/50 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-base-200 max-w-md w-full"
        >
          <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <UserPlus size={36} className="text-primary opacity-50" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Inbox Zero!
          </h1>
          <p className="text-base-content/60 leading-relaxed mb-6">
            You have no pending connection requests right now. Go swipe on some
            developers!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 min-h-[85vh]">
      <div className="mb-8 flex items-center gap-3">
        <UserPlus className="text-primary" size={32} />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Pending Requests
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, skills, about } =
              request.fromUserId || {};
            const skillsArray = Array.isArray(skills) ? skills : [];
            const displayImage = photoUrl || "https://via.placeholder.com/150";

            return (
              <motion.div
                key={request._id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="bg-base-300/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border border-base-200/50 flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                {/* Left Side: Info */}
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

                {/* Right Side: Actions */}
                <div className="flex gap-3 w-full sm:w-auto">
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
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Requests;
