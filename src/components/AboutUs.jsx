import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Map, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    variants={fadeIn}
    className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group"
  >
    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300 shadow-sm border border-emerald-100/50">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-[15px]">
      {description}
    </p>
  </motion.div>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] opacity-60 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Hero Section */}
      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/70 text-emerald-700 font-bold text-sm mb-8 border border-emerald-200/50 shadow-sm">
          <HeartHandshake size={18} strokeWidth={2.5} />
          <span>Building Stronger Communities</span>
        </motion.div>
        
        <motion.h1 
          variants={fadeIn}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8"
        >
          Welcome to <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">
            ConnectNeighbour
          </span>
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-14 font-medium"
        >
          We believe that the best connections are the ones right outside your door. Discover locals, borrow a hand, and share a coffee with the people in your neighborhood.
        </motion.p>
        
        <motion.div variants={fadeIn}>
          <Link to="/login" className="inline-block px-8 py-4 text-[15px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] transition-all duration-300 active:scale-95 hover:-translate-y-1 uppercase tracking-wide">
            Join Your Neighborhood
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="max-w-5xl mx-auto mt-32 grid md:grid-cols-3 gap-8 relative z-10"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <FeatureCard 
          icon={<Shield className="text-emerald-600" size={32} strokeWidth={2} />}
          title="Privacy First"
          description="Your personal information stays private. No phone numbers are shared, ensuring a safe environment for everyone."
        />
        <FeatureCard 
          icon={<Users className="text-emerald-600" size={32} strokeWidth={2} />}
          title="Mutual Match Only"
          description="Connect only when the interest is mutual. Say goodbye to unwanted messages and hello to meaningful interactions."
        />
        <FeatureCard 
          icon={<Map className="text-emerald-600" size={32} strokeWidth={2} />}
          title="Local Radius"
          description="Find people within a 1km - 5km radius. Meet the neighbors you walk past every day but haven't spoken to yet."
        />
      </motion.div>
    </div>
  );
};

export default AboutUs;
