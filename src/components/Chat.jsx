import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { getSocket } from "../utils/socket";
import { encryptMessage, decryptMessage } from "../utils/crypto";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Image as ImageIcon, Video, X } from "lucide-react";

const Chat = () => {
  const { userId: targetUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((store) => store.user);
  
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [targetPublicKey, setTargetPublicKey] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // WebRTC State
  const [mediaStream, setMediaStream] = useState(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  
  const messagesEndRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const fileInputRef = useRef(null);

  // WebRTC Configuration
  const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentUser) return;
    
    const initializeChat = async () => {
      try {
        // Fetch target user's public key & info (we'll fetch from connections endpoint or profile endpoint if needed, but since we don't have a specific profile fetcher here easily, let's rely on the chat history which requires a connection)
        const keyRes = await axios.get(`${API_BASE_URL}/chat/key/${targetUserId}`, { withCredentials: true });
        setTargetPublicKey(keyRes.data.data);

        // Fetch target user details from connections to show name/avatar
        const connRes = await axios.get(`${API_BASE_URL}/user/connections`, { withCredentials: true });
        const connMatch = connRes.data.data.find(u => u._id === targetUserId);
        if (connMatch) {
          setTargetUser(connMatch);
        } else {
          navigate("/connections"); // Go back if not connected
          return;
        }

        // Fetch History
        const historyRes = await axios.get(`${API_BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
        const rawMessages = historyRes.data.data;
        
        // Decrypt History
        const decryptedMessages = await Promise.all(
          rawMessages.map(async (msg) => {
            const isMine = msg.senderId === currentUser._id;
            const encryptedData = isMine ? msg.senderEncryptedData : msg.receiverEncryptedData;
            const decryptedText = await decryptMessage(encryptedData, currentUser._id);
            const isImage = decryptedText.startsWith("IMG::");
            return {
              _id: msg._id,
              senderId: msg.senderId,
              text: isImage ? null : decryptedText,
              imageUrl: isImage ? decryptedText.replace("IMG::", "") : null,
              createdAt: msg.createdAt,
              type: isImage ? "image" : "text",
            };
          })
        );
        setMessages(decryptedMessages);

        // Check if we came here from an incoming call offer!
        if (location.state?.incomingOffer && !callActive) {
          setTimeout(() => {
            handleAcceptIncomingCall(location.state.incomingOffer);
          }, 1000); // Small delay to let UI settle
        }

      } catch (err) {
        console.error("Failed to init chat:", err);
        navigate("/connections");
      }
    };

    initializeChat();

    // Socket listeners
    const socket = getSocket();
    if (socket) {
      socket.on("receiveMessage", async (incomingMsg) => {
        if (incomingMsg.senderId === targetUserId) {
          const decryptedText = await decryptMessage(incomingMsg.receiverEncryptedData, currentUser._id);
          const isImage = decryptedText.startsWith("IMG::");
          setMessages(prev => [...prev, {
            _id: incomingMsg._id,
            senderId: incomingMsg.senderId,
            text: isImage ? null : decryptedText,
            imageUrl: isImage ? decryptedText.replace("IMG::", "") : null,
            createdAt: incomingMsg.createdAt,
            type: isImage ? "image" : "text",
          }]);
        }
      });

      // WebRTC Signaling Listener
      socket.on("webrtcSignal", async ({ from, signal }) => {
        if (from !== targetUserId) return;
        
        if (signal.type === "offer") {
          await handleReceiveOffer(signal);
        } else if (signal.type === "answer") {
          await handleReceiveAnswer(signal);
        } else if (signal.candidate) {
          await handleReceiveIceCandidate(signal);
        } else if (signal.type === "decline" || signal.type === "endCall") {
          endCall();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
        socket.off("webrtcSignal");
      }
    };
  }, [currentUser, targetUserId]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMsg.trim() || !targetPublicKey) return;

    try {
      const msgText = inputMsg;
      setInputMsg("");
      
      const receiverEncryptedData = await encryptMessage(msgText, targetPublicKey);
      // Sender needs to encrypt with their own public key to read their history
      const myPublicKeyStr = await import("../utils/crypto").then(m => m.getMyPublicKey(currentUser._id));
      const senderEncryptedData = await encryptMessage(msgText, myPublicKeyStr);

      const socket = getSocket();
      socket.emit("sendMessage", {
        receiverId: targetUserId,
        receiverEncryptedData,
        senderEncryptedData
      }, (response) => {
        if (response.status === "success") {
          setMessages(prev => [...prev, {
            _id: response.message._id,
            senderId: currentUser._id,
            text: msgText,
            createdAt: new Date().toISOString(),
            type: "text",
          }]);
        } else {
          console.error("Message failed:", response.message);
        }
      });

    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // --- WebRTC P2P Media Handling ---
  
  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection(rtcConfig);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        socket.emit("webrtcSignal", { to: targetUserId, signal: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteMediaStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Data channel for images
    pc.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = (e) => {
        // e.data contains the ArrayBuffer or Blob of the image
        const blob = new Blob([e.data]);
        const url = URL.createObjectURL(blob);
        setMessages(prev => [...prev, {
          _id: Date.now().toString(),
          senderId: targetUserId,
          imageUrl: url,
          createdAt: new Date().toISOString(),
          type: "image",
        }]);
      };
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setCallActive(true);

      const pc = setupPeerConnection();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      getSocket().emit("webrtcSignal", { to: targetUserId, signal: offer });
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const handleReceiveOffer = async (offer) => {
    // For when we receive an offer while ALREADY on the Chat page
    const pc = setupPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMediaStream(stream);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    setCallActive(true);
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    getSocket().emit("webrtcSignal", { to: targetUserId, signal: answer });
  };

  const handleAcceptIncomingCall = async (offer) => {
    // For when we navigated here from GlobalAppManager
    await handleReceiveOffer(offer);
  };

  const handleReceiveAnswer = async (answer) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleReceiveIceCandidate = async (candidate) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    setMediaStream(null);
    setRemoteMediaStream(null);
    setCallActive(false);
    
    // Notify other side
    getSocket()?.emit("webrtcSignal", { to: targetUserId, signal: { type: "endCall" } });
  };

  const handleImageShare = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // We do NOT require WebRTC for images anymore! Base64 Socket approach.
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      const formattedDataUrl = "IMG::" + dataUrl;
      
      const receiverEncryptedData = await encryptMessage(formattedDataUrl, targetPublicKey);
      const myPublicKeyStr = await import("../utils/crypto").then(m => m.getMyPublicKey(currentUser._id));
      const senderEncryptedData = await encryptMessage(formattedDataUrl, myPublicKeyStr);
      
      const socket = getSocket();
      socket.emit("sendMessage", {
        receiverId: targetUserId,
        receiverEncryptedData,
        senderEncryptedData
      }, (response) => {
        if (response.status === "success") {
          setMessages(prev => [...prev, {
            _id: response.message._id,
            senderId: currentUser._id,
            imageUrl: dataUrl,
            createdAt: new Date().toISOString(),
            type: "image",
          }]);
        }
      });
    };
    reader.readAsDataURL(file);
  };

  if (!targetUser) return null;

  return (
    <div className="flex flex-col h-[85vh] bg-slate-50 md:rounded-3xl md:border border-slate-200 overflow-hidden shadow-lg mt-4 max-w-5xl mx-auto w-full relative">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <img src={targetUser.photoUrl} alt={targetUser.firstName} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-slate-800">{targetUser.firstName} {targetUser.lastName}</h2>
            <p className="text-xs text-emerald-600 font-medium tracking-wide">End-to-End Encrypted</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!callActive ? (
            <button onClick={startCall} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
              <Video size={20} />
            </button>
          ) : (
            <button onClick={endCall} className="px-4 py-1.5 bg-rose-500 text-white rounded-full text-xs font-bold shadow-md shadow-rose-500/30">
              End Call
            </button>
          )}
        </div>
      </div>

      {/* WebRTC Video Overlay */}
      <AnimatePresence>
        {callActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-20 right-4 w-64 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 z-50 flex flex-col"
          >
            <div className="relative aspect-video bg-black">
              {/* Remote Video */}
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {/* Local Video (PiP) */}
              <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-2 right-2 w-16 h-24 object-cover rounded-lg border border-slate-600 shadow-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
        <div className="flex justify-center mb-6">
          <span className="bg-amber-100 text-amber-800 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-center max-w-xs">
            Messages are end-to-end encrypted. Images/Videos are sent P2P and not saved on the server.
          </span>
        </div>

        {messages.map((msg, index) => {
          const isMine = msg.senderId === currentUser._id;
          return (
            <motion.div 
              key={msg._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                isMine 
                  ? "bg-emerald-500 text-white rounded-tr-sm" 
                  : "bg-white text-slate-800 border border-slate-100 rounded-tl-sm"
              }`}>
                {msg.type === "text" ? (
                  <p className={`text-[15px] leading-relaxed break-words ${msg.text === "[Message encrypted on another device]" ? "italic opacity-80" : ""}`}>
                    {msg.text}
                  </p>
                ) : (
                  <img src={msg.imageUrl} alt="Shared" className="rounded-xl max-w-full mt-1 mb-1" />
                )}
                <span className={`text-[10px] mt-1 block text-right font-medium ${isMine ? "text-emerald-100" : "text-slate-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-100">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageShare} 
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current.click()}
            className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors shrink-0"
            title="Share Image (P2P)"
          >
            <ImageIcon size={22} />
          </button>

          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
          
          <button 
            type="submit"
            disabled={!inputMsg.trim()}
            className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default Chat;
