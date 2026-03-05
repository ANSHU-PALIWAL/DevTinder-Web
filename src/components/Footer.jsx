import React from "react";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-4 px-8 border-t border-base-200/50 bg-base-300/30 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center text-sm text-base-content/60 transition-all z-40">
      <p className="flex items-center gap-1 mb-2 sm:mb-0">
        © {new Date().getFullYear()} DevTinder. Built with{" "}
        <Heart size={14} className="text-error fill-error animate-pulse" /> for
        developers.
      </p>

      <div className="flex gap-5">
        <a className="hover:text-primary hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <Github size={18} />
        </a>
        <a className="hover:text-info hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <Twitter size={18} />
        </a>
        <a className="hover:text-blue-500 hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <Linkedin size={18} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
