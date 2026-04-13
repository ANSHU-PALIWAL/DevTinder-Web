import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Bell, UserCheck, Globe, Mail } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.6 },
};

const Section = ({ icon: Icon, title, children }) => (
  <motion.div {...fadeIn} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
        <Icon size={20} />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
    <div className="text-slate-600 text-sm leading-relaxed space-y-3">{children}</div>
  </motion.div>
);

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — ConnectNeighbour</title>
        <meta
          name="description"
          content="Read ConnectNeighbour's privacy policy. Learn how we collect, use, and protect your personal data while keeping your neighborhood connections safe and private."
        />
        <link rel="canonical" href="https://connectneighbour.in/privacy" />
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[140px] pointer-events-none"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24">
          <motion.div {...fadeIn} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 font-bold text-xs mb-6">
              <Shield size={14} className="animate-pulse" />
              YOUR DATA, YOUR RULES
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Privacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Policy
              </span>
            </h1>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Last updated: April 14, 2026. We take your privacy extremely seriously. Here's exactly what we do with your data.
            </p>
          </motion.div>

          <div className="space-y-5">
            <Section icon={Database} title="1. Information We Collect">
              <p>When you create an account on ConnectNeighbour, we collect:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li><strong>Account Data:</strong> Name, email address, and password (hashed and salted).</li>
                <li><strong>Profile Data:</strong> Age, gender, bio, skills, and profile/gallery photos you choose to upload.</li>
                <li><strong>Location Data:</strong> Approximate geographic coordinates to match you with nearby neighbors. We never store your precise street address.</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, and device/browser type for improving our service.</li>
              </ul>
            </Section>

            <Section icon={Lock} title="2. How We Use Your Information">
              <p>Your data is used exclusively to:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li>Authenticate your account and maintain your session.</li>
                <li>Match you with neighbors within your selected radius (1km — 100km).</li>
                <li>Display your public profile to mutually interested users only.</li>
                <li>Send essential service-related communications (password resets, security alerts).</li>
                <li>Analyze aggregated, anonymized usage patterns to improve our platform.</li>
              </ul>
            </Section>

            <Section icon={Eye} title="3. What We Never Do">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>We <strong>never sell</strong> your personal data to third parties.</li>
                <li>We <strong>never share</strong> your phone number, email, or exact location with other users.</li>
                <li>We <strong>never use</strong> your data for third-party advertising or tracking.</li>
                <li>We <strong>never train AI models</strong> on your personal conversations or profile data.</li>
              </ul>
            </Section>

            <Section icon={UserCheck} title="4. Data Sharing & Third Parties">
              <p>We integrate with the following third-party services:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li><strong>Google OAuth:</strong> For secure authentication. We receive your name and email only — Google does not access your ConnectNeighbour activity.</li>
                <li><strong>Cloudflare:</strong> For SSL/TLS encryption and CDN delivery. Cloudflare may process connection metadata under their own privacy policy.</li>
                <li><strong>MapLibre / OpenStreetMap:</strong> For rendering map views. No personal data is sent to map tile servers.</li>
              </ul>
            </Section>

            <Section icon={Shield} title="5. Data Security">
              <p>
                All data is transmitted over HTTPS with TLS 1.3 encryption. Passwords are hashed using industry-standard bcrypt before storage. Our servers are hosted on AWS with strict firewall rules and access controls. We conduct regular security reviews to identify and patch vulnerabilities.
              </p>
            </Section>

            <Section icon={Bell} title="6. Your Rights">
              <p>You have the right to:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li><strong>Access</strong> all personal data we hold about you.</li>
                <li><strong>Correct</strong> any inaccurate information via your profile settings.</li>
                <li><strong>Delete</strong> your account and all associated data at any time from Settings.</li>
                <li><strong>Withdraw consent</strong> for location tracking by revoking browser permissions.</li>
              </ul>
            </Section>

            <Section icon={Globe} title="7. Cookies & Local Storage">
              <p>
                We use essential cookies to maintain your login session. We do not use advertising cookies or tracking pixels. Our PWA service worker caches static assets locally to improve performance — no personal data is stored in the cache.
              </p>
            </Section>

            <Section icon={Mail} title="8. Contact Us">
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us at{" "}
                <a href="mailto:hello.connectneighbour@gmail.com" className="text-emerald-700 font-semibold hover:underline">
                  hello.connectneighbour@gmail.com
                </a>.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
