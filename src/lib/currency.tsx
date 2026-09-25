import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type Currency = "INR" | "USD";

export const STORAGE_KEY = "humanapi_currency";

/**
 * Configurable exchange-rate constant for frontend prototype.
 * 899 INR * 0.01178 = ~10.59 USD.
 * Structured so it can be swapped for a backend/payment service rate later.
 * Frontend currency selector is purely a DISPLAY preference.
 */
export const INR_TO_USD_RATE = 0.01178;
export const USD_TO_INR_RATE = 1 / INR_TO_USD_RATE;

export const CURRENCY_CONFIG: Record<
  Currency,
  {
    code: Currency;
    symbol: string;
    label: string;
    name: string;
  }
> = {
  INR: {
    code: "INR",
    symbol: "₹",
    label: "INR",
    name: "Indian Rupee"
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "USD",
    name: "US Dollar"
  }
};

// Intl.NumberFormat formatters
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

/**
 * Format base price (which is in INR) into the targeted display currency.
 */
export function formatPrice(amountInINR: number, currency: Currency): string {
  if (currency === "INR") {
    return inrFormatter.format(amountInINR);
  }
  const usdAmount = amountInINR * INR_TO_USD_RATE;
  return usdFormatter.format(usdAmount);
}

/**
 * Format an amount that is already in the specified currency.
 */
export function formatRawCurrency(amount: number, currency: Currency): string {
  if (currency === "INR") {
    return inrFormatter.format(amount);
  }
  return usdFormatter.format(amount);
}

/**
 * Convert an INR base price into numerical target currency.
 */
export function convertPrice(amountInINR: number, targetCurrency: Currency): number {
  if (targetCurrency === "INR") return amountInINR;
  return Math.round(amountInINR * INR_TO_USD_RATE * 100) / 100;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInINR: number) => string;
  formatAmount: (amountInINR: number) => string;
  convertPrice: (amountInINR: number) => number;
  currencySymbol: string;
  currencyLabel: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as Currency;
      if (saved === "INR" || saved === "USD") {
        return saved;
      }
    }
    return "INR"; // Default currency is INR
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, c);
      } catch (e) {
        console.error("Failed to save currency preference", e);
      }
    }
  };

  const handleFormatPrice = (amountInINR: number) => {
    return formatPrice(amountInINR, currency);
  };

  const handleConvertPrice = (amountInINR: number) => {
    return convertPrice(amountInINR, currency);
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatPrice: handleFormatPrice,
    formatAmount: handleFormatPrice,
    convertPrice: handleConvertPrice,
    currencySymbol: CURRENCY_CONFIG[currency].symbol,
    currencyLabel: CURRENCY_CONFIG[currency].label
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextType => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Graceful fallback if used outside Provider
    return {
      currency: "INR",
      setCurrency: () => {},
      formatPrice: (amt) => formatPrice(amt, "INR"),
      formatAmount: (amt) => formatPrice(amt, "INR"),
      convertPrice: (amt) => amt,
      currencySymbol: "₹",
      currencyLabel: "INR"
    };
  }
  return ctx;
};

/**
 * AnimatedPrice
 * 
 * Provides an extremely subtle 180ms crossfade animation when currency changes:
 * old price: opacity 1, y 0
 * new price: opacity 0, y 4 -> opacity 1, y 0
 */
export const AnimatedPrice: React.FC<{
  amountInINR: number;
  className?: string;
}> = ({ amountInINR, className = "" }) => {
  const { currency, formatPrice: fmt } = useCurrency();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={`${currency}-${amountInINR}`}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-block ${className}`}
      >
        {fmt(amountInINR)}
      </motion.span>
    </AnimatePresence>
  );
};
