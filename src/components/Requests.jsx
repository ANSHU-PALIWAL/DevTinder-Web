import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { addRequests } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

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
                <button>Accept</button>
                <button>Decline</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
