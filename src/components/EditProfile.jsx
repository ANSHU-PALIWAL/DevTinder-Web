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
} from "lucide-react";

const EditProfile = ({ user }) => {
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

  const updateProfile = async () => {
    setError("");
    setIsSaving(true);
    try {
      const res = await axios.patch(
        API_BASE_URL + "/profile/edit",
        { firstName, lastName, about, age, gender, photoUrl, skills },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.user));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err?.response?.data || "Error updating profile");
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

      {/* LEFT COLUMN: The Form (Takes up 7 cols on large screens) */}
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

          {/* Gender (NOW A DROPDOWN) */}
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
                {/* We added solid backgrounds (bg-base-300) to all options to prevent transparency overlap! */}
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

        {/* Photo URL */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content/80">
              Profile Photo URL
            </span>
          </label>
          <div className="relative">
            <ImageIcon
              size={18}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40"
            />
            <input
              type="text"
              value={photoUrl}
              placeholder="https://..."
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200/50 outline-none"
            />
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

      {/* RIGHT COLUMN: Live Preview (Takes up 5 cols) */}
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
