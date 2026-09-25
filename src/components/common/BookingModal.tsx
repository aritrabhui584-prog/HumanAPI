import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { RatingStars, VerificationBadge } from "./Badge";
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Receipt,
  Lock,
  Building,
  Wallet
} from "lucide-react";
import { useCurrency, AnimatedPrice } from "../../lib/currency";
import { PaymentMethodType } from "../../types";
import { PaymentSuccessAnimation } from "./PaymentSuccessAnimation";
import { HumanAPILoader, HumanAPILoadingButton } from "../loading";

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    bookingModalExpert,
    bookingModalDuration,
    projects,
    processClientCheckout,
    clientPaymentMethods,
    navigate,
    showNotification
  } = useApp();

  const { formatPrice } = useCurrency();

  // Booking details state
  const [selectedDuration, setSelectedDuration] = useState<5 | 10 | 15>(
    bookingModalDuration || 10
  );
  const [topic, setTopic] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("Today · 4:30 PM");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Payment checkout state
  const [checkoutStep, setCheckoutStep] = useState<"details" | "payment" | "verifying" | "success">("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("upi");
  const [upiId, setUpiId] = useState("aritra@upi");
  const [cardNumber, setCardNumber] = useState("4532 8910 2049 4821");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [bankName, setBankName] = useState("HDFC Bank");
  const [walletName, setWalletName] = useState("Paytm");
  const [saveMethodForFuture, setSaveMethodForFuture] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // BODY SCROLL LOCK MANAGEMENT
  useEffect(() => {
    if (isBookingModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    } else {
      setCheckoutStep("details");
    }
  }, [isBookingModalOpen]);

  // KEYBOARD ACCESSIBILITY (ESCAPE TO CLOSE)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isBookingModalOpen) {
        closeBookingModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBookingModalOpen, closeBookingModal]);

  if (!isBookingModalOpen || !bookingModalExpert) return null;

  const expert = bookingModalExpert;
  const basePriceINR =
    selectedDuration === 5
      ? expert.pricing.duration5
      : selectedDuration === 10
      ? expert.pricing.duration10
      : expert.pricing.duration15;

  const platformFeeINR = Math.round(basePriceINR * 0.10);
  const taxAmountINR = Math.round((basePriceINR + platformFeeINR) * 0.18);
  const totalAmountINR = basePriceINR + platformFeeINR + taxAmountINR;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      showNotification("Please specify what you need help with.", "error");
      return;
    }
    setCheckoutStep("payment");
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    setCheckoutStep("verifying");

    try {
      const result = await processClientCheckout({
        expert,
        duration: selectedDuration,
        scheduledTime: selectedSlot,
        topic,
        paymentMethodType: paymentMethod,
        upiId: paymentMethod === "upi" ? upiId : undefined,
        cardLast4: paymentMethod === "card" ? cardNumber.slice(-4) : undefined,
        cardBrand: "Visa",
        bankName: paymentMethod === "netbanking" ? bankName : undefined,
        walletName: paymentMethod === "wallet" ? walletName : undefined,
        saveMethodForFuture,
        projectId: selectedProjectId || undefined
      });

      setIsProcessing(false);
      setConfirmedBookingId(result.booking.id);
      setCheckoutStep("success");
      showNotification("Payment verified & booking confirmed!", "success");
    } catch (err: any) {
      setIsProcessing(false);
      setCheckoutStep("payment");
      showNotification("Payment verification failed. Please try again.", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#332720]/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans"
      onClick={closeBookingModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="relative w-[calc(100vw-24px)] max-w-[760px] h-[min(92dvh,900px)] max-h-[calc(100dvh-24px)] rounded-[24px] sm:rounded-[28px] bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-lg flex flex-col text-[#332720] overflow-hidden animate-in zoom-in-95 duration-150 box-border mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* STICKY MODAL HEADER */}
        <div className="sticky top-0 z-20 bg-[#FFF9F0] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#DED3C6] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] object-cover border border-[#DED3C6] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 id="booking-modal-title" className="font-serif font-bold text-base sm:text-lg text-[#332720] truncate">
                  {checkoutStep === "payment" ? "Client Payment Checkout" : `Book Consultation with ${expert.name}`}
                </h2>
                <VerificationBadge size="sm" />
              </div>
              <p className="text-[11px] sm:text-xs text-[#75675C] truncate">{expert.headline}</p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-2 rounded-[12px] text-[#75675C] hover:text-[#332720] hover:bg-[#F7F1E7] transition-colors shrink-0"
            aria-label="Close booking dialog"
            id="close-booking-modal-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: DETAILS & SCHEDULE */}
        {checkoutStep === "details" && (
          <form onSubmit={handleNextToPayment} className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar overscroll-contain">
              {/* 1. Duration Sprint Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#332720]">
                  1. Choose Sprint Duration:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { dur: 5 as const, price: expert.pricing.duration5 },
                    { dur: 10 as const, price: expert.pricing.duration10 },
                    { dur: 15 as const, price: expert.pricing.duration15 }
                  ].map(item => (
                    <button
                      type="button"
                      key={item.dur}
                      onClick={() => setSelectedDuration(item.dur)}
                      className={`p-2.5 sm:p-3 rounded-[14px] border text-center transition-all min-w-0 ${
                        selectedDuration === item.dur
                          ? "bg-[#C86B3C] text-[#FFF9F0] border-[#C86B3C] font-bold shadow-warm-sm"
                          : "bg-[#F7F1E7] border-[#DED3C6] text-[#332720] hover:border-[#C86B3C]"
                      }`}
                    >
                      <div className="text-[11px] sm:text-xs truncate">{item.dur} Minutes</div>
                      <div className="text-xs sm:text-sm font-extrabold mt-0.5 truncate">
                        <AnimatedPrice amountInINR={item.price} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Consultation Topic */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#332720]">
                  2. What is your primary roadblock or question?
                </label>
                <textarea
                  rows={3}
                  required
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g., Investigating memory leak in Node stream pipeline, or feedback on B2B pricing model..."
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#F7F1E7] border border-[#DED3C6] text-xs text-[#332720] focus:outline-none focus:border-[#C86B3C] resize-y box-border placeholder-[#75675C]/60"
                />
              </div>

              {/* 3. Available Slots */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#332720]">
                  3. Available Slot:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Today · 4:30 PM", "Today · 6:15 PM", "Tomorrow · 11:00 AM", "Tomorrow · 3:00 PM"].map(slot => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-[12px] border text-xs font-semibold text-left transition-all min-w-0 truncate ${
                        selectedSlot === slot
                          ? "bg-[#FFF9F0] border-[#C86B3C] text-[#C86B3C] font-bold shadow-warm-sm"
                          : "bg-[#F7F1E7] border-[#DED3C6] text-[#75675C]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Optional Project Linking */}
              {projects.length > 0 && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#332720] flex items-center justify-between">
                    <span>4. Link to a Project (Optional):</span>
                    <span className="text-[10px] text-[#75675C] font-normal">Organize notes & experts</span>
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-[12px] bg-[#F7F1E7] border border-[#DED3C6] text-xs text-[#332720] focus:outline-none focus:border-[#C86B3C] min-w-0 box-border truncate"
                  >
                    <option value="">No Project (Standalone Consultation)</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 z-20 bg-[#FFF9F0] px-4 sm:px-6 pt-3 pb-[max(16px,env(safe-area-inset-bottom,16px))] border-t border-[#DED3C6] space-y-2 shrink-0">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-[16px] bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] font-bold text-[clamp(14px,4vw,17px)] shadow-warm-md flex items-center justify-center gap-2 transition-all leading-snug"
              >
                <span>Proceed to Payment Checkout ({formatPrice(basePriceINR)})</span>
                <ArrowRight size={18} className="shrink-0" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: TRANSPARENT CHECKOUT & PAYMENT METHOD SELECTION */}
        {checkoutStep === "payment" && (
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar overscroll-contain">
              {/* Transparent Cost Breakdown */}
              <div className="p-4 rounded-[18px] bg-[#F7F1E7] border border-[#DED3C6] space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C86B3C]">
                  Transparent Cost Breakdown
                </span>
                <div className="flex justify-between text-[#75675C]">
                  <span>{selectedDuration}-Minute Session Base Price:</span>
                  <span className="font-semibold text-[#332720]">{formatPrice(basePriceINR)}</span>
                </div>
                <div className="flex justify-between text-[#75675C]">
                  <span>Platform Processing Fee (10%):</span>
                  <span className="font-semibold text-[#332720]">{formatPrice(platformFeeINR)}</span>
                </div>
                <div className="flex justify-between text-[#75675C]">
                  <span>Taxes & Compliance (18% GST):</span>
                  <span className="font-semibold text-[#332720]">{formatPrice(taxAmountINR)}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-base text-[#332720] pt-2 border-t border-[#DED3C6]">
                  <span>Total Amount Due:</span>
                  <span className="text-[#C86B3C]">{formatPrice(totalAmountINR)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#332720]">Select Payment Method:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 rounded-[12px] bg-[#F7F1E7] border border-[#DED3C6] text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`py-2 px-2 rounded-[8px] flex items-center justify-center gap-1 transition-colors ${
                      paymentMethod === "upi" ? "bg-[#332720] text-[#FFF9F0]" : "text-[#75675C]"
                    }`}
                  >
                    <QrCode size={13} />
                    <span>UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-2 rounded-[8px] flex items-center justify-center gap-1 transition-colors ${
                      paymentMethod === "card" ? "bg-[#332720] text-[#FFF9F0]" : "text-[#75675C]"
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`py-2 px-2 rounded-[8px] flex items-center justify-center gap-1 transition-colors ${
                      paymentMethod === "netbanking" ? "bg-[#332720] text-[#FFF9F0]" : "text-[#75675C]"
                    }`}
                  >
                    <Building size={13} />
                    <span>Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`py-2 px-2 rounded-[8px] flex items-center justify-center gap-1 transition-colors ${
                      paymentMethod === "wallet" ? "bg-[#332720] text-[#FFF9F0]" : "text-[#75675C]"
                    }`}
                  >
                    <Wallet size={13} />
                    <span>Wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`py-2 px-2 rounded-[8px] flex items-center justify-center gap-1 transition-colors ${
                      paymentMethod === "paypal" ? "bg-[#332720] text-[#FFF9F0]" : "text-[#75675C]"
                    }`}
                  >
                    <span>PayPal</span>
                  </button>
                </div>

                {/* Selected Method Details */}
                {paymentMethod === "upi" && (
                  <div className="p-4 rounded-[14px] bg-[#FFF9F0] border border-[#DED3C6] space-y-3 text-xs">
                    <span className="font-bold text-[#332720]">Featured Indian Payment Method (UPI):</span>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. aritra@upi or 98300XXXXX@paytm"
                      className="w-full p-2.5 rounded-[10px] bg-[#F7F1E7] border border-[#DED3C6] font-mono text-xs"
                    />
                    <div className="p-2.5 rounded-[10px] bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                      <span className="text-[11px] text-[#75675C]">QR Code Verification:</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C86B3C]/15 text-[#C86B3C]">
                        Instant Gateway QR
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="p-4 rounded-[14px] bg-[#FFF9F0] border border-[#DED3C6] space-y-3 text-xs">
                    <span className="font-bold text-[#332720]">Credit / Debit Card (Tokenized):</span>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="w-full p-2.5 rounded-[10px] bg-[#F7F1E7] border border-[#DED3C6] font-mono text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="p-2.5 rounded-[10px] bg-[#F7F1E7] border border-[#DED3C6] font-mono text-xs"
                      />
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        maxLength={4}
                        className="p-2.5 rounded-[10px] bg-[#F7F1E7] border border-[#DED3C6] font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="p-4 rounded-[14px] bg-[#FFF9F0] border border-[#DED3C6] space-y-2 text-xs">
                    <span className="font-bold text-[#332720]">Net Banking Provider:</span>
                    <select
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full p-2.5 rounded-[10px] bg-[#F7F1E7] border border-[#DED3C6] text-xs"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === "wallet" && (
                  <div className="p-4 rounded-[14px] bg-[#FFF9F0] border border-[#DED3C6] space-y-2 text-xs">
                    <span className="font-bold text-[#332720]">Digital Wallet:</span>
                    <select
                      value={walletName}
                      onChange={e => setWalletName(e.target.value)}
                      className="w-full p-2.5 rounded-[10px] bg-[#F7F1E7] border border-[#DED3C6] text-xs"
                    >
                      <option value="Paytm Wallet">Paytm Wallet</option>
                      <option value="PhonePe Wallet">PhonePe Wallet</option>
                      <option value="Amazon Pay">Amazon Pay</option>
                      <option value="Mobikwik">Mobikwik</option>
                    </select>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="p-4 rounded-[14px] bg-[#FFF9F0] border border-[#DED3C6] space-y-2 text-xs">
                    <span className="font-bold text-[#332720]">PayPal International Checkout:</span>
                    <p className="text-[#75675C]">Redirects to secure PayPal portal for authorization.</p>
                  </div>
                )}

                {/* Save method option */}
                <label className="flex items-center gap-2 text-xs text-[#332720] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={saveMethodForFuture}
                    onChange={e => setSaveMethodForFuture(e.target.checked)}
                    className="rounded text-[#C86B3C] focus:ring-[#C86B3C]"
                  />
                  <span>Save this payment method for future checkouts</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 z-20 bg-[#FFF9F0] px-4 sm:px-6 pt-3 pb-[max(16px,env(safe-area-inset-bottom,16px))] border-t border-[#DED3C6] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setCheckoutStep("details")}
                className="px-4 py-3 rounded-[14px] bg-[#F7F1E7] text-[#332720] font-bold text-xs"
              >
                Back
              </button>
              <HumanAPILoadingButton
                type="button"
                onClick={handleExecutePayment}
                isLoading={isProcessing}
                loadingText="Processing Payment..."
                icon={<Lock size={16} />}
                className="flex-1 py-3.5"
                id="checkout-pay-btn"
              >
                Pay Securely {formatPrice(totalAmountINR)}
              </HumanAPILoadingButton>
            </div>
          </div>
        )}

        {/* STEP 3: SERVER PAYMENT VERIFICATION */}
        {checkoutStep === "verifying" && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4 text-[#332720]">
            <HumanAPILoader size="lg" showWordmark />
            <h3 className="font-serif font-bold text-xl">Payment Verification</h3>
            <p className="text-xs text-[#75675C] max-w-sm">
              We are verifying your transaction signature with the payment provider server-side. Please wait...
            </p>
          </div>
        )}

        {/* STEP 4: PAYMENT SUCCESS & BOOKING CONFIRMED */}
        {checkoutStep === "success" && (
          <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 text-[#332720] overflow-y-auto">
            <PaymentSuccessAnimation className="w-36 h-36 sm:w-44 sm:h-44 mx-auto shrink-0 pointer-events-none" />

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#718B68]">
                Payment Verified & Authorized
              </span>
              <h3 className="font-serif font-bold text-2xl">Consultation Confirmed!</h3>
              <p className="text-xs text-[#75675C]">
                Your {selectedDuration}-minute session with <strong>{expert.name}</strong> is scheduled for {selectedSlot}.
              </p>
            </div>

            <div className="w-full max-w-sm p-4 rounded-[16px] bg-[#F7F1E7] border border-[#DED3C6] text-xs text-left space-y-2">
              <div className="flex justify-between text-[#75675C]">
                <span>Total Paid:</span>
                <strong className="text-[#332720]">{formatPrice(totalAmountINR)}</strong>
              </div>
              <div className="flex justify-between text-[#75675C]">
                <span>Payment Method:</span>
                <span className="capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#75675C]">
                <span>Status:</span>
                <span className="text-[#718B68] font-bold">Paid (Server Verified)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm pt-2">
              <button
                onClick={() => {
                  closeBookingModal();
                  if (confirmedBookingId) {
                    navigate("session-room", { bookingId: confirmedBookingId });
                  } else {
                    navigate("user-dashboard");
                  }
                }}
                className="w-full py-3.5 px-4 rounded-[14px] bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] font-bold text-xs shadow-warm-md flex items-center justify-center gap-2"
              >
                <span>Enter Consultation Room</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
