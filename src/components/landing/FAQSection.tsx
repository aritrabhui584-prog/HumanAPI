import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionTransition } from "../motion/SectionTransition";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does a session work?",
      a: "Once you book a slot or connect with an available expert, you enter a private browser-based consultation room equipped with HD video, crisp audio, screen sharing, and an active sprint countdown timer."
    },
    {
      q: "How are experts verified?",
      a: "Every specialist is vetted through proof of production experience, professional credentials (e.g., GitHub history, verified portfolio, senior engineering/design leadership roles), and an identity check before they can host paid sessions."
    },
    {
      q: "What if the conversation doesn't help?",
      a: "We provide satisfaction escrow protection. If an expert is unable to address your blocker or if technical issues occur during the call, your fee is refunded in full."
    },
    {
      q: "How much does it cost?",
      a: "Pricing is transparent and set by each verified practitioner per 5, 10, or 15-minute consultation. You see the exact rate before booking, with no surprise charges or recurring subscriptions."
    },
    {
      q: "Can I become an expert?",
      a: "Yes. If you have senior experience and a verifiable track record in software engineering, system architecture, product design, or technical leadership, you can submit an application to join the practitioner network."
    }
  ];

  return (
    <section id="faq" className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#FFF9F2] border-t border-[#342A24]/[0.08] select-none">
      <SectionTransition className="max-w-[840px] mx-auto w-full flex flex-col justify-center h-full">
        <div className="max-w-xl mb-10 sm:mb-12">
          <span className="text-[12px] font-semibold text-[#C96F42] uppercase tracking-[0.14em] block mb-2.5">
            Frequently Asked Questions
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-semibold text-[#342A24] tracking-[-0.035em] leading-[1.1]">
            Common questions about HumanAPI.
          </h2>
        </div>

        <div className="divide-y divide-[#342A24]/[0.08] border-y border-[#342A24]/[0.08]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className="py-4 sm:py-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42] rounded-md"
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] sm:text-[17px] font-semibold text-[#342A24] tracking-[-0.01em]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#7B6C60] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#C96F42]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2.5 text-[14.5px] text-[#7B6C60] leading-relaxed pr-6">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </SectionTransition>
    </section>
  );
};

export default FAQSection;
