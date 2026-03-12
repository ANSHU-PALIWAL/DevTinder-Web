import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon, MessageSquare, Tag } from "lucide-react";

const PublicProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

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
      <div className="flex justify-between items-center mb-8 mt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all font-bold text-sm"
        >
          <ArrowLeft size={18} /> Back to Neighbors
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-95">
          <MessageSquare size={18} /> Message {firstName}
        </button>
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
                  className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:scale-[1.02] hover:border-emerald-200 transition-all cursor-pointer"
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
    </div>
  );
};

export default PublicProfile;
