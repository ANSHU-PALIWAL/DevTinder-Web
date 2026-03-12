import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import {
  MapPin,
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

  const isActive = (path) => location.pathname === path;

  // Premium, pill-shaped navigation links (Google Material / Apple style)
  const navLinkBase =
    "flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-200 ease-out active:scale-95";
  const navLinkActive =
    "bg-emerald-50 text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]";
  const navLinkInactive =
    "text-slate-500 hover:text-slate-900 hover:bg-slate-100";

  const mobileLinkBase =
    "p-3 rounded-full transition-all duration-200 ease-out active:scale-95";
  const mobileLinkActive =
    "bg-emerald-50 text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]";
  const mobileLinkInactive =
    "text-slate-500 hover:text-slate-900 hover:bg-slate-100";

  return (
    <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Slick, Interactive Logo */}
        <div className="flex-1">
          <Link
            to="/"
            className="flex items-center gap-3 group w-fit cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-[14px] shadow-md shadow-emerald-500/20 text-white group-hover:bg-emerald-600 transition-colors">
              <MapPin size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl tracking-tight text-slate-800 hidden sm:block">
              <span className="font-extrabold">Connect</span>
              <span className="font-medium text-emerald-600">Neighbour</span>
            </span>
          </Link>
        </div>

        {user && (
          <div className="flex gap-2 sm:gap-6 items-center">
            {/* Main Navigation (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5 mr-4">
              <Link
                to="/"
                className={`${navLinkBase} ${isActive("/") ? navLinkActive : navLinkInactive}`}
              >
                <Home size={18} strokeWidth={isActive("/") ? 2.5 : 2} />
                <span>Feed</span>
              </Link>
              <Link
                to="/radar"
                className={`${navLinkBase} ${isActive("/radar") ? navLinkActive : navLinkInactive}`}
              >
                <Navigation
                  size={18}
                  strokeWidth={isActive("/radar") ? 2.5 : 2}
                />
                <span>Radar</span>
              </Link>
              <Link
                to="/connections"
                className={`${navLinkBase} ${isActive("/connections") ? navLinkActive : navLinkInactive}`}
              >
                <Users
                  size={18}
                  strokeWidth={isActive("/connections") ? 2.5 : 2}
                />
                <span>Neighbors</span>
              </Link>
              <Link
                to="/requests"
                className={`${navLinkBase} ${isActive("/requests") ? navLinkActive : navLinkInactive}`}
              >
                <UserPlus
                  size={18}
                  strokeWidth={isActive("/requests") ? 2.5 : 2}
                />
                <span>Requests</span>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-1 mr-2">
              <Link
                to="/"
                className={`${mobileLinkBase} ${isActive("/") ? mobileLinkActive : mobileLinkInactive}`}
              >
                <Home size={22} strokeWidth={isActive("/") ? 2.5 : 2} />
              </Link>
              <Link
                to="/radar"
                className={`${mobileLinkBase} ${isActive("/radar") ? mobileLinkActive : mobileLinkInactive}`}
              >
                <Navigation
                  size={22}
                  strokeWidth={isActive("/radar") ? 2.5 : 2}
                />
              </Link>
              <Link
                to="/connections"
                className={`${mobileLinkBase} ${isActive("/connections") ? mobileLinkActive : mobileLinkInactive}`}
              >
                <Users
                  size={22}
                  strokeWidth={isActive("/connections") ? 2.5 : 2}
                />
              </Link>
              <Link
                to="/requests"
                className={`${mobileLinkBase} ${isActive("/requests") ? mobileLinkActive : mobileLinkInactive}`}
              >
                <UserPlus
                  size={22}
                  strokeWidth={isActive("/requests") ? 2.5 : 2}
                />
              </Link>
            </div>

            {/* Clean User Profile Section */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-4 rounded-full transition-colors active:scale-95 border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full shadow-sm bg-slate-100 overflow-hidden ring-2 ring-white">
                  <img
                    alt={user.firstName}
                    src={
                      user.photoUrl ||
                      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    }
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="hidden lg:block text-sm font-bold text-slate-700">
                  {user.firstName}
                </span>
              </div>

              {/* Premium Dropdown Menu */}
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-2xl z-[100] mt-3 w-56 p-2 gap-1"
              >
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-colors"
                  >
                    <UserIcon size={18} /> My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-colors"
                  >
                    <Settings size={18} /> Account Settings
                  </Link>
                </li>
                <div className="h-[1px] bg-slate-100 w-full my-1"></div>
                <li>
                  <a
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut size={18} /> Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
