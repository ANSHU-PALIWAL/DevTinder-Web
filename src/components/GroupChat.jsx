import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { ArrowLeft, Send } from "lucide-react";
import { getSocket, createSocketConnection } from "../utils/socket";
import dayjs from "dayjs";

const GroupChat = () => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupDetails, setGroupDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((store) => store.user);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    fetchMessages();

    const socket = createSocketConnection();
    if (!socket) return;

    // Join the group room
    socket.emit("joinGroup", { groupId, userId: user._id });

    const handleNewMessage = (msg) => {
      if (msg.groupId === groupId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveGroupMessage", handleNewMessage);

    return () => {
      socket.off("receiveGroupMessage", handleNewMessage);
    };
  }, [groupId, user]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/group/${groupId}/messages`, {
        withCredentials: true,
      });
      setMessages(res.data.data);

      // Also try to find group details from our existing user/groups endpoint for header info
      const groupsRes = await axios.get(`${API_BASE_URL}/user/groups`, { withCredentials: true });
      const currentGroup = groupsRes.data.data.find(g => g._id === groupId);
      setGroupDetails(currentGroup);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const socket = getSocket();
    socket.emit("sendGroupMessage", {
      groupId,
      userId: user._id,
      text: newMessage,
    }, (res) => {
      if (res.status === "error") {
        alert(res.message);
      }
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto p-4 sm:p-8">
      <div className="bg-white rounded-t-3xl border-b border-slate-100 p-4 shadow-sm flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <Link to="/groups" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors active:scale-95">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg ring-4 ring-emerald-50">
              {groupDetails?.name?.charAt(0).toUpperCase() || "G"}
            </div>
            <div>
              <h2 className="font-bold text-slate-800 leading-tight">
                {groupDetails?.name || "Loading Group..."}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {groupDetails ? `${groupDetails.members?.length} Members` : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center h-full items-center">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <p>Say hello to your neighbors!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId?._id === user._id;
            const senderName = msg.senderId?.firstName || "Unknown";
            const senderPhoto = msg.senderId?.photoUrl || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

            return (
              <div key={msg._id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                  <img src={senderPhoto} alt="avatar" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1" />
                )}
                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                  {!isMe && <span className="text-xs text-slate-400 ml-1 mb-1 font-medium">{senderName}</span>}
                  <div className={`px-5 py-3.5 shadow-sm relative ${
                    isMe 
                    ? "bg-emerald-500 text-white rounded-2xl rounded-br-sm" 
                    : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-bl-sm"
                  }`}>
                    <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                    <span className={`text-[10px] absolute bottom-1 ${isMe ? "right-3 text-emerald-100" : "right-3 text-slate-400"}`}>
                      {dayjs(msg.createdAt).format("HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-b-3xl border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-700"
            placeholder="Message group..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:active:scale-100"
          >
            <Send size={18} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
