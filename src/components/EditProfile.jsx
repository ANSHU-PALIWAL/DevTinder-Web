import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Image as ImageIcon,
  Code2,
  Info,
  UserCircle,
  Save,
  CheckCircle2,
  UploadCloud,
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

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  // --- NEW: FILE UPLOAD HANDLER ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Check file size (Let's restrict to 2MB to keep your database happy)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }

      // 2. Convert the image file to a Base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        // This sets the photoUrl state to a massive string representing the image
        setPhotoUrl(reader.result);
        setError(""); // Clear any previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (gallery.length >= 4) {
      setError("You can only upload a maximum of 4 images to your gallery.");
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
        { firstName, lastName, about, age, gender, photoUrl, skills, gallery },
        { withCredentials: true },
      );

      // 🚀 FIX: The backend now returns { success: true, data: user }
      // So we access the user object via res.data.data
      dispatch(addUser(res.data.data));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      // 🛡️ FIX: Safely extract the clean error message from our new backend JSON
      const errorMessage =
        err?.response?.data?.message || "Error updating profile";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 lg:gap-12 bg-base-300/40 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl backdrop-blur-md border border-base-200/50 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      {/* LEFT COLUMN: The Form */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Edit Your Profile
          </h2>
          <p className="text-base-content/60">
            Update your details to stand out to other developers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content/80">
                First Name
              </span>
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
              />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content/80">
                Last Name
              </span>
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
              />
            </div>
          </div>

          {/* Age */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content/80">
                Age
              </span>
            </label>
            <div className="relative">
              <UserCircle
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
              />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content/80">
                Gender
              </span>
            </label>
            <div className="relative">
              <UserCircle
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
              >
                <option
                  value=""
                  disabled
                  className="bg-base-300 text-base-content"
                >
                  Select Gender
                </option>
                <option value="Male" className="bg-base-300 text-base-content">
                  Male
                </option>
                <option
                  value="Female"
                  className="bg-base-300 text-base-content"
                >
                  Female
                </option>
                <option value="Other" className="bg-base-300 text-base-content">
                  Other
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* --- NEW: INTERACTIVE PHOTO UPLOAD --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content/80">
              Profile Photo
            </span>
          </label>
          <div className="flex items-center gap-4 bg-base-200/50 p-3 rounded-2xl border border-base-300">
            {/* Small Preview Avatar */}
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-lg">
                <img
                  src={
                    photoUrl ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
                  alt="Avatar Preview"
                />
              </div>
            </div>
            {/* DaisyUI File Input */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered file-input-primary w-full shadow-sm"
              />
              <p className="text-xs text-base-content/50 mt-2 px-1 flex items-center gap-1">
                <UploadCloud size={14} /> JPEG, PNG up to 2MB
              </p>
            </div>
          </div>
        </div>

        {/* --- GALLERY UPLOAD --- */}
        <div className="form-control mt-6">
          <label className="label">
            <span className="label-text font-medium text-base-content/80">
              Gallery Images ({gallery.length}/4)
            </span>
          </label>
          <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
            {/* Display current gallery */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative min-w-[80px] h-20 rounded-xl overflow-hidden border border-base-300"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="gallery item"
                  />
                  <button
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            {gallery.length < 4 && (
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                className="file-input file-input-bordered file-input-sm w-full shadow-sm"
              />
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content/80">
              Top Skills{" "}
              <span className="text-xs opacity-60">(Comma separated)</span>
            </span>
          </label>
          <div className="relative">
            <Code2
              size={18}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
            />
            <input
              type="text"
              value={skills}
              placeholder="React, Node, MongoDB..."
              onChange={(e) => setSkills(e.target.value)}
              className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
            />
          </div>
        </div>

        {/* About */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content/80">
              About You
            </span>
          </label>
          <div className="relative">
            <Info
              size={18}
              className="absolute left-4 top-4 text-base-content/40"
            />
            <textarea
              value={about}
              placeholder="I love building scalable web apps..."
              onChange={(e) => setAbout(e.target.value)}
              className="textarea textarea-bordered w-full pl-11 min-h-[120px] focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none leading-relaxed"
            ></textarea>
          </div>
        </div>

        {error && (
          <p className="text-error text-sm font-medium animate-pulse bg-error/10 p-3 rounded-lg border border-error/20">
            {error}
          </p>
        )}

        <button
          className="btn btn-primary w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 border-none rounded-xl mt-4 self-end"
          onClick={updateProfile}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Save size={18} />
          )}
          Save Profile
        </button>
      </div>

      {/* RIGHT COLUMN: Live Preview */}
      <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-start mt-10 lg:mt-0 relative">
        <div className="sticky top-28 w-full max-w-sm flex flex-col items-center mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-base-content/40 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>{" "}
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
                skills: skills || "React, Node",
              }}
              onAction={() => {}}
              isInteractive={false}
            />
          </div>
        </div>
      </div>

      {/* Animated Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-50"
          >
            <div className="alert alert-success shadow-2xl border border-success/30 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-success-content" />
              <span className="font-medium text-success-content">
                Profile updated successfully!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfile;
