import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  Zap,
  Shield,
  HeartHandshake,
  Map,
  Radar,
  Users,
  Star,
  ArrowRight,
  Coffee,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.15 } },
  viewport: { once: true, margin: "-50px" },
};

const FEATURES = [
  {
    icon: Shield,
    title: "Privacy Fortress",
    desc: "No leaked phone numbers, no creepy tracking. Your safety is the product.",
    color: "emerald",
  },
  {
    icon: HeartHandshake,
    title: "Mutual Match Only",
    desc: "Both of you must be interested before a single message can be sent. Zero spam guaranteed.",
    color: "blue",
  },
  {
    icon: Map,
    title: "100km Hard Limit",
    desc: "Discovery capped at 100km to ensure every connection stays real and face-to-face possible.",
    color: "violet",
  },
  {
    icon: Radar,
    title: "Discovery Map Hub",
    desc: "See exactly where your network thrives on a live, interactive neighborhood radar.",
    color: "emerald",
  },
  {
    icon: Users,
    title: "Skill Sharing",
    desc: "Tag your real skills. Find a yoga partner, a plumber, a German tutor — all next door.",
    color: "amber",
  },
  {
    icon: Star,
    title: "Verified Community",
    desc: "Every profile is backed by real sign-up data. No bots. No fake neighbors.",
    color: "rose",
  },
];

const colorMap = {
  emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
  amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
};

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>ConnectNeighbour — Hyper-Local Social Network for Your Neighborhood</title>
        <meta
          name="description"
          content="Discover, match, and connect with verified neighbors within 100km. Share skills, borrow tools, find friends — all without sharing your phone number. Join ConnectNeighbour today."
        />
        <meta name="keywords" content="hyperlocal social network, neighbor app india, connect with neighbors, neighborhood community app, local social networking" />
        <link rel="canonical" href="https://connectneighbour.in/home" />
        <meta property="og:title" content="ConnectNeighbour — Meet Your Neighbors Safely" />
        <meta property="og:description" content="Smart, privacy-first local networking. Match with neighbors, share skills, and build the community your street deserves." />
        <meta property="og:url" content="https://connectneighbour.in/home" />
        <meta property="og:image" content="https://connectneighbour.in/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does ConnectNeighbour work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ConnectNeighbour matches you with verified neighbors within a local radius. You can swipe, match, and chat safely without ever sharing your phone number."
                }
              },
              {
                "@type": "Question",
                "name": "Is ConnectNeighbour safe to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We use a privacy-first approach. Your exact location and phone number are hidden, and you only interact with people if there is a mutual double-opt-in interest."
                }
              },
              {
                "@type": "Question",
                "name": "What is the maximum geographic radius?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The platform focuses on hyper-local community building within a 1km to 100km radius depending on your discovery settings."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] overflow-hidden relative">
        {/* Background ambient blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-emerald-200/20 rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[30%] left-[-5%] w-[500px] h-[500px] bg-blue-200/10 rounded-full blur-[120px] pointer-events-none"
        />

        {/* ─── HERO ─── */}
        <section className="pt-28 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center"
            initial="initial"
            whileInView="whileInView"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-sm text-emerald-700 font-bold text-sm mb-8 border border-emerald-100"
            >
              <Sparkles size={15} className="text-emerald-500 animate-pulse" />
              <span>Hyper-Local. Privacy-First. Real Connections.</span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl sm:text-7xl md:text-[88px] font-black text-slate-900 tracking-tighter leading-[0.92] mb-8"
            >
              Your Neighbors
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600">
                Are Waiting.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
            >
              Stop being strangers. ConnectNeighbour helps you safely discover, match, and
              build genuine relationships with people who live{" "}
              <span className="text-slate-800 font-semibold">right next door.</span>
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/login"
                id="hero-cta-join"
                className="px-10 py-4 text-base font-bold text-white bg-slate-900 hover:bg-emerald-600 rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 group"
              >
                Join Free <Zap size={18} className="group-hover:fill-current" />
              </Link>
              <Link
                to="/about"
                id="hero-cta-learn"
                className="px-10 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
              >
                Learn More <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-y border-slate-200/60 py-12 max-w-4xl mx-auto"
          >
            {[
              ["100 km", "Max Radius"],
              ["100%", "Verified Profiles"],
              ["Mutual", "Match Only"],
              ["0", "Phone Numbers Shared"],
            ].map(([stat, label], i) => (
              <div key={i}>
                <div className="text-3xl font-black text-slate-900">{stat}</div>
                <div className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mt-2">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Everything You Need to
              <span className="text-emerald-600"> Thrive Locally</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
              Every feature is built around one core principle: make local connections easier, safer, and more meaningful.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="whileInView"
            variants={staggerContainer}
          >
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title}
                variants={fadeIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-emerald-200 transition-all duration-500 group cursor-default"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${colorMap[color]}`}
                >
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed text-[15px]">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Up and running in{" "}
                <span className="text-emerald-400">3 steps</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="whileInView"
              variants={staggerContainer}
            >
              {[
                {
                  step: "01",
                  title: "Create Your Profile",
                  desc: "Add a real photo, your skills, and a short bio. Be yourself — authenticity attracts the right neighbors.",
                },
                {
                  step: "02",
                  title: "Swipe the Feed",
                  desc: "Browse neighbors in your radius. Connect with those you'd like to know, pass on the rest — no awkwardness either way.",
                },
                {
                  step: "03",
                  title: "Match & Chat",
                  desc: "Only mutual connections unlock a chat. When both of you are in, say hello and plan your first coffee.",
                },
              ].map(({ step, title, desc }) => (
                <motion.div
                  key={step}
                  variants={fadeIn}
                  className="relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-5xl font-black text-emerald-500/30 mb-6 leading-none">
                    {step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-slate-400 leading-relaxed text-[15px]">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── SOCIAL PROOF / BLOG TEASER ─── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                From the <span className="text-emerald-600">Neighbourhood Blog</span>
              </h2>
              <p className="text-slate-500 mt-2 font-light">Tips, stories, and insights on local living.</p>
            </div>
            <Link
              to="/blogs"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-emerald-600 transition-colors"
            >
              All Articles <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="whileInView"
            variants={staggerContainer}
          >
            {[
              {
                slug: "how-to-meet-neighbors-2025",
                title: "How to Meet Your Neighbors in 2025 Without It Being Awkward",
                cat: "Community Tips",
              },
              {
                slug: "rise-of-hyperlocal-social-networks",
                title: "The Rise of Hyper-Local Social Networks",
                cat: "Industry Trends",
              },
              {
                slug: "skill-sharing-between-neighbors",
                title: "How Skill-Sharing Can Save You ₹50,000 a Year",
                cat: "Personal Finance",
              },
            ].map(({ slug, title, cat }) => (
              <motion.div key={slug} variants={fadeIn}>
                <Link
                  to={`/blogs/${slug}`}
                  className="group block bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="p-6">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{cat}</span>
                    <h3 className="text-slate-800 font-bold text-lg mt-2 leading-snug group-hover:text-emerald-700 transition-colors">
                      {title}
                    </h3>
                    <div className="flex items-center gap-1 mt-4 text-emerald-600 text-sm font-semibold">
                      Read article <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-emerald-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <Coffee size={56} className="mx-auto mb-6 opacity-60" strokeWidth={1} />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to meet the street?
            </h2>
            <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-10 font-light">
              Join thousands of neighbors already building real local communities. It's free, safe, and takes 2 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                id="bottom-cta-join"
                className="px-10 py-4 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all hover:scale-105 shadow-xl"
              >
                JOIN THE CIRCLE
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
