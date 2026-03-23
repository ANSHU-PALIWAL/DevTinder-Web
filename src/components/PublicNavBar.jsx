import { Link, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";

/**
 * PublicNavBar is displayed only when the user is logged out (e.g. Login, About Us pages).
 * It features a clean design without dashboard links or user profile menus.
 */
const PublicNavBar = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  return (
    <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <Link
            to="/login"
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

        <div className="flex gap-4 items-center flex-shrink-0">
          {!isAboutPage ? (
            <Link
              to="/about"
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
            >
              About Us
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Login / Join
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicNavBar;
