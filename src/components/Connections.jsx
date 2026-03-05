import axios from "axios";
import { useEffect } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlics";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(API_BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) {
    return (
      <div>
        <h1>Connections</h1>
        <p>You have no connections yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Connections</h1>
      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, skills, about } =
          connection;
        return (
          <div key={_id}>
            <p>
              {firstName} {lastName}
            </p>
            <img src={photoUrl} alt={`${firstName} ${lastName}`} />
            <p>Age: {age}</p>
            <p>Skills: {skills.join(", ")}</p>
            <p>About: {about}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
