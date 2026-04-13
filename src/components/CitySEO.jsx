import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { MapPin, Users, Shield, ArrowRight, Sparkles } from "lucide-react";

// Simplified animation variants
const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
};
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
};

const CitySEO = () => {
  const { city } = useParams();
  // Capitalize city name safely
  const formattedCity = city
    ? city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ")
    : "Your City";

  return (
    <>
      <Helmet>
        <title>Meet Verified Neighbors in {formattedCity} | ConnectNeighbour</title>
        <meta
          name="description"
          content={`Connect safely with people who live near you in ${formattedCity}. Match with locals, share skills, and build a trusted hyper-local community without sharing your number!`}
        />
        <meta
          name="keywords"
          content={`meet neighbors in ${formattedCity}, ${formattedCity} local community app, network in ${formattedCity}, find friends ${formattedCity}, neighborhood network`}
        />
        <link rel="canonical" href={`https://connectneighbour.in/location/${city}`} />
        
        {/* Dynamic FAQ Schema for this specific city */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `Is ConnectNeighbour active in ${formattedCity}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Yes! ConnectNeighbour helps residents of ${formattedCity} discover and safely interact with their immediate neighbors within a specific geographic radius.`
                }
              },
              {
                "@type": "Question",
                "name": "Do I have to share my phone number?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Our privacy-first engine ensures you never have to share your phone number or exact address to connect."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] overflow-hidden relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-emerald-200/20 rounded-full blur-[140px] pointer-events-none"
        />

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
              <MapPin size={15} className="text-emerald-500 animate-pulse" />
              <span className="uppercase tracking-widest text-[11px]">Local Network: {formattedCity}</span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl sm:text-7xl md:text-[80px] font-black text-slate-900 tracking-tighter leading-[0.92] mb-8"
            >
              Connect with locals in<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600">
                {formattedCity}.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
            >
              Whether you want to share a coffee, borrow a wrench, or find a gym buddy — ConnectNeighbour is the safest way to meet people who live exactly where you do in <span className="font-semibold text-slate-700">{formattedCity}</span>.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
              >
                Join {formattedCity} Hub <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-3 gap-6 mt-24"
          >
            {[
              {
                icon: Users,
                title: "1. Match Nearby",
                desc: "Swipe securely on profiles strictly within a reliable radius from your location.",
              },
              {
                icon: Shield,
                title: "2. Privacy Intact",
                desc: "No phone numbers are blasted to the public. We handle communication purely over the app.",
              },
              {
                icon: Sparkles,
                title: "3. Mutual Magic",
                desc: "You only interface with neighbors when there is a mutual double-opt-in interest.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600">
                  <feature.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default CitySEO;
