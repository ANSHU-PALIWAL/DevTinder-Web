import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Tag,
  Info,
  UserCircle,
  Save,
  CheckCircle2,
  UploadCloud,
  X,
  Phone,
} from "lucide-react";

const EditProfile = ({ user }) => {
  const [gallery, setGallery] = useState(user.gallery || []);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber || "");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (gallery.length >= 6) {
      setError("You can only upload a maximum of 6 images to your gallery.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Gallery images must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setGallery([...gallery, reader.result]);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const removeGalleryImage = (indexToRemove) => {
    setGallery(gallery.filter((_, index) => index !== indexToRemove));
  };

  const updateProfile = async () => {
    setError("");
    setIsSaving(true);
    try {
      const res = await axios.patch(
        API_BASE_URL + "/profile/edit",
        { firstName, lastName, about, age, gender, photoUrl, skills, gallery, mobileNumber },
        { withCredentials: true },
      );

      dispatch(addUser(res.data.data));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Error updating profile";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="lg:col-span-7 flex flex-col space-y-6 z-10">
        <div>
          <h2 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">
            Edit Your Profile
          </h2>
          <p className="text-slate-500 font-medium">
            Update your details so your neighbors can get to know you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              First Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Last Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Age
            </label>
            <div className="relative">
              <UserCircle
                size={16}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Gender
            </label>
            <div className="relative">
              <UserCircle
                size={16}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Mobile Number <span className="lowercase tracking-normal font-medium">(Optional - Only visible to connections)</span>
          </label>
          <div className="relative">
            <Phone
              size={16}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="tel"
              value={mobileNumber}
              placeholder="+1 234 567 8900"
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Profile Photo
          </label>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full ring-4 ring-white shadow-sm overflow-hidden flex-shrink-0">
              <img
                src={
                  photoUrl ||
                  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                }
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:uppercase file:tracking-widest file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-all cursor-pointer"
              />
              <p className="text-xs text-slate-400 mt-2 px-1 flex items-center gap-1 font-medium">
                <UploadCloud size={14} /> JPEG, PNG up to 2MB
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1 mt-6">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Gallery Images ({gallery.length}/6)
          </label>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative min-w-[80px] h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="gallery item"
                  />
                  <button
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors rounded-full w-6 h-6 flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>

            {gallery.length < 6 && (
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:uppercase file:tracking-widest file:font-bold file:bg-slate-200 file:text-slate-600 hover:file:bg-slate-300 transition-all cursor-pointer"
              />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Interests & Skills{" "}
            <span className="lowercase tracking-normal font-medium">
              (Comma separated)
            </span>
          </label>
          <div className="relative">
            <Tag
              size={16}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={skills}
              placeholder="Baking, Yoga, Carpentry..."
              onChange={(e) => setSkills(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            About You
          </label>
          <div className="relative">
            <Info size={16} className="absolute left-4 top-4 text-slate-400" />
            <textarea
              value={about}
              placeholder="I love helping out in the community and finding new running trails..."
              onChange={(e) => setAbout(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400 min-h-[120px] resize-y leading-relaxed"
            ></textarea>
          </div>
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-center gap-2">
            <X size={16} /> {error}
          </p>
        )}

        <button
          className="w-full sm:w-auto py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2 self-end mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={updateProfile}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <Save size={18} />
          )}
          Save Profile
        </button>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-start mt-10 lg:mt-0 relative z-10">
        <div className="sticky top-28 w-full max-w-sm flex flex-col items-center mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Preview
          </p>

          <div className="w-full pointer-events-none">
            <UserCard
              user={{
                firstName: firstName || "Your",
                lastName: lastName || "Name",
                photoUrl: photoUrl,
                age: age || "??",
                gender: gender || "??",
                about: about || "Write something cool about yourself...",
                skills: skills || "Baking, Yoga",
              }}
              onAction={() => {}}
              isInteractive={false}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[100]"
          >
            <div className="bg-emerald-50 border border-emerald-200 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-500" />
              <span className="font-bold text-sm text-emerald-700 uppercase tracking-widest">
                Profile Updated
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfile;
