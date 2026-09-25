import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useCurrency, Currency, CURRENCY_CONFIG } from "../../lib/currency";

interface CurrencySelectorProps {
  showLabel?: boolean;
  className?: string;
}

/**
 * CurrencySelector
 * 
 * Compact, professional currency switcher for HumanAPI.
 * Displays:
 *   Currency [ ₹ INR ▾ ]
 * Dropdown with ₹ INR and $ USD.
 * Adheres strictly to the HumanAPI warm aesthetic (#FFF9F2, #342A24, #C96F42).
 */
export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  showLabel = true,
  className = ""
}) => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currencies: Currency[] = ["INR", "USD"];

  const handleSelect = (code: Currency) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-2 select-none ${className}`}
    >
      {showLabel && (
        <span className="text-[12px] font-medium text-[#7B6C60] whitespace-nowrap">
          Currency
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select currency"
        className="inline-flex items-center gap-1.5 h-[36px] px-2.5 rounded-[10px] bg-[#FFF9F2] hover:bg-[#F6F0E7] border border-[#342A24]/15 text-[#342A24] text-[13px] font-medium transition-all duration-150 shadow-2xs hover:border-[#342A24]/25 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42]"
      >
        <span className="font-semibold text-[#342A24]">
          {CURRENCY_CONFIG[currency].symbol}
        </span>
        <span>{CURRENCY_CONFIG[currency].label}</span>
        <ChevronDown
          size={14}
          className={`text-[#7B6C60] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-label="Currency options"
            className="absolute top-full right-0 mt-1.5 min-w-[140px] p-1.5 rounded-[12px] bg-[#FFF9F2] border border-[#342A24]/10 shadow-[0_10px_30px_rgba(52,42,36,0.08)] z-50 focus:outline-hidden"
          >
            {currencies.map((code) => {
              const isSelected = currency === code;
              const info = CURRENCY_CONFIG[code];

              return (
                <button
                  key={code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-[8px] text-[13px] text-left transition-colors duration-150 ${
                    isSelected
                      ? "bg-[#C96F42]/10 text-[#C96F42] font-semibold"
                      : "text-[#342A24] hover:bg-[#F6F0E7]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-center font-bold">{info.symbol}</span>
                    <span>{info.label}</span>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-[#C96F42] shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelector;
