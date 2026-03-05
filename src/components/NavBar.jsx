import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { Code2, LogOut, Settings, User as UserIcon } from "lucide-react";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(API_BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar bg-base-300/80 backdrop-blur-xl border-b border-base-200/50 fixed top-0 w-full z-50 px-4 sm:px-8 transition-all duration-300">
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight group w-fit"
        >
          <Code2
            className="text-primary group-hover:rotate-12 transition-transform duration-300"
            size={32}
          />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            DevTinder
          </span>
        </Link>
      </div>

      {user && (
        <div className="flex gap-4 items-center">
          <p className="hidden sm:block font-medium text-sm tracking-wide text-base-content/80">
            Welcome,{" "}
            <span className="text-primary font-bold">{user.firstName}</span>
          </p>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar ring-2 ring-transparent hover:ring-primary hover:ring-offset-base-100 hover:ring-offset-2 transition-all duration-300"
            >
              <div className="w-10 rounded-full shadow-lg">
                <img
                  alt="User Photo"
                  src={user.photoUrl || "https://via.placeholder.com/150"}
                />
              </div>
            </div>

            <ul
              tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-200/95 backdrop-blur-md border border-base-300 shadow-2xl rounded-2xl z-1 mt-4 w-56 p-3 gap-1"
            >
              <li>
                <Link
                  to="/profile"
                  className="flex justify-between items-center py-3 hover:bg-base-300 hover:text-primary rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} /> Profile
                  </div>
                  <span className="badge badge-primary badge-sm shadow-sm shadow-primary/30">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="flex items-center gap-3 py-3 hover:bg-base-300 hover:text-primary rounded-xl transition-colors"
                >
                  <Settings size={16} /> Connections
                </Link>
              </li>
              <li>
                <a className="flex items-center gap-3 py-3 hover:bg-base-300 hover:text-primary rounded-xl transition-colors">
                  <Settings size={16} /> Settings
                </a>
              </li>
              <div className="h-[1px] bg-base-300 w-full my-1"></div>
              <li>
                <a
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-error hover:bg-error/10 rounded-xl transition-colors"
                >
                  <LogOut size={16} /> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
