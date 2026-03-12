import React from "react";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 sm:px-8 border-t border-slate-200/60 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 transition-all z-40">
      <div className="flex flex-col sm:flex-row items-center gap-1.5 text-center sm:text-left font-medium">
        <span>© {new Date().getFullYear()} ConnectNeighbour.</span>
        <span className="flex items-center gap-1.5">
          Built with{" "}
          <Heart
            size={16}
            className="text-rose-500 fill-rose-500 animate-pulse"
          />{" "}
          for neighborhoods.
        </span>
      </div>

      <div className="flex gap-6">
        <a
          target="_blank"
          href="https://github.com/ANSHU-PALIWAL"
          className="text-slate-400 hover:text-emerald-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <Github size={20} />
        </a>
        <a
          href="#"
          className="text-slate-400 hover:text-emerald-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <Twitter size={20} />
        </a>
        <a
          target="_blank"
          href="https://www.linkedin.com/in/priyanshu-paliwal-017a6a262/"
          className="text-slate-400 hover:text-emerald-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <Linkedin size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
