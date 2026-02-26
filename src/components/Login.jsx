import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("Anshu@gmail.com");
  const [password, setPassword] = useState("Anshu@123");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        API_BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || err?.response || "Something went wrong");
    }
  };

  return (
    <div className="login min-h-screen flex items-center justify-center">
      <div className="card bg-base-300 shadow-sm text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <div className="mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Enter your Email Id</legend>
              <input
                type="email"
                value={emailId}
                className="input w-full outline-none"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Enter your Password</legend>
              <input
                type="password"
                value={password}
                className="input w-full outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>

          <p className="text-red-400">{error}</p>

          <div className="card-actions justify-end mt-4">
            <button className="btn" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
