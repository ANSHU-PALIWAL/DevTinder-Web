import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  console.log("user", user);

  const [age, setAge] = useState(user.age);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills);
  const [gender, setGender] = useState(user.gender);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [firstName, setFirstName] = useState(user.firstName);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const updateProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        API_BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          about,
          age,
          gender,
          photoUrl,
          skills,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.user));
      setShowToast(true);
      const i = setTimeout(() => {
        setShowToast(false);
        clearTimeout(i);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data || "Error updating profile");
    }
  };

  return (
    <>
      <div className=" flex justify-center items-start gap-10">
        <div className="flex items-center justify-center">
          <div className="card bg-base-300 shadow-sm text-primary-content w-96">
            <div className="card-body">
              <h2 className="card-title">Edit Profile</h2>
              <div className="mt-4">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Enter your First Name
                  </legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input w-full outline-none"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Enter your Last Name
                  </legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input w-full outline-none"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Enter something about you
                  </legend>
                  <input
                    type="text"
                    value={about}
                    className="input w-full outline-none"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Enter your Age</legend>
                  <input
                    type="number"
                    value={age}
                    className="input w-full outline-none"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Enter your Gender</legend>
                  <input
                    type="text"
                    value={gender}
                    className="input w-full outline-none"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Enter your Photo URL
                  </legend>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input w-full outline-none"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Enter your Skills</legend>
                  <input
                    type="text"
                    value={skills}
                    className="input w-full outline-none"
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </fieldset>
              </div>

              <p className="text-red-400">{error}</p>

              <div className="card-actions justify-end mt-4">
                <button className="btn" onClick={updateProfile}>
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about, skills }}
          />
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
