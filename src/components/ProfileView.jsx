import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Edit, MapPin, Terminal, Code2 } from "lucide-react";

const ProfileView = () => {
  const user = useSelector((store) => store.user);

  if (!user) return null;

  const { firstName, lastName, photoUrl, about, skills, age, gender, gallery = [] } = user;
  const displayImage = photoUrl || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 min-h-[85vh]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          My Profile
        </h1>
        <Link to="/profile/edit" className="btn btn-primary btn-outline gap-2 rounded-xl">
          <Edit size={18} /> Edit Profile
        </Link>
      </div>

      <div className="bg-base-300/40 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl border border-base-200/50">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Main Avatar */}
          <img 
            src={displayImage} 
            alt="Profile" 
            className="w-48 h-48 rounded-full object-cover ring-4 ring-primary ring-offset-base-300 ring-offset-4 shadow-2xl"
          />

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-4xl font-bold flex items-center gap-3">
                {firstName} {lastName}
              </h2>
              <p className="text-lg text-base-content/70 flex items-center gap-2 mt-2 font-medium uppercase tracking-wider">
                <Terminal size={18} className="text-primary" /> {age} years old • {gender}
              </p>
            </div>

            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
              <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/50 mb-2">About Me</h3>
              <p className="text-base-content/80 leading-relaxed">{about || "No bio provided yet."}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/50 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="badge badge-primary badge-outline py-3 px-4 font-semibold text-xs tracking-wider">
                    <Code2 size={12} className="mr-2" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 📸 The New Image Gallery Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Gallery <span className="text-sm font-normal text-base-content/50">({gallery.length}/4)</span>
          </h3>
          
          {gallery.length === 0 ? (
            <div className="bg-base-200/30 border-2 border-dashed border-base-300 rounded-3xl p-10 text-center">
              <p className="text-base-content/60">No photos in your gallery yet. Head to Edit Profile to add some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((imgSrc, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-base-200/50 hover:scale-105 transition-transform cursor-pointer">
                  <img src={imgSrc} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;