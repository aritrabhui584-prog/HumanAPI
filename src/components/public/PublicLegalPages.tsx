import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ShieldCheck, Lock, FileText, CheckCircle2, Mail, MessageSquare, Send } from "lucide-react";

export const PublicLegalPages: React.FC<{
  type: "terms" | "privacy" | "cancellation" | "guidelines" | "security" | "contact" | "help";
}> = ({ type }) => {
  const { navigate, showNotification } = useApp();
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showNotification("Support inquiry dispatched. Our team responds within 2 hours.", "success");
  };

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation pills for legal/policy docs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 border-b border-[#DED3C6] mb-8 no-scrollbar text-xs">
          {[
            { id: "terms", label: "Terms of Service" },
            { id: "privacy", label: "Privacy Policy" },
            { id: "cancellation", label: "Cancellation & Refunds" },
            { id: "guidelines", label: "Expert Guidelines" },
            { id: "security", label: "Security & WebRTC" },
            { id: "contact", label: "Contact Us" },
            { id: "help", label: "Help Center" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                type === tab.id
                  ? "bg-[#C86B3C] text-[#FFF9F0] shadow-warm-sm"
                  : "bg-[#FFF9F0] text-[#75675C] border border-[#DED3C6] hover:text-[#332720]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content switch */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm text-[#332720] space-y-6">
          {type === "terms" && (
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">Legal Agreement</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#332720]">Terms of Service</h1>
              <p className="text-xs text-[#75675C]">Last updated: October 2025</p>

              <section className="space-y-3 text-sm text-[#75675C] leading-relaxed">
                <h3 className="font-serif font-bold text-base text-[#332720]">1. The Nature of the Service</h3>
                <p>
                  HumanAPI facilitates high-leverage, direct peer-to-peer consultations between verified specialists ("Experts") and clients seeking technical, design, strategic, or career counsel ("Clients"). HumanAPI operates as an intermediary infrastructure provider and does not assume employment relationships with verified experts.
                </p>
                <h3 className="font-serif font-bold text-base text-[#332720]">2. Consultation Sprints & Timers</h3>
                <p>
                  Consultations are purchased in discrete time allocations of 5, 10, or 15 minutes. Both parties agree that the consultation terminates gracefully when the room countdown concludes. Unused minutes are non-transferable and do not roll over.
                </p>
                <h3 className="font-serif font-bold text-base text-[#332720]">3. Code of Conduct & Confidentiality</h3>
                <p>
                  All participants agree to maintain professional decorum. Clients are advised not to share unredacted API secrets, proprietary production database credentials, or sensitive personally identifiable information during screen sharing.
                </p>
              </section>
            </div>
          )}

          {type === "privacy" && (
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#74806B]">Data Protection</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#332720]">Privacy Policy</h1>
              <p className="text-xs text-[#75675C]">Effective Date: October 2025</p>

              <section className="space-y-3 text-sm text-[#75675C] leading-relaxed">
                <h3 className="font-serif font-bold text-base text-[#332720]">1. Zero Call Recording Principle</h3>
                <p>
                  HumanAPI does NOT record, store, or archive audio or video streams transmitted through our consultation rooms. Peer-to-peer media streams are routed via WebRTC with DTLS-SRTP encryption directly between participants or transient TURN relays.
                </p>
                <h3 className="font-serif font-bold text-base text-[#332720]">2. Data We Collect</h3>
                <p>
                  We store account credentials, profile details, verified work sample references, session transaction timestamps, review ratings, and in-call text chat messages to support user dispute resolution and historical review in your dashboard.
                </p>
              </section>
            </div>
          )}

          {type === "cancellation" && (
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">Fair Guarantee</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#332720]">Cancellation & Refund Policy</h1>
              <p className="text-xs text-[#75675C]">Standard Consumer Protections</p>

              <section className="space-y-3 text-sm text-[#75675C] leading-relaxed">
                <h3 className="font-serif font-bold text-base text-[#332720]">1. Expert No-Show Guarantee</h3>
                <p>
                  If an expert fails to join the consultation room within 3 minutes of the scheduled starting time, the session is flagged as a No-Show and the client receives an instant 100% refund to their original payment method.
                </p>
                <h3 className="font-serif font-bold text-base text-[#332720]">2. Client Cancellations</h3>
                <p>
                  Clients may cancel any booking up to 2 hours prior to the scheduled consultation with a full refund. Cancellations made within 2 hours are subject to a 50% expert compensation fee to respect reserved specialist calendar windows.
                </p>
              </section>
            </div>
          )}

          {type === "guidelines" && (
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#74806B]">Accreditation Standard</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#332720]">Expert Guidelines & Code</h1>
              <p className="text-xs text-[#75675C]">Standards for Verified Practitioners</p>

              <div className="space-y-3 text-sm text-[#75675C] leading-relaxed">
                <p>
                  As an accredited HumanAPI specialist, you represent the highest standard of technical, design, and strategic counsel.
                </p>
                <div className="space-y-2 text-xs text-[#332720]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#718B68]" />
                    <span>Punctuality: Join the video consultation at least 60 seconds before start time.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#718B68]" />
                    <span>High Signal: Zero small-talk padding. Rapidly diagnose the core problem.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#718B68]" />
                    <span>Actionable Outcomes: Ensure the client leaves with clear, next-step solutions.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === "security" && (
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">Infrastructure</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#332720]">Security & WebRTC Privacy</h1>
              <p className="text-xs text-[#75675C]">Encrypted Consultation Protocols</p>

              <div className="space-y-4 text-sm text-[#75675C] leading-relaxed">
                <p>
                  Our consultation rooms are engineered for zero-compromise security. Media streams use Datagram Transport Layer Security (DTLS) and Secure Real-time Transport Protocol (SRTP).
                </p>
                <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2 text-xs text-[#332720]">
                  <div className="font-bold flex items-center gap-2">
                    <Lock size={15} className="text-[#C86B3C]" />
                    Ephemeral Room Tokens
                  </div>
                  <p className="text-[#75675C]">
                    Room URLs and access tokens are generated cryptographically and self-destruct upon room completion.
                  </p>
                </div>
              </div>
            </div>
          )}

          {type === "contact" && (
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">Concierge Desk</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#332720]">Contact HumanAPI</h1>
              <p className="text-sm text-[#75675C]">
                Need assistance with a consultation, verification status, or institutional enterprise billing? Reach out directly.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-[#718B68]/10 border border-[#718B68]/30 text-[#718B68] space-y-2">
                  <h3 className="font-serif font-bold text-lg">Inquiry Dispatched Successfully</h3>
                  <p className="text-xs text-[#332720]">
                    A concierge specialist will review your ticket and respond to your email within 2 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#332720] mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-xs text-[#332720] focus:outline-none focus:border-[#C86B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#332720] mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactSubject}
                      onChange={e => setContactSubject(e.target.value)}
                      placeholder="e.g. Booking assistance or Verification query"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-xs text-[#332720] focus:outline-none focus:border-[#C86B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#332720] mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      placeholder="How can our support concierge help you?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-xs text-[#332720] focus:outline-none focus:border-[#C86B3C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] font-bold text-xs shadow-warm-sm flex items-center gap-2"
                  >
                    <Send size={14} />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {type === "help" && (
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#74806B]">Self-Service Desk</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#332720]">Help Center</h1>
              <p className="text-sm text-[#75675C]">
                Browse common guides on audio/video troubleshooting, scheduling, and payouts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#332720]">Camera / Mic Permissions</h4>
                  <p className="text-xs text-[#75675C]">
                    How to grant browser access to your webcam and screen sharing before entering the room.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#332720]">Rescheduling a Session</h4>
                  <p className="text-xs text-[#75675C]">
                    Instructions on moving your consultation slot without incurring cancellation fees.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#332720]">Expert Verification Status</h4>
                  <p className="text-xs text-[#75675C]">
                    What our accreditation team reviews and how to check your AI interview score.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#332720]">Payment Invoicing & GST</h4>
                  <p className="text-xs text-[#75675C]">
                    Download detailed PDF receipts with company tax IDs for business expense reimbursement.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
