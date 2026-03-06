import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State Management - Defaulting directly to 'security' now
  const [activeTab, setActiveTab] = useState("security");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  // --- UPDATE PASSWORD LOGIC ---
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
      // 🚀 FIX: Safely extract the new JSON message string
      const errorMessage =
        error.response?.data?.message || "Failed to update password.";
      setMessage({ text: errorMessage, type: "error" });
    }
  };

  // --- DELETE ACCOUNT LOGIC ---
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(API_BASE_URL + "/profile/delete", {
        withCredentials: true,
      });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      // 🚀 FIX: Also grab the message here just in case the backend throws an error
      const errorMessage =
        error.response?.data?.message || "Failed to delete account.";
      setMessage({ text: errorMessage, type: "error" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 min-h-[85vh] flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Account Settings
        </h1>
        <p className="text-base-content/60">
          Manage your security and account data.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("security")}
            className={`btn justify-start border-none shadow-none ${activeTab === "security" ? "bg-primary text-primary-content" : "bg-base-200/50 hover:bg-base-300 text-base-content/70"}`}
          >
            <Shield size={18} /> Security
          </button>
          <button
            onClick={() => setActiveTab("danger")}
            className={`btn justify-start border-none shadow-none ${activeTab === "danger" ? "bg-error text-error-content" : "bg-base-200/50 hover:bg-error/20 hover:text-error text-base-content/70"}`}
          >
            <AlertTriangle size={18} /> Danger Zone
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-base-300/40 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl border border-base-200/50 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <motion.div
                key="sec"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="text-primary" /> Change Password
                </h2>
                <div className="space-y-4 max-w-md">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Current Password</span>
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input input-bordered w-full bg-base-200/50 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">New Password</span>
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input input-bordered w-full bg-base-200/50 focus:border-primary outline-none"
                    />
                  </div>
                  <button
                    onClick={handleUpdatePassword}
                    className="btn btn-primary w-full mt-2"
                  >
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {/* DANGER ZONE TAB */}
            {activeTab === "danger" && (
              <motion.div
                key="dang"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-error">
                  <AlertTriangle /> Danger Zone
                </h2>
                <div className="bg-error/10 border border-error/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-error mb-2">
                    Delete Account
                  </h3>
                  <p className="text-base-content/70 mb-6">
                    Once you delete your account, there is no going back. Please
                    be certain. All your data, connections, and messages will be
                    permanently wiped.
                  </p>

                  {!isDeleting ? (
                    <button
                      onClick={() => setIsDeleting(true)}
                      className="btn btn-error btn-outline"
                    >
                      <Trash2 size={18} /> Delete My Account
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 animate-pulse">
                      <p className="font-bold text-error">
                        Are you absolutely sure?
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="btn btn-error shadow-lg shadow-error/30"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setIsDeleting(false)}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Shared Toast Notification */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 right-10 z-50"
          >
            <div
              className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} shadow-2xl flex items-center gap-2`}
            >
              <CheckCircle2 size={20} />
              <span className="font-medium">{message.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
