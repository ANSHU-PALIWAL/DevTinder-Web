import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Shield,
  Map,
  HeartHandshake,
  Coffee,
  Sparkles,
  Zap,
  Camera,
  Layers,
  MapPin,
  Radar,
  Star,
  Heart,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.2 } },
  viewport: { once: true, margin: "-50px" },
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    variants={fadeIn}
    whileHover={{ y: -10, scale: 1.02 }}
    className="relative bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-emerald-200 transition-all duration-500 group overflow-hidden"
  >
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-200/50 transition-colors duration-500" />
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
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
    <>
      <Helmet>
        <title>About Us — The Future of Local Living | ConnectNeighbour</title>
        <meta
          name="description"
          content="ConnectNeighbour is the digital bridge to your physical community. Discover our mission to build safe, mutual, and privacy-first local neighborhoods."
        />
        <link rel="canonical" href="https://connectneighbour.in/about" />
      </Helmet>
      <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex flex-col pt-20 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background blobs */}
      <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
      <motion.div animate={{ scale: [1.2, 1, 1.2], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-[20%] left-[-5%] w-[600px] h-[600px] bg-emerald-300/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <motion.div className="max-w-5xl mx-auto text-center relative z-10" initial="initial" whileInView="whileInView" variants={staggerContainer} viewport={{ once:true }}>
        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white shadow-sm text-emerald-700 font-bold text-sm mb-10 border border-emerald-100 italic">
          <Sparkles size={16} className="text-emerald-500 animate-pulse" />
          <span>The Future of Local Living</span>
        </motion.div>

        <motion.h1 variants={fadeIn} className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-10">
          Beyond <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700">Just Neighbours.</span>
        </motion.h1>

        <motion.p variants={fadeIn} className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-16 font-light">
          We aren’t just an app; we are the digital bridge to your physical community. 
          <span className="text-slate-900 font-medium"> ConnectNeighbour</span> helps you turn the "stranger next door" into the friend who shares your morning coffee.
        </motion.p>

        <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-6">
          <Link to="/login" className="px-10 py-5 text-base font-bold text-white bg-slate-900 hover:bg-emerald-600 rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-2 flex items-center gap-3 group">
            Get Started Free <Zap size={18} className="group-hover:fill-current" />
          </Link>
          <a href="#features" className="px-10 py-5 text-base font-bold text-slate-700 bg-white border border-slate-200 hover:border-emerald-200 rounded-2xl shadow-sm transition-all duration-300 flex items-center gap-3">
            Explore Features
          </a>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto mt-32 w-full grid grid-cols-2 md:grid-cols-4 gap-12 text-center border-y border-slate-200/60 py-16 relative z-10">
        {[ ["Upto", "100 km Radius"], ["100%", "Verified"], ["Secure", "Chat"], ["24/7", "Support"] ].map(([stat, label], i) => (
          <div key={i}>
            <div className="text-4xl font-black text-slate-900">{stat}</div>
            <div className="text-emerald-600 font-bold uppercase tracking-widest text-xs mt-2">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Core Philosophy Grid */}
      <motion.div id="features" className="max-w-7xl mx-auto mt-24 grid md:grid-cols-3 gap-10 relative z-10 pt-10" initial="initial" whileInView="whileInView" variants={staggerContainer} viewport={{ once: true, margin: "-100px" }}>
        <FeatureCard icon={Shield} title="Privacy Fortress" description="Built with a 'Privacy-First' soul. No leaked phone numbers, no creepy tracking. Just safe local vibes." />
        <FeatureCard icon={HeartHandshake} title="Vibe Match" description="Forget cold messaging. Our algorithm ensures you only chat when there's a mutual local connection." />
        <FeatureCard icon={Map} title="Hyper-Local Limit" description="We intentionally limit discovery to a strict 100km radius to guarantee real face-to-face community building." />
      </motion.div>

      {/* Standard App Features Highlight */}
      <div className="max-w-6xl mx-auto mt-40 w-full relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Complete Social Ecosystem</h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Everything you need to discover, connect, and thrive in your local neighborhood beautifully engineered.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="order-2 md:order-1 relative h-[350px] bg-white rounded-[3rem] shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-emerald-50/50" />
             <div className="relative z-10 flex flex-col gap-4">
                <div className="w-64 bg-white rounded-2xl shadow-lg p-4 flex gap-4 items-center -rotate-6 transform hover:rotate-0 transition-all duration-500 border border-slate-100">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><Camera size={20}/></div>
                  <div className="flex-1 space-y-2"><div className="h-3 bg-slate-200 rounded-full w-3/4"></div><div className="h-2 bg-slate-100 rounded-full w-1/2"></div></div>
                </div>
                <div className="w-64 bg-white rounded-2xl shadow-lg p-4 flex gap-4 items-center rotate-3 transform hover:rotate-0 transition-all duration-500 border border-slate-100 ml-12">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-500"><Layers size={20}/></div>
                  <div className="flex-1 space-y-2"><div className="h-3 bg-slate-200 rounded-full w-full"></div><div className="h-2 bg-slate-100 rounded-full w-2/3"></div></div>
                </div>
             </div>
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="order-1 md:order-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Camera size={28} /></div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Expressive Profiles</h3>
            <p className="text-lg text-slate-500 leading-relaxed mb-6">Build a profile that truly represents you. Upload multiple gallery images, highlight your unique skills, and write a bio that attracts the right local energy.</p>
            <ul className="space-y-3 font-semibold text-slate-700">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500"/>6-Image HD Gallery</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Custom Skill Tags</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Rich Biography Setup</li>
            </ul>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Layers size={28} /></div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">The Classic Swipe Feed</h3>
            <p className="text-lg text-slate-500 leading-relaxed mb-6">Effortlessly discover neighbors with our buttery-smooth swiping interface. Review profiles, check out their skills, and instantly 'Connect' or 'Pass' to curate your local network.</p>
            <ul className="space-y-3 font-semibold text-slate-700">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Framer-Motion Fluid Swipes</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Instant Mutual Matching</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Zero Spam Guarantee</li>
            </ul>
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="relative h-[350px] bg-slate-900 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-800/80 pointer-events-none" />
             <div className="relative z-10 w-56 h-72 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-transform hover:scale-105 duration-500">
               <div className="h-44 bg-slate-200 w-full" />
               <div className="flex-1 bg-white p-4 flex justify-between items-center">
                 <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-rose-500 bg-white shadow-sm"><X size={20}/></div>
                 <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30"><Heart size={24} className="fill-current"/></div>
               </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* PREMIUM RADAR HUB SPOTLIGHT */}
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto w-full mt-10 mb-40 relative z-20">
        <div className="bg-slate-900 rounded-[3rem] p-8 sm:p-10 md:p-16 overflow-hidden relative shadow-2xl border border-slate-800">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-6 shadow-sm">
                <Star size={14} className="fill-current" /> Premium Feature
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Discovery Map Hub</h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8 font-light">
                Elevate your networking with our crown jewel: a fully interactive, real-time map of your neighborhood. See exactly where your community thrives.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700 transition-colors group-hover:bg-emerald-900 group-hover:border-emerald-700"><Radar size={18}/></div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Exact 100km Radar</h4>
                    <p className="text-slate-400 text-sm mt-1">Plot up to 100 users natively on a smooth CartoDB-powered map instantly fetching live coordinates.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700 transition-colors group-hover:bg-emerald-900 group-hover:border-emerald-700"><MapPin size={18}/></div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Live Pin Interaction</h4>
                    <p className="text-slate-400 text-sm mt-1">Hover over pins to see real distance metrics. Click any neighbor to trigger a sleek connective bottom-sheet modal.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-72 sm:h-80 md:h-[400px] bg-slate-800 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden flex items-center justify-center group">
               <div className=" absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-400 via-slate-900 to-slate-900 transition-opacity group-hover:opacity-30"></div>
               <div className="absolute w-full h-full border border-slate-700/30 rounded-full scale-[1.5] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
               <div className="absolute w-full h-full border border-slate-700/50 rounded-full scale-100 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
               <div className="absolute w-full h-full border border-slate-700/80 rounded-full scale-50 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s]"></div>
               
               <div className="relative z-10 w-24 h-24 rounded-full border-4 border-emerald-500 bg-emerald-900 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500">
                 <div className="absolute -inset-2 rounded-full border-2 border-emerald-400 opacity-50 animate-pulse"></div>
                 <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" className="w-full h-full object-cover rounded-full" alt="Map Pin"/>
               </div>
               
               <div className="absolute bottom-[20%] right-[20%] w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-lg transform transition-transform group-hover:scale-125 duration-500 delay-100"><img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt="Neighbor"/></div>
               <div className="absolute top-[30%] left-[20%] w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-lg transform transition-transform group-hover:scale-125 duration-500 delay-200"><img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt="Neighbor"/></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Brand Message Section / CTA */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-5xl mx-auto bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden z-10 shadow-xl border border-emerald-500 w-full mb-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <Coffee size={64} className="mx-auto mb-8 opacity-50" strokeWidth={1} />
        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
          Ready to meet your neighborhood?
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
          Stop scrolling past faces on the street. Start building the circle
          that makes your area feel like home.
        </p>
        <Link to="/login" className="inline-block px-12 py-5 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-xl active:scale-95">
          JOIN THE CIRCLE
        </Link>
      </motion.div>
    </div>
    </>
  );
};

export default AboutUs;
