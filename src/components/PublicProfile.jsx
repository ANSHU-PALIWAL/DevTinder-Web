import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User as UserIcon, MessageSquare, Tag, Phone, X, MoreVertical, ShieldAlert, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const PublicProfile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

  const handleBlock = () => {
    setShowMenu(false);
    setShowBlockModal(true);
  };

  const confirmBlock = async () => {
    try {
      await axios.post(`${API_BASE_URL}/block/${user._id}`, {}, { withCredentials: true });
      setShowBlockModal(false);
      navigate("/connections", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to block user.");
      setShowBlockModal(false);
    }
  };

  const handleReport = () => {
    setShowMenu(false);
    setShowReportModal(true);
  };

  const confirmReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/report/${user._id}`, { reason: reportReason }, { withCredentials: true });
      setShowReportModal(false);
      setReportReason("");
      alert(`Report submitted successfully. Our team will review this shortly.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to report user.");
      setShowReportModal(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[75vh]">
        <h2 className="text-2xl font-extrabold mb-4 text-slate-800 tracking-tight">
          Profile not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    photoUrl,
    about,
    skills,
    age,
    gender,
    mobileNumber,
    gallery = [],
  } = user;
  const displayImage =
    photoUrl ||
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
  const skillsArray = Array.isArray(skills)
    ? skills
    : typeof skills === "string"
      ? skills.split(",")
      : [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 min-h-[85vh]">
      <div className="flex justify-between items-center mb-8 mt-2 relative">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all font-bold text-sm"
        >
          <ArrowLeft size={18} /> Back to Neighbors
        </button>
        <div className="flex items-center gap-3">
          <Link to={`/chat/${user._id}`} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-95">
            <MessageSquare size={18} /> Message {firstName}
          </Link>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="p-3 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50"
                >
                  <button onClick={handleReport} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <Flag size={16} className="text-amber-500" /> Report User
                  </button>
                  <button onClick={handleBlock} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                    <ShieldAlert size={16} /> Block User
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <img
            src={displayImage}
            alt="Profile"
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover ring-8 ring-slate-50 shadow-xl flex-shrink-0 mx-auto md:mx-0"
          />

          <div className="flex-1 space-y-6 w-full text-center md:text-left">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {firstName} {lastName}
              </h2>
              <p className="text-sm font-bold text-slate-400 flex items-center justify-center md:justify-start gap-1.5 mt-2 uppercase tracking-widest">
                <UserIcon size={16} className="text-emerald-500" /> {age} years
                old • {gender}
              </p>
              {mobileNumber && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100 shadow-sm mx-auto md:mx-0">
                  <Phone size={16} /> {mobileNumber}
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                About {firstName}
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {about || "No bio provided yet."}
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Interests & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center shadow-sm"
                  >
                    <Tag size={12} className="mr-1.5" /> {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-12 pt-10 border-t border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-800 mb-6 tracking-tight">
              Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((imgSrc, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(imgSrc)}
                  className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:scale-[1.02] hover:border-emerald-200 transition-all cursor-zoom-in"
                >
                  <img
                    src={imgSrc}
                    alt={`Gallery ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shadow-2xl z-101"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={selectedImage}
              alt="Zoomed Gallery"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block Modal */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Block {user.firstName}?</h2>
              <p className="text-slate-500 mb-8 font-medium">They will no longer be able to see your profile or send you messages.</p>
              
              <div className="flex gap-4 w-full">
                <button onClick={() => setShowBlockModal(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button onClick={confirmBlock} className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all active:scale-95">Block</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
                <Flag size={24} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Report {user.firstName}</h2>
              <p className="text-sm text-slate-500 mb-6 font-medium">Please let us know what's wrong. Our team will review this report securely.</p>
              
              <textarea 
                rows={4}
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                placeholder="Reason for reporting..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none mb-6"
              ></textarea>
              
              <div className="flex gap-4 w-full">
                <button onClick={() => setShowReportModal(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button onClick={confirmReport} disabled={!reportReason.trim()} className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:shadow-none text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95">Submit Report</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicProfile;
