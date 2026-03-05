import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const [showButtons, setShowButtons] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        API_BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      console.error("Error reviewing request:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0) {
    return (
      <div>
        <h1>Requests</h1>
        <p>You have no connection requests yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Requests</h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, skills, about } =
          request.fromUserId;
        return (
          <div key={_id}>
            <p>
              {firstName} {lastName}
            </p>
            <img src={photoUrl} alt={`${firstName} ${lastName}`} />
            <p>Age: {age}</p>
            <p>Skills: {skills.join(", ")}</p>
            <p>About: {about}</p>
            <div className="mt-20">
              <button
                className="btn"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
              <button
                className="btn"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
