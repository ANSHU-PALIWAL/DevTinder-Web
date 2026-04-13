import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Gavel, Building2, Globe, AlertTriangle, Copyright, Mail } from "lucide-react";

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

const LegalNotice = () => {
  return (
    <>
      <Helmet>
        <title>Legal Notice — ConnectNeighbour</title>
        <meta
          name="description"
          content="Legal notice and imprint for ConnectNeighbour. Information about the company, intellectual property, and governing jurisdiction."
        />
        <link rel="canonical" href="https://connectneighbour.in/legal" />
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[140px] pointer-events-none"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24">
          <motion.div {...fadeIn} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 font-bold text-xs mb-6">
              <Gavel size={14} className="animate-pulse" />
              LEGAL INFORMATION
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Legal{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Notice
              </span>
            </h1>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Last updated: April 14, 2026. This page provides the mandatory legal disclosures for the ConnectNeighbour platform.
            </p>
          </motion.div>

          <div className="space-y-5">
            <Section icon={Building2} title="1. Platform Owner">
              <p>
                <strong>ConnectNeighbour</strong> is an independent, privately-operated platform created and maintained by Priyanshu Paliwal.
              </p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li><strong>Country of Operation:</strong> India</li>
                <li><strong>Contact Email:</strong>{" "}
                  <a href="mailto:hello.connectneighbour@gmail.com" className="text-emerald-700 font-semibold hover:underline">
                    hello.connectneighbour@gmail.com
                  </a>
                </li>
                <li><strong>Website:</strong>{" "}
                  <a href="https://connectneighbour.in" className="text-emerald-700 font-semibold hover:underline">
                    connectneighbour.in
                  </a>
                </li>
              </ul>
            </Section>

            <Section icon={Copyright} title="2. Intellectual Property">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>The name "ConnectNeighbour", the logo, and all original content on this website are the intellectual property of the platform owner.</li>
                <li>All text, graphics, UI designs, and source code are protected under applicable copyright laws.</li>
                <li>Unauthorized reproduction, distribution, or modification of any material on this platform is strictly prohibited.</li>
              </ul>
            </Section>

            <Section icon={Globe} title="3. Third-Party Content & Links">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>Blog images are sourced from <strong>Unsplash</strong> under their free license and are used for illustrative purposes.</li>
                <li>ConnectNeighbour may contain links to external websites. We are not responsible for the content or privacy practices of these third-party sites.</li>
                <li>Map tiles are served by <strong>OpenStreetMap</strong> contributors under the ODbL license.</li>
              </ul>
            </Section>

            <Section icon={Gavel} title="4. Governing Law & Jurisdiction">
              <p>
                These legal terms are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising from the use of ConnectNeighbour shall be subject to the exclusive jurisdiction of the courts in Rajasthan, India.
              </p>
            </Section>

            <Section icon={AlertTriangle} title="5. Disclaimer">
              <p>
                The information provided on ConnectNeighbour is for general informational and community-building purposes only. While we strive to keep data accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, or reliability of any information on the platform.
              </p>
            </Section>

            <Section icon={Mail} title="6. Contact for Legal Inquiries">
              <p>
                For any legal concerns, takedown requests, or compliance inquiries, contact us directly at{" "}
                <a href="mailto:hello.connectneighbour@gmail.com" className="text-emerald-700 font-semibold hover:underline">
                  hello.connectneighbour@gmail.com
                </a>.
                We commit to responding within 48 business hours.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalNotice;
