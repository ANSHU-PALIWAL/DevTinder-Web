import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { User as UserIcon, Heart, X, MapPin, Calendar, Users, Plus, Store } from "lucide-react";

const RadarView = () => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEventData, setNewEventData] = useState({ title: "", description: "", eventType: "Meetup", date: "", lat: 0, lng: 0 });

  const loggedInUser = useSelector((store) => store.user);

  // Exact coordinates of the logged in user
  const userLng = loggedInUser?.location?.coordinates?.[0] || 77.209;
  const userLat = loggedInUser?.location?.coordinates?.[1] || 28.6139;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAccurateLocationAndFeed = () => {
      setLoading(true);

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              // 1. Force update the precise location in the backend
              const locRes = await axios.patch(
                API_BASE_URL + "/profile/location",
                { lat: latitude, lng: longitude },
                { withCredentials: true },
              );

              if (locRes.data?.data) {
                dispatch(addUser(locRes.data.data)); // Sync exact coords to Redux
              }

              // 2. Fetch radar feed & events in parallel
              const [usersRes, eventsRes] = await Promise.all([
                axios.get(API_BASE_URL + "/feed/radar?distance=100000", { withCredentials: true }),
                axios.get(API_BASE_URL + "/events/nearby?distance=100000", { withCredentials: true })
              ]);
              setNearbyUsers(usersRes.data.data);
              setNearbyEvents(eventsRes.data.data);
            } catch (err) {
              setError(
                err.response?.data?.message ||
                  "Could not load radar data. Please try again.",
              );
            } finally {
              setLoading(false);
            }
          },
          (err) => {
            setError(
              "Location access denied. Please enable high accuracy location services to use Radar.",
            );
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
        );
      } else {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
      }
    };

    fetchAccurateLocationAndFeed();
  }, [dispatch]);

  const handleAction = async (status, userId) => {
    try {
      await axios.post(
        API_BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      setNearbyUsers((prev) => prev.filter((u) => u._id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/event/${eventId}/rsvp`, {}, { withCredentials: true });
      const { isRSVPd } = res.data;
      
      setNearbyEvents(prev => prev.map(ev => {
        if (ev._id === eventId) {
          const newRsvpList = isRSVPd 
            ? [...ev.rsvpList, loggedInUser._id]
            : ev.rsvpList.filter(id => id !== loggedInUser._id);
          return { ...ev, rsvpList: newRsvpList };
        }
        return ev;
      }));
      
      // Update selected event if it's currently open
      if (selectedEvent && selectedEvent._id === eventId) {
        setSelectedEvent(prev => ({
          ...prev,
          rsvpList: isRSVPd 
            ? [...prev.rsvpList, loggedInUser._id]
            : prev.rsvpList.filter(id => id !== loggedInUser._id)
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Could not RSVP to event.");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/event`, newEventData, { withCredentials: true });
      setNearbyEvents(prev => [...prev, { ...res.data.data, creator: loggedInUser }]);
      setShowCreateEvent(false);
      setNewEventData({ title: "", description: "", eventType: "Meetup", date: "", lat: 0, lng: 0 });
    } catch (err) {
      alert("Failed to create event.");
    }
  };

  const initialViewState = {
    longitude: userLng,
    latitude: userLat,
    zoom: 11,
    pitch: 45,
    bearing: 0,
  };

  if (loading) {
    return (
      <div className="grow flex items-center justify-center min-h-[calc(100vh-80px)]">
        <span className="loading loading-bars loading-lg text-emerald-500"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grow flex flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-80px)]">
        <MapPin size={48} className="text-rose-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2 text-slate-800">
          Location Required
        </h2>
        <p className="text-slate-500 max-w-md font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold mt-6 transition-all active:scale-95 shadow-lg"
        >
          Refresh Permission
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-50 grow flex flex-col">
      <div className="absolute inset-0 z-0">
        <Map
          initialViewState={initialViewState}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Exact Marker for Logged In User */}
          <Marker longitude={userLng} latitude={userLat} anchor="bottom">
            <div className="relative group cursor-pointer flex flex-col items-center z-50">
              <div className="absolute -inset-2 bg-blue-400 rounded-full opacity-40 animate-ping"></div>

              <div className="relative w-14 h-14 rounded-full border-4 border-blue-500 shadow-xl overflow-hidden bg-white z-10 transition-transform duration-300 hover:scale-110">
                <img
                  src={
                    loggedInUser?.photoUrl ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-t-blue-500 border-x-transparent z-10"></div>

              <span className="absolute -top-8 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-lg uppercase tracking-widest border border-blue-500 z-20 whitespace-nowrap">
                You Are Here
              </span>
            </div>
          </Marker>

          {/* Exact Markers for Nearby Users */}
          {nearbyUsers.map((user, index) => {
            let lng = user?.location?.coordinates?.[0];
            let lat = user?.location?.coordinates?.[1];

            // Only map users with strict valid exact coordinates
            if (!lng || !lat || (lng === 0 && lat === 0)) return null;
            
            // If the user has the exact same coordinates (e.g. testing locally), offset them in a small circle so they don't hide behind 'You Are Here'
            if (Math.abs(lng - userLng) < 0.00001 && Math.abs(lat - userLat) < 0.00001) {
              const angle = index * (Math.PI * 2 / nearbyUsers.length) || index; 
              const radius = 0.003; // ~300 meters offset
              lng += Math.cos(angle) * radius;
              lat += Math.sin(angle) * radius;
            }

            // Optional distance calculation label for exact Map markers
            const distanceKm = user.distance
              ? (user.distance / 1000).toFixed(1)
              : "";

            return (
              <Marker
                key={user._id}
                longitude={lng}
                latitude={lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedUser(user);
                }}
              >
                <div className="relative group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                  <div className={`absolute -inset-2 rounded-full opacity-30 animate-ping group-hover:opacity-50 transition-all ${user.isBusiness ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                  
                  {/* Outer Ring */}
                  <div className={`relative w-12 h-12 rounded-full border-4 shadow-xl overflow-hidden transition-all duration-300 bg-white ${selectedUser?._id === user._id ? (user.isBusiness ? "border-amber-500 scale-125" : "border-emerald-500 scale-125") : (user.isBusiness ? "border-white group-hover:border-amber-200" : "border-white group-hover:border-emerald-200")}`}>
                    {user.isBusiness ? (
                      <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                        <Store size={20} className="text-amber-500" />
                      </div>
                    ) : (
                      <img
                        src={user.photoUrl || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                        alt={user.firstName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Pin Point */}
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-x-transparent transition-all duration-300 ${selectedUser?._id === user._id ? (user.isBusiness ? "border-t-amber-500 scale-125" : "border-t-emerald-500 scale-125") : (user.isBusiness ? "border-t-white group-hover:border-t-amber-200" : "border-t-white group-hover:border-t-emerald-200")}`}></div>
                </div>
              </Marker>
            );
          })}
          {/* Exact Markers for Nearby Events */}
          {nearbyEvents.map((event) => {
            const lng = event?.location?.coordinates?.[0];
            const lat = event?.location?.coordinates?.[1];

            if (!lng || !lat) return null;
            
            const isRSVPd = event.rsvpList?.includes(loggedInUser?._id);

            return (
              <Marker
                key={event._id}
                longitude={lng}
                latitude={lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedEvent(event);
                  setSelectedUser(null);
                }}
              >
                <div className="relative group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                  <div className={`absolute -inset-2 rounded-full opacity-30 animate-ping group-hover:opacity-50 transition-all ${isRSVPd ? 'bg-amber-400' : 'bg-purple-400'}`}></div>
                  
                  <div className={`relative w-10 h-10 rounded-full border-4 shadow-xl overflow-hidden transition-all duration-300 flex items-center justify-center ${selectedEvent?._id === event._id ? "border-purple-500 bg-purple-100 scale-125" : isRSVPd ? "border-amber-500 bg-amber-50 group-hover:border-amber-400" : "border-white bg-purple-50 group-hover:border-purple-200"}`}>
                    <Calendar size={18} className={isRSVPd ? "text-amber-500" : "text-purple-500"} />
                  </div>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-x-transparent transition-all duration-300 ${selectedEvent?._id === event._id ? "border-t-purple-500 scale-125" : isRSVPd ? "border-t-amber-500 group-hover:border-t-amber-400" : "border-t-white group-hover:border-t-purple-200"}`}></div>
                </div>
              </Marker>
            );
          })}
        </Map>
      </div>

      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-slate-50/80 to-transparent pointer-events-none z-10 hidden md:block"></div>

      {/* Floating Action Button for Create Event */}
      <button 
        onClick={() => {
          setNewEventData(prev => ({ ...prev, lat: userLat, lng: userLng }));
          setShowCreateEvent(true);
        }}
        className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-xl hover:shadow-purple-600/30 transition-all active:scale-95 z-40 flex items-center gap-2 group"
      >
        <Plus size={24} />
        <span className="hidden md:block font-bold text-sm pr-2 whitespace-nowrap">Create Event</span>
      </button>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 w-full sm:left-1/2 sm:-translate-x-1/2 sm:w-[400px] sm:bottom-6 bg-white sm:rounded-3xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 p-6 z-50 flex flex-col"
            style={{ maxHeight: "85vh", overflowY: "auto" }}
          >
            {/* Minimal Mobile Drag Handle */}
            <div
              className="w-12 h-1 bg-gray-200 rounded-full mb-6 cursor-pointer hover:bg-gray-300 transition-colors sm:hidden self-center"
              onClick={() => setSelectedUser(null)}
            />

            {/* Desktop Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors hidden sm:flex items-center justify-center z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="w-full grow flex flex-col p-6 pt-2">
              <div className="flex flex-col mb-4">
                {selectedUser.isBusiness && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1 flex items-center gap-1">
                    <Store size={12} /> {selectedUser.businessCategory || "Local Business"}
                  </span>
                )}
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                  {selectedUser.isBusiness ? selectedUser.businessName : `${selectedUser.firstName} ${selectedUser.lastName || ""}`}
                  {!selectedUser.isBusiness && selectedUser.age && `, ${selectedUser.age}`}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
                  <MapPin size={14} className="text-emerald-500" />
                  {selectedUser.distance
                    ? `${(selectedUser.distance / 1000).toFixed(1)} km away`
                    : "Nearby"}
                </div>
              </div>

              {/* Bio & Details */}
              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                  About
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {selectedUser.about || "This neighbor hasn't added a bio yet."}
                </p>

                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedUser.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-[11px] font-semibold rounded-lg border border-gray-200/60"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Minimal Action Grid */}
              <div className="flex items-center justify-between gap-3 mt-auto pt-2">
                <button
                  onClick={() => handleAction("ignored", selectedUser._id)}
                  className="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 hover:text-gray-900 transition-colors active:scale-95"
                >
                  <X size={18} strokeWidth={2.5} />
                  Pass
                </button>
                <button
                  onClick={() => handleAction("interested", selectedUser._id)}
                  className="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95"
                >
                  <Heart size={18} strokeWidth={2.5} className="fill-white/20" />
                  Connect
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Bottom Sheet */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 w-full sm:left-1/2 sm:-translate-x-1/2 sm:w-[400px] sm:bottom-6 bg-white sm:rounded-3xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-purple-100 p-6 z-50 flex flex-col"
            style={{ maxHeight: "85vh", overflowY: "auto" }}
          >
            <div
              className="w-12 h-1 bg-gray-200 rounded-full mb-6 cursor-pointer hover:bg-gray-300 transition-colors sm:hidden self-center"
              onClick={() => setSelectedEvent(null)}
            />
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors hidden sm:flex items-center justify-center z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="w-full grow flex flex-col">
              <div className="flex flex-col mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 mb-1">{selectedEvent.eventType}</span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                  {selectedEvent.title}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium bg-gray-50 py-1.5 px-3 rounded-lg w-max border border-gray-100">
                  <Calendar size={14} className="text-purple-400" />
                  {new Date(selectedEvent.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 leading-relaxed bg-purple-50/50 p-4 rounded-xl border border-purple-100/50">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-6">
                <div className="flex items-center gap-3">
                  <img src={selectedEvent.creator?.photoUrl} alt="Host" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hosted by</p>
                    <p className="text-sm font-bold text-gray-900">{selectedEvent.creator?.firstName}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attending</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Users size={14} className="text-purple-500" /> {selectedEvent.rsvpList?.length || 0}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRSVP(selectedEvent._id)}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
                  selectedEvent.rsvpList?.includes(loggedInUser?._id)
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200 shadow-amber-500/10"
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-600/30"
                }`}
              >
                {selectedEvent.rsvpList?.includes(loggedInUser?._id) ? "Cancel RSVP" : "RSVP to Event"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCreateEvent(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Create Local Event</h2>
              
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
                  <input required type="text" value={newEventData.title} onChange={e => setNewEventData({...newEventData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Sunday Morning Cricket" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                  <select value={newEventData.eventType} onChange={e => setNewEventData({...newEventData, eventType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="Meetup">Meetup</option>
                    <option value="Sports">Sports</option>
                    <option value="Garage Sale">Garage Sale</option>
                    <option value="Lost & Found">Lost & Found</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time</label>
                  <input required type="datetime-local" value={newEventData.date} onChange={e => setNewEventData({...newEventData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea required rows={3} value={newEventData.description} onChange={e => setNewEventData({...newEventData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="More details about the event..."></textarea>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5"><MapPin size={14} className="text-purple-500" /> Event will be pinned at your current location.</p>
                  <button type="submit" className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95">Post Event</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadarView;
