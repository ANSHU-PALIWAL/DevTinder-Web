import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Shield,
  Users,
  Map,
  HeartHandshake,
  Coffee,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.2 } },
};

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    variants={fadeIn}
    whileHover={{ y: -10, scale: 1.02 }}
    className="relative bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-emerald-200 transition-all duration-500 group overflow-hidden"
  >
    {/* Animated background glow on hover */}
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-200/50 transition-colors duration-500" />

    <div
      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner`}
    >
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed text-[16px]">{description}</p>
  </motion.div>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Dynamic Animated Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-300/10 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Hero Section */}
      <motion.div
        className="max-w-5xl mx-auto text-center relative z-10"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeIn}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white shadow-sm text-emerald-700 font-bold text-sm mb-10 border border-emerald-100 italic"
        >
          <Sparkles size={16} className="text-emerald-500 animate-pulse" />
          <span>The Future of Local Living</span>
        </motion.div>

        <motion.h1
          variants={fadeIn}
          className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-10"
        >
          Beyond <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700">
            Just Neighbours.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeIn}
          className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-16 font-light"
        >
          We aren’t just an app; we are the digital bridge to your physical
          community.
          <span className="text-slate-900 font-medium">
            {" "}
            ConnectNeighbour
          </span>{" "}
          helps you turn the "stranger next door" into the friend who shares
          your morning coffee.
        </motion.p>

        <motion.div
          variants={fadeIn}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link
            to="/login"
            className="px-10 py-5 text-base font-bold text-white bg-slate-900 hover:bg-emerald-600 rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-2 flex items-center gap-3 group"
          >
            Get Started Free
            <Zap size={18} className="group-hover:fill-current" />
          </Link>
          <button className="px-10 py-5 text-base font-bold text-slate-700 bg-white border border-slate-200 hover:border-emerald-200 rounded-2xl shadow-sm transition-all duration-300 flex items-center gap-3">
            Our Mission
          </button>
        </motion.div>
      </motion.div>

      {/* Stats Section - Adds Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="max-w-6xl mx-auto mt-40 w-full grid grid-cols-2 md:grid-cols-4 gap-12 text-center border-y border-slate-200/60 py-16"
      >
        {[
          ["Upto", "100 km Radius"],
          ["100%", "Verified"],
          ["Secure", "Chat"],
          ["24/7", "Support"],
        ].map(([stat, label], i) => (
          <div key={i}>
            <div className="text-4xl font-black text-slate-900">{stat}</div>
            <div className="text-emerald-600 font-bold uppercase tracking-widest text-xs mt-2">
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="max-w-7xl mx-auto mt-40 grid md:grid-cols-3 gap-10 relative z-10"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <FeatureCard
          icon={Shield}
          title="Privacy Fortress"
          description="We built this with a 'Privacy-First' soul. No leaked phone numbers, no creepy tracking. Just safe local vibes."
        />
        <FeatureCard
          icon={HeartHandshake}
          title="Vibe Match"
          description="Forget cold messaging. Our 'Interest-First' algorithm ensures you only chat when there's a real local connection."
        />
        <FeatureCard
          icon={Map}
          title="Hyper-Local"
          description="Why match with someone 50km away? We focus on your immediate 5km radius to foster real face-to-face community."
        />
      </motion.div>

      {/* Brand Message Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto mt-40 bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <Coffee size={64} className="mx-auto mb-8 opacity-50" strokeWidth={1} />
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Ready to meet your neighborhood?
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
          Stop scrolling past faces on the street. Start building the circle
          that makes your area feel like home.
        </p>
        <Link
          to="/signup"
          className="inline-block px-12 py-5 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-xl"
        >
          JOIN THE CIRCLE
        </Link>
      </motion.div>
    </div>
  );
};

export default AboutUs;
