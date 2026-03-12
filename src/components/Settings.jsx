import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("security");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdatePassword = async () => {
    setMessage({ text: "", type: "" });
    try {
      await axios.patch(
        API_BASE_URL + "/profile/password",
        { currentPassword, newPassword },
        { withCredentials: true },
      );
      setMessage({ text: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password.";
      setMessage({ text: errorMessage, type: "error" });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(API_BASE_URL + "/profile/delete", {
        withCredentials: true,
      });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete account.";
      setMessage({ text: errorMessage, type: "error" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 min-h-[85vh] flex flex-col">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-900">
          Account Settings
        </h1>
        <p className="text-slate-500 font-medium">
          Manage your security and account data.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-3 rounded-xl flex items-center gap-3 font-bold text-sm transition-all text-left w-full ${activeTab === "security" ? "bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent"}`}
          >
            <Shield size={18} /> Security
          </button>
          <button
            onClick={() => setActiveTab("danger")}
            className={`px-4 py-3 rounded-xl flex items-center gap-3 font-bold text-sm transition-all text-left w-full ${activeTab === "danger" ? "bg-rose-50 text-rose-600 shadow-sm border border-rose-100" : "text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent"}`}
          >
            <AlertTriangle size={18} /> Danger Zone
          </button>
        </div>

        <div className="md:col-span-3 bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "security" && (
              <motion.div
                key="sec"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 tracking-tight">
                  <Shield className="text-emerald-500" size={24} /> Change
                  Password
                </h2>
                <div className="space-y-5 max-w-md">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={handleUpdatePassword}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95 mt-4"
                  >
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "danger" && (
              <motion.div
                key="dang"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-rose-500 tracking-tight">
                  <AlertTriangle size={24} /> Danger Zone
                </h2>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-rose-600 mb-2">
                    Delete Account
                  </h3>
                  <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                    Once you delete your account, there is no going back. Please
                    be certain. All your data, connections, and messages will be
                    permanently wiped.
                  </p>

                  {!isDeleting ? (
                    <button
                      onClick={() => setIsDeleting(true)}
                      className="px-6 py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} /> Delete My Account
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <p className="font-bold text-rose-600 animate-pulse">
                        Are you absolutely sure?
                      </p>
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button
                          onClick={handleDeleteAccount}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setIsDeleting(false)}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm rounded-xl transition-all active:scale-95 shadow-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[100]"
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={24} className="text-emerald-500" />
              ) : (
                <XCircle size={24} className="text-rose-500" />
              )}
              <span
                className={`font-bold text-sm uppercase tracking-widest ${
                  message.type === "success"
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {message.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
