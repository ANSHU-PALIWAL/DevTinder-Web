import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Sparkles,
  Github,
  Linkedin,
} from "lucide-react";

const InputField = ({ label, icon: Icon, type = "text", placeholder, value, onChange, required, id }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
      />
    </div>
  </div>
);

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.message.length < 10) {
      setError("Message must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API_BASE_URL + "/contact", form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — ConnectNeighbour Support & Feedback</title>
        <meta
          name="description"
          content="Get in touch with the ConnectNeighbour team. Report an issue, share feedback, suggest a feature, or ask a general query. We reply within 24–48 hours."
        />
        <link rel="canonical" href="https://connectneighbour.in/contact" />
        <meta property="og:title" content="Contact ConnectNeighbour" />
        <meta property="og:description" content="Have a question or feedback? We'd love to hear from you." />
        <meta property="og:url" content="https://connectneighbour.in/contact" />
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
        {/* Background ambient */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[140px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 font-bold text-xs mb-8">
              <Sparkles size={14} className="animate-pulse" />
              WE READ EVERY MESSAGE
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
              Let's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Talk.
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-light">
              Bug report, feature wish, partnership idea, or just a hello — we're all ears and reply within 24–48 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Left column — contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "hello@connectneighbour.in",
                  sub: "For general queries & partnerships",
                },
                {
                  icon: Clock,
                  title: "Response Time",
                  value: "24–48 hours",
                  sub: "We reply to every message",
                },
                {
                  icon: MapPin,
                  title: "Based in",
                  value: "India 🇮🇳",
                  sub: "Serving hyper-local communities nation-wide",
                },
              ].map(({ icon: Icon, title, value, sub }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                >
                  <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{title}</div>
                    <div className="font-bold text-slate-800 text-base">{value}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}

              {/* Social links */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Find Us Online</div>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/ANSHU-PALIWAL"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50"
                  >
                    <Github size={17} /> GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/priyanshu-paliwal-017a6a262/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50"
                  >
                    <Linkedin size={17} /> LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right column — form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg p-8 md:p-10 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                      >
                        <CheckCircle size={40} className="text-emerald-600" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Received! 🎉</h3>
                      <p className="text-slate-500 text-base max-w-sm leading-relaxed mb-8">
                        We've sent a confirmation to your email. Expect our reply within <strong>24–48 hours</strong>.
                      </p>
                      <button
                        onClick={() => setSuccess(false)}
                        className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5 relative z-10"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Send us a message</h2>
                        <p className="text-sm text-slate-500">Fill in the form below and we'll get back to you.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          id="contact-name"
                          label="Your Name"
                          icon={User}
                          placeholder="Rahul Sharma"
                          value={form.name}
                          onChange={handleChange("name")}
                          required
                        />
                        <InputField
                          id="contact-email"
                          label="Email Address"
                          icon={Mail}
                          type="email"
                          placeholder="name@email.com"
                          value={form.email}
                          onChange={handleChange("email")}
                          required
                        />
                      </div>

                      <InputField
                        id="contact-subject"
                        label="Subject"
                        icon={MessageSquare}
                        placeholder="e.g. Bug report, Feature request, Partnership..."
                        value={form.subject}
                        onChange={handleChange("subject")}
                        required
                      />

                      <div className="space-y-1.5">
                        <label htmlFor="contact-message" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                          Message <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          rows={5}
                          placeholder="Tell us everything — the more detail you share, the faster we can help."
                          value={form.message}
                          onChange={handleChange("message")}
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400 resize-none"
                        />
                        <div className="text-right text-[11px] text-slate-400">{form.message.length} / 2000</div>
                      </div>

                      {error && (
                        <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
                          {error}
                        </p>
                      )}

                      <button
                        id="contact-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-100 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} /> Send Message
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-slate-400 pt-1">
                        We'll send a confirmation email to the address you provide upon receipt.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
