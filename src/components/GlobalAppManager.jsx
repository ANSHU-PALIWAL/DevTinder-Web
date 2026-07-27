import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getSocket } from "../utils/socket";
import { decryptMessage } from "../utils/crypto";
import { PhoneIncoming, Video, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const GlobalAppManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!userData) return;
    
    const socket = getSocket();
    if (!socket) return;

    // 1. Global Message Notifications
    const handleReceiveMessage = async (msg) => {
      // Don't toast if we are currently chatting with this user
      if (location.pathname === `/chat/${msg.senderId}`) return;

      try {
        const decryptedText = await decryptMessage(msg.receiverEncryptedData, userData._id);
        
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-sm w-full bg-slate-800 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700`}
            onClick={() => {
              toast.dismiss(t.id);
              navigate(`/chat/${msg.senderId}`);
            }}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-emerald-400">
                    New Message
                  </p>
                  <p className="mt-1 text-sm text-slate-200 truncate">
                    {msg.type === "image" ? "📷 Sent an image" : decryptedText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ), { duration: 4000 });
      } catch (err) {
        console.error("Failed to decrypt toast message", err);
      }
    };

    // 2. Global WebRTC Ringing
    const handleWebRTCSignal = ({ from, signal }) => {
      // If we are already on their chat page, Chat.jsx handles it!
      if (location.pathname === `/chat/${from}`) return;

      if (signal.type === "offer") {
        setIncomingCall({ from, offer: signal });
      } else if (signal.type === "endCall" || signal.type === "decline") {
        setIncomingCall(null);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("webrtcSignal", handleWebRTCSignal);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("webrtcSignal", handleWebRTCSignal);
    };
  }, [userData, location.pathname, navigate]);

  const handleAcceptCall = () => {
    navigate(`/chat/${incomingCall.from}`, { state: { incomingOffer: incomingCall.offer } });
    setIncomingCall(null);
  };

  const handleDeclineCall = () => {
    getSocket()?.emit("webrtcSignal", { to: incomingCall.from, signal: { type: "decline" } });
    setIncomingCall(null);
  };

  return (
    <>
      {/* Global Incoming Call Overlay */}
      <AnimatePresence>
        {incomingCall && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative border border-slate-100"
            >
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-pulse ring-8 ring-emerald-50/50">
                <PhoneIncoming size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Incoming Call</h2>
              <p className="text-slate-500 mb-8 font-medium">Neighbor is video calling you...</p>

              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={handleDeclineCall}
                  className="flex-1 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 active:scale-95"
                >
                  <X size={20} /> Decline
                </button>
                <button
                  onClick={handleAcceptCall}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Video size={20} /> Accept
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalAppManager;
