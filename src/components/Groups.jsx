import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { MessageCircle, MapPin, Users, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Groups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [nearbyGroups, setNearbyGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);

  const user = useSelector((store) => store.user);
  
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const [myRes, nearbyRes] = await Promise.all([
        axios.get(API_BASE_URL + "/user/groups", { withCredentials: true }),
        axios.get(API_BASE_URL + "/groups/nearby", { withCredentials: true })
      ]);
      setMyGroups(myRes.data.data);
      // Filter out groups we are already in from the nearby list
      const joinedIds = new Set(myRes.data.data.map(g => g._id));
      setNearbyGroups(nearbyRes.data.data.filter(g => !joinedIds.has(g._id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!user.location?.coordinates) {
      return alert("Location required to create a group.");
    }
    
    try {
      const res = await axios.post(API_BASE_URL + "/group", {
        name: newGroupData.name,
        description: newGroupData.description,
        lng: user.location.coordinates[0],
        lat: user.location.coordinates[1]
      }, { withCredentials: true });
      
      setMyGroups([res.data.data, ...myGroups]);
      setShowCreateModal(false);
      setNewGroupData({ name: "", description: "" });
    } catch (err) {
      alert("Failed to create group");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const res = await axios.post(API_BASE_URL + `/group/${groupId}/join`, {}, { withCredentials: true });
      const joinedGroup = res.data.data;
      setNearbyGroups(prev => prev.filter(g => g._id !== groupId));
      setMyGroups([joinedGroup, ...myGroups]);
    } catch (err) {
      alert("Failed to join group");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 min-h-[85vh]">
      <div className="flex justify-between items-center mb-8 mt-2">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <MessageCircle className="text-emerald-500" size={32} /> Neighborhood Groups
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
        >
          <Plus size={18} /> <span className="hidden sm:inline">Create Group</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* My Groups Section */}
          <section>
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Users className="text-emerald-500" size={20} /> My Groups
            </h2>
            {myGroups.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                <p className="text-slate-500 font-medium">You haven't joined any groups yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <Link 
                    to={`/group-chat/${group._id}`} 
                    key={group._id} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group/card flex flex-col"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{group.name}</h3>
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Users size={12} /> {group.members.length}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{group.description}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-emerald-600 group-hover/card:text-emerald-700 transition-colors">
                      <MessageCircle size={16} className="mr-2" /> Open Chat
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Discover Section */}
          <section>
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <MapPin className="text-emerald-500" size={20} /> Discover Nearby Groups
            </h2>
            {nearbyGroups.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                <p className="text-slate-500 font-medium">No new groups found in your area.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyGroups.map((group) => (
                  <div 
                    key={group._id} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{group.name}</h3>
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Users size={12} /> {group.members.length}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{group.description}</p>
                    </div>
                    <button
                      onClick={() => handleJoinGroup(group._id)}
                      className="w-full py-3 bg-slate-100 hover:bg-emerald-500 text-slate-700 hover:text-white font-bold rounded-xl transition-colors active:scale-95"
                    >
                      Join Group
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Create a Group</h2>
              
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Group Name</label>
                  <input required type="text" value={newGroupData.name} onChange={e => setNewGroupData({...newGroupData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Sunnyvale Gardeners" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea required rows={3} value={newGroupData.description} onChange={e => setNewGroupData({...newGroupData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="What is this group about?"></textarea>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5"><MapPin size={14} className="text-emerald-500" /> Pinned to your current location.</p>
                  <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95">Create Group</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Groups;
