import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import {
  Code2,
  LogOut,
  Settings,
  User as UserIcon,
  Users,
  UserPlus,
  Home,
  Navigation,
} from "lucide-react";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(API_BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to check if a tab is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar bg-base-300/80 backdrop-blur-xl border-b border-base-200/50 fixed top-0 w-full z-50 px-4 sm:px-8 transition-all duration-300">
      {/* Logo Section */}
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight group w-fit"
        >
          <Code2
            className="text-primary group-hover:rotate-12 transition-transform duration-300"
            size={32}
          />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity hidden sm:block">
            DevTinder
          </span>
        </Link>
      </div>

      {user && (
        <div className="flex gap-2 sm:gap-6 items-center">
          {/* Main Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            <Link
              to="/"
              className={`btn btn-ghost btn-sm rounded-xl gap-2 ${isActive("/") ? "bg-base-200 text-primary" : "text-base-content/80 hover:text-primary"}`}
            >
              <Home size={18} /> Feed
            </Link>
            <Link
              to="/radar"
              className={`btn btn-ghost btn-sm rounded-xl gap-2 ${isActive("/radar") ? "bg-base-200 text-primary" : "text-base-content/80 hover:text-primary"}`}
            >
              <Navigation size={18} /> Radar
            </Link>
            <Link
              to="/connections"
              className={`btn btn-ghost btn-sm rounded-xl gap-2 ${isActive("/connections") ? "bg-base-200 text-primary" : "text-base-content/80 hover:text-primary"}`}
            >
              <Users size={18} /> Matches
            </Link>
            <Link
              to="/requests"
              className={`btn btn-ghost btn-sm rounded-xl gap-2 ${isActive("/requests") ? "bg-base-200 text-primary" : "text-base-content/80 hover:text-primary"}`}
            >
              <UserPlus size={18} /> Requests
            </Link>
          </div>

          {/* Mobile Navigation Icons (Shows only on small screens) */}
          <div className="flex md:hidden items-center gap-1 mr-2">
            <Link
              to="/"
              className={`btn btn-ghost btn-circle btn-sm ${isActive("/") ? "text-primary bg-base-200" : "text-base-content/80"}`}
            >
              <Home size={18} />
            </Link>
            <Link
              to="/radar"
              className={`btn btn-ghost btn-circle btn-sm ${isActive("/radar") ? "text-primary bg-base-200" : "text-base-content/80"}`}
            >
              <Navigation size={18} />
            </Link>
            <Link
              to="/connections"
              className={`btn btn-ghost btn-circle btn-sm ${isActive("/connections") ? "text-primary bg-base-200" : "text-base-content/80"}`}
            >
              <Users size={18} />
            </Link>
            <Link
              to="/requests"
              className={`btn btn-ghost btn-circle btn-sm ${isActive("/requests") ? "text-primary bg-base-200" : "text-base-content/80"}`}
            >
              <UserPlus size={18} />
            </Link>
          </div>

          <p className="hidden lg:block font-medium text-sm tracking-wide text-base-content/80 mr-2">
            Welcome,{" "}
            <span className="text-primary font-bold">{user.firstName}</span>
          </p>

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar ring-2 ring-transparent hover:ring-primary hover:ring-offset-base-100 hover:ring-offset-2 transition-all duration-300"
            >
              <div className="w-10 rounded-full shadow-lg bg-base-200">
                <img
                  alt="User Photo"
                  src={
                    user.photoUrl ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
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
                  className="flex items-center gap-3 py-3 hover:bg-base-300 hover:text-primary rounded-xl transition-colors"
                >
                  <UserIcon size={16} /> My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 py-3 hover:bg-base-300 hover:text-primary rounded-xl transition-colors"
                >
                  <Settings size={16} /> Account Settings
                </Link>
              </li>
              <div className="h-[1px] bg-base-300 w-full my-1"></div>
              <li>
                <a
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer"
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
