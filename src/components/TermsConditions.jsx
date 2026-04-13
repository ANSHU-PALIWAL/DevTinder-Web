import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FileText, UserCheck, ShieldAlert, AlertTriangle, Ban, Scale, Globe, Mail } from "lucide-react";

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

const TermsConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions — ConnectNeighbour</title>
        <meta
          name="description"
          content="Read the Terms & Conditions of ConnectNeighbour. Understand your rights, responsibilities, and our platform's rules for safe, privacy-first neighborhood networking."
        />
        <link rel="canonical" href="https://connectneighbour.in/terms" />
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[140px] pointer-events-none"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24">
          <motion.div {...fadeIn} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 font-bold text-xs mb-6">
              <FileText size={14} className="animate-pulse" />
              PLATFORM RULES
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Terms &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Conditions
              </span>
            </h1>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Last updated: April 14, 2026. By using ConnectNeighbour, you agree to the following terms.
            </p>
          </motion.div>

          <div className="space-y-5">
            <Section icon={UserCheck} title="1. Eligibility & Account">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>You must be at least <strong>18 years old</strong> to use ConnectNeighbour.</li>
                <li>You must provide accurate, truthful information when creating your profile.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>One person may only maintain one active account at a time.</li>
              </ul>
            </Section>

            <Section icon={ShieldAlert} title="2. Acceptable Use">
              <p>You agree to use ConnectNeighbour only for lawful, constructive purposes. Specifically, you will not:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li>Impersonate any person or misrepresent your identity, location, or affiliation.</li>
                <li>Upload content that is obscene, defamatory, hateful, or infringes on the intellectual property of others.</li>
                <li>Use the platform for commercial solicitation, spam, or unsolicited advertising.</li>
                <li>Attempt to scrape, extract, or reverse-engineer any part of our service.</li>
                <li>Harass, threaten, or intimidate other users in any way.</li>
              </ul>
            </Section>

            <Section icon={Scale} title="3. Content Ownership & License">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>You retain ownership of all content (photos, text, etc.) you upload to ConnectNeighbour.</li>
                <li>By uploading content, you grant ConnectNeighbour a non-exclusive, royalty-free license to display that content within the platform to facilitate neighbor connections.</li>
                <li>You confirm that you have the right to share any content you upload and that it does not violate any third-party rights.</li>
              </ul>
            </Section>

            <Section icon={Globe} title="4. Matching & Interactions">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>ConnectNeighbour operates on a <strong>mutual match system</strong>. Both users must express interest before a connection is established.</li>
                <li>We do not guarantee the identity, behavior, or intentions of any user. Exercise your own judgment when interacting with matches.</li>
                <li>ConnectNeighbour is not liable for any offline interactions, damages, or disputes arising from connections made through the platform.</li>
              </ul>
            </Section>

            <Section icon={Ban} title="5. Account Suspension & Termination">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>We reserve the right to suspend or permanently ban accounts that violate these terms without prior notice.</li>
                <li>You may delete your account at any time from Settings. Upon deletion, all personal data will be permanently removed within 30 days.</li>
              </ul>
            </Section>

            <Section icon={AlertTriangle} title="6. Disclaimers & Limitation of Liability">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>ConnectNeighbour is provided <strong>"as is"</strong> without warranties of any kind, express or implied.</li>
                <li>We do not guarantee uninterrupted or error-free service.</li>
                <li>To the maximum extent permitted by law, ConnectNeighbour's total liability to you shall not exceed the amount you have paid us (if any) in the 12 months preceding the claim.</li>
              </ul>
            </Section>

            <Section icon={FileText} title="7. Changes to Terms">
              <p>
                We may update these Terms & Conditions from time to time. Significant changes will be communicated via email or an in-app notification. Continued use of ConnectNeighbour after updates constitutes acceptance of the revised terms.
              </p>
            </Section>

            <Section icon={Mail} title="8. Contact">
              <p>
                For questions about these terms, reach out at{" "}
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

export default TermsConditions;
