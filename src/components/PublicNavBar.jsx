import { Link, useLocation } from "react-router-dom";
import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/blogs", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

/**
 * PublicNavBar is displayed only when the user is logged out
 * (e.g. Home, Login, About Us, Blogs, Contact pages).
 * Includes full public navigation with mobile hamburger menu.
 */
const PublicNavBar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-1 min-w-0">
          <Link
            to="/home"
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

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
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

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          {!isLoginPage && (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors shadow-md shadow-emerald-500/20 active:scale-95 hidden sm:inline-flex items-center"
            >
              Login / Join
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-slate-100 pt-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
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

export default PublicNavBar;
