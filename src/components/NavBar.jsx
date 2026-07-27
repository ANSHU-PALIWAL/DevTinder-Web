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
  MessageCircle,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const PUBLIC_NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/blogs", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const isLoginPage = location.pathname === "/login";

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

  const navLinkBase =
    "flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-200 ease-out active:scale-95";
  const navLinkActive =
    "bg-emerald-50 text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]";
  const navLinkInactive =
    "text-slate-500 hover:text-slate-900 hover:bg-slate-100";

  return (
    <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-3 group w-fit cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-emerald-500 rounded-[14px] shadow-md shadow-emerald-500/20 text-white group-hover:bg-emerald-600 transition-colors">
              <MapPin size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl tracking-tight text-slate-800 hidden sm:block truncate">
              <span className="font-extrabold">Connect</span>
              <span className="font-medium text-emerald-600"> Neighbour</span>
            </span>
          </Link>
        </div>

        {user && (
          <div className="flex gap-2 lg:gap-6 items-center flex-shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 mr-4">
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
              <Link
                to="/groups"
                className={`${navLinkBase} ${isActive("/groups") ? navLinkActive : navLinkInactive}`}
              >
                <MessageCircle
                  size={18}
                  strokeWidth={isActive("/groups") ? 2.5 : 2}
                />
                <span>Groups</span>
              </Link>
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 lg:pr-4 rounded-full transition-colors active:scale-95 border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full shadow-sm bg-slate-100 overflow-hidden ring-2 ring-white flex-shrink-0">
                  <img
                    alt={user.firstName}
                    src={
                      user.photoUrl ||
                      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    }
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="hidden lg:block text-sm font-bold text-slate-700 truncate max-w-[120px]">
                  {user.firstName}
                </span>
              </div>

              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-2xl z-[100] mt-3 w-56 p-2 gap-1"
              >
                <li className="lg:hidden">
                  <Link
                    to="/"
                    className={`flex items-center gap-3 px-4 py-3 text-[14px] font-medium rounded-xl transition-colors ${isActive("/") ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
                  >
                    <Home size={18} strokeWidth={isActive("/") ? 2.5 : 2} />{" "}
                    Feed
                  </Link>
                </li>
                <li className="lg:hidden">
                  <Link
                    to="/radar"
                    className={`flex items-center gap-3 px-4 py-3 text-[14px] font-medium rounded-xl transition-colors ${isActive("/radar") ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
                  >
                    <Navigation
                      size={18}
                      strokeWidth={isActive("/radar") ? 2.5 : 2}
                    />{" "}
                    Radar
                  </Link>
                </li>
                <li className="lg:hidden">
                  <Link
                    to="/connections"
                    className={`flex items-center gap-3 px-4 py-3 text-[14px] font-medium rounded-xl transition-colors ${isActive("/connections") ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
                  >
                    <Users
                      size={18}
                      strokeWidth={isActive("/connections") ? 2.5 : 2}
                    />{" "}
                    Neighbors
                  </Link>
                </li>
                <li className="lg:hidden">
                  <Link
                    to="/requests"
                    className={`flex items-center gap-3 px-4 py-3 text-[14px] font-medium rounded-xl transition-colors ${isActive("/requests") ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
                  >
                    <UserPlus
                      size={18}
                      strokeWidth={isActive("/requests") ? 2.5 : 2}
                    />{" "}
                    Requests
                  </Link>
                </li>
                <li className="lg:hidden">
                  <Link
                    to="/groups"
                    className={`flex items-center gap-3 px-4 py-3 text-[14px] font-medium rounded-xl transition-colors ${isActive("/groups") ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
                  >
                    <MessageCircle
                      size={18}
                      strokeWidth={isActive("/groups") ? 2.5 : 2}
                    />{" "}
                    Groups
                  </Link>
                </li>
                <div className="lg:hidden h-[1px] bg-slate-100 w-full my-1"></div>

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

        {!user && (
          <>
            <nav className="hidden md:flex items-center gap-1">
              {PUBLIC_NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                    isActive(to)
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              {!isLoginPage && (
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors shadow-md shadow-emerald-500/20 active:scale-95 hidden sm:inline-flex items-center"
                >
                  Login / Join
                </Link>
              )}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        )}
      </div>

      {!user && mobileOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-slate-100 pt-3 flex flex-col gap-1">
          {PUBLIC_NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                isActive(to)
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl text-center transition-colors"
          >
            Login / Join
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
