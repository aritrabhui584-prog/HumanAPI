import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ClientPaymentTransaction, ClientPaymentMethod } from "../../types";
import {
  CreditCard,
  QrCode,
  Plus,
  Trash2,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Receipt
} from "lucide-react";

export const UserPaymentsView: React.FC = () => {
  const {
    clientPaymentMethods,
    clientTransactions,
    addClientPaymentMethod,
    removeClientPaymentMethod,
    requestTransactionRefund,
    navigate,
    showNotification
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"history" | "methods" | "invoices">("history");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [selectedReceipt, setSelectedReceipt] = useState<ClientPaymentTransaction | null>(null);
  const [refundTx, setRefundTx] = useState<ClientPaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);

  // Form states for adding payment method
  const [newMethodType, setNewMethodType] = useState<"upi" | "card">("upi");
  const [newUpiId, setNewUpiId] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardBrand, setNewCardBrand] = useState("Visa");
  const [newCardExpiry, setNewCardExpiry] = useState("12/28");

  const filteredTransactions = clientTransactions.filter(tx => {
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    const matchesQuery =
      tx.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sessionTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleAddMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMethodType === "upi") {
      if (!newUpiId.includes("@")) {
        showNotification("Please enter a valid UPI ID (e.g. name@upi)", "error");
        return;
      }
      addClientPaymentMethod({
        userId: "u-curr",
        type: "upi",
        title: `UPI (${newUpiId})`,
        details: newUpiId,
        brand: "UPI Provider",
        token: `tok_upi_${Date.now().toString().slice(-6)}`
      });
    } else {
      const last4 = newCardNumber.replace(/\s+/g, "").slice(-4) || "4242";
      addClientPaymentMethod({
        userId: "u-curr",
        type: "card",
        title: `${newCardBrand} ending in ${last4}`,
        details: `•••• ${last4}`,
        brand: newCardBrand,
        token: `tok_card_${Date.now().toString().slice(-6)}`,
        expiryDate: newCardExpiry
      });
    }
    setIsAddMethodOpen(false);
    setNewUpiId("");
    setNewCardNumber("");
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTx || !refundReason.trim()) return;
    requestTransactionRefund(refundTx.id, refundReason);
    setRefundTx(null);
    setRefundReason("");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-[1240px] mx-auto w-full min-w-0">
      {/* Header Banner */}
      <div className="p-4 sm:p-7 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm space-y-3 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C96F42]">
              Client Financial Systems
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[#342A24] mt-0.5">
              Payments & Billing
            </h1>
            <p className="text-xs sm:text-sm text-[#7B6C60] mt-1 leading-relaxed max-w-2xl">
              Manage client payment methods, download official session receipts, track transaction history, and submit eligible refund requests.
            </p>
          </div>
          <button
            onClick={() => setIsAddMethodOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-warm-xs transition-colors shrink-0"
          >
            <Plus size={16} />
            <span>Add Payment Method</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E8DCCB]/60 overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab("history")}
            className={`px-3.5 py-2 rounded-[8px] transition-colors whitespace-nowrap ${
              activeSubTab === "history"
                ? "bg-[#342A24] text-[#FFF9F2]"
                : "bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24]"
            }`}
          >
            Payment History ({clientTransactions.length})
          </button>
          <button
            onClick={() => setActiveSubTab("methods")}
            className={`px-3.5 py-2 rounded-[8px] transition-colors whitespace-nowrap ${
              activeSubTab === "methods"
                ? "bg-[#342A24] text-[#FFF9F2]"
                : "bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24]"
            }`}
          >
            Saved Payment Methods ({clientPaymentMethods.length})
          </button>
          <button
            onClick={() => setActiveSubTab("invoices")}
            className={`px-3.5 py-2 rounded-[8px] transition-colors whitespace-nowrap ${
              activeSubTab === "invoices"
                ? "bg-[#342A24] text-[#FFF9F2]"
                : "bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24]"
            }`}
          >
            Invoices & Receipts
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PAYMENT HISTORY */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFF9F2] p-3.5 rounded-[16px] border border-[#E8DCCB]">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search payments by expert, topic, or transaction ID..."
                className="w-full pl-9 pr-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 overflow-x-auto text-xs">
              <span className="text-[#7B6C60] font-medium hidden sm:inline">Status:</span>
              {["all", "paid", "refunded", "pending"].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1.5 rounded-[6px] capitalize font-medium transition-colors ${
                    filterStatus === st
                      ? "bg-[#C96F42] text-[#FFF9F2]"
                      : "bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center bg-[#FFF9F2] rounded-[20px] border border-[#E8DCCB] space-y-2">
              <Receipt size={32} className="mx-auto text-[#7B6C60]" />
              <h3 className="font-serif font-bold text-base text-[#342A24]">No payment transactions found</h3>
              <p className="text-xs text-[#7B6C60]">Book an expert consultation to see your verified payment history.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs hover:border-[#C96F42]/40 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DCCB]/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] text-[#7B6C60] font-semibold">{tx.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tx.status === "paid"
                              ? "bg-[#77816C]/15 text-[#77816C]"
                              : tx.status === "refunded"
                              ? "bg-[#B85D3D]/15 text-[#B85D3D]"
                              : "bg-[#B89152]/15 text-[#B89152]"
                          }`}
                        >
                          {tx.status}
                        </span>
                        {tx.refundStatus === "requested" && (
                          <span className="px-2 py-0.5 rounded-full bg-[#B89152]/20 text-[#B89152] text-[10px] font-bold">
                            Refund Requested
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#342A24] mt-1">{tx.sessionTopic}</h4>
                      <p className="text-xs text-[#7B6C60] mt-0.5">
                        Specialist: <strong className="text-[#342A24]">{tx.expertName}</strong> · {tx.duration}-min sprint
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="font-serif font-bold text-lg text-[#342A24]">
                        {tx.currencySymbol}{tx.totalAmount}
                      </div>
                      <p className="text-[11px] text-[#7B6C60]">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#7B6C60] pt-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-[#C96F42]" />
                      <span>{tx.paymentMethodLabel}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 sm:pt-0">
                      <button
                        onClick={() => setSelectedReceipt(tx)}
                        className="px-3 py-1.5 rounded-[8px] bg-[#F6F0E7] hover:bg-[#E8DCCB] text-[#342A24] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FileText size={13} />
                        <span>View Receipt</span>
                      </button>

                      {tx.status === "paid" && !tx.refundStatus && (
                        <button
                          onClick={() => setRefundTx(tx)}
                          className="px-3 py-1.5 rounded-[8px] bg-[#F6F0E7] hover:bg-[#B85D3D]/10 text-[#B85D3D] font-semibold transition-colors"
                        >
                          Request Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SAVED PAYMENT METHODS */}
      {activeSubTab === "methods" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientPaymentMethods.map(pm => (
              <div
                key={pm.id}
                className="p-5 rounded-[18px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs flex items-start justify-between gap-3 relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {pm.type === "upi" ? (
                      <QrCode size={18} className="text-[#C96F42]" />
                    ) : (
                      <CreditCard size={18} className="text-[#C96F42]" />
                    )}
                    <span className="font-serif font-bold text-base text-[#342A24]">{pm.title}</span>
                    {pm.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-[#77816C]/15 text-[#77816C] text-[10px] font-bold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-sm text-[#7B6C60]">{pm.details}</p>
                  <p className="text-[11px] text-[#7B6C60]/80">Tokenized & Encrypted via Gateway</p>
                </div>

                <button
                  onClick={() => removeClientPaymentMethod(pm.id)}
                  className="p-2 rounded-[8px] text-[#7B6C60] hover:text-[#B85D3D] hover:bg-[#B85D3D]/10 transition-colors"
                  title="Remove method"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INVOICES & RECEIPTS */}
      {activeSubTab === "invoices" && (
        <div className="space-y-3">
          <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] text-xs text-[#7B6C60]">
            All session payments generate official HumanAPI tax receipts with verified gateway verification signatures.
          </div>
          {clientTransactions.map(tx => (
            <div
              key={tx.id}
              className="p-4 rounded-[14px] bg-[#FFF9F2] border border-[#E8DCCB] flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-mono font-bold text-[#342A24]">{tx.id}</span>
                <p className="text-[#7B6C60] mt-0.5">{tx.sessionTopic} — {tx.expertName}</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(tx)}
                className="px-3.5 py-2 rounded-[8px] bg-[#C96F42] text-[#FFF9F2] font-semibold flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Invoice PDF</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: ADD PAYMENT METHOD */}
      {isAddMethodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] p-6 space-y-5 text-[#342A24] shadow-warm-lg">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <h3 className="font-serif font-bold text-lg">Save Client Payment Method</h3>
              <button onClick={() => setIsAddMethodOpen(false)} className="text-[#7B6C60] hover:text-[#342A24]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMethodSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB]">
                <button
                  type="button"
                  onClick={() => setNewMethodType("upi")}
                  className={`py-2 rounded-[8px] font-bold transition-colors ${
                    newMethodType === "upi" ? "bg-[#C96F42] text-[#FFF9F2]" : "text-[#7B6C60]"
                  }`}
                >
                  UPI VPA
                </button>
                <button
                  type="button"
                  onClick={() => setNewMethodType("card")}
                  className={`py-2 rounded-[8px] font-bold transition-colors ${
                    newMethodType === "card" ? "bg-[#C96F42] text-[#FFF9F2]" : "text-[#7B6C60]"
                  }`}
                >
                  Credit / Debit Card
                </button>
              </div>

              {newMethodType === "upi" ? (
                <div className="space-y-1.5">
                  <label className="font-bold text-[#342A24]">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={newUpiId}
                    onChange={e => setNewUpiId(e.target.value)}
                    placeholder="e.g. aritra@upi or phone@paytm"
                    className="w-full p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs font-mono"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#342A24]">Card Number</label>
                    <input
                      type="text"
                      value={newCardNumber}
                      onChange={e => setNewCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 4821"
                      className="w-full p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-[#342A24]">Brand</label>
                      <select
                        value={newCardBrand}
                        onChange={e => setNewCardBrand(e.target.value)}
                        className="w-full p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs"
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="RuPay">RuPay</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-[#342A24]">Expiry</label>
                      <input
                        type="text"
                        value={newCardExpiry}
                        onChange={e => setNewCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMethodOpen(false)}
                  className="px-4 py-2.5 rounded-[10px] bg-[#F6F0E7] text-[#342A24] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] text-[#FFF9F2] font-semibold"
                >
                  Tokenize & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECEIPT / INVOICE VIEWER */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] p-6 space-y-5 text-[#342A24] shadow-warm-lg max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C96F42]">
                  Official Tax Receipt
                </span>
                <h3 className="font-serif font-bold text-xl text-[#342A24]">HumanAPI Receipt</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-[#7B6C60] hover:text-[#342A24]">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#E8DCCB]/60 pb-2 font-mono">
                <span>Transaction ID:</span>
                <strong className="text-[#342A24]">{selectedReceipt.id}</strong>
              </div>
              <div className="flex justify-between border-b border-[#E8DCCB]/60 pb-2">
                <span>Client:</span>
                <strong>{selectedReceipt.clientName} ({selectedReceipt.clientEmail})</strong>
              </div>
              <div className="flex justify-between border-b border-[#E8DCCB]/60 pb-2">
                <span>Specialist:</span>
                <strong>{selectedReceipt.expertName}</strong>
              </div>
              <div className="flex justify-between border-b border-[#E8DCCB]/60 pb-2">
                <span>Session Sprint:</span>
                <strong>{selectedReceipt.duration}-Minute Consultation</strong>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[#7B6C60]">
                  <span>Session Base Price:</span>
                  <span>{selectedReceipt.currencySymbol}{selectedReceipt.amount}</span>
                </div>
                <div className="flex justify-between text-[#7B6C60]">
                  <span>Platform Processing Fee:</span>
                  <span>{selectedReceipt.currencySymbol}{selectedReceipt.platformFee}</span>
                </div>
                <div className="flex justify-between text-[#7B6C60]">
                  <span>Taxes (18% GST/Tax):</span>
                  <span>{selectedReceipt.currencySymbol}{selectedReceipt.taxAmount}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-sm text-[#342A24] pt-2 border-t border-[#E8DCCB]">
                  <span>Total Amount Paid:</span>
                  <span>{selectedReceipt.currencySymbol}{selectedReceipt.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#7B6C60] pt-2">
              <div className="flex items-center gap-1.5 text-[#77816C] font-semibold">
                <ShieldCheck size={16} />
                <span>Verified Gateway Signature</span>
              </div>
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 rounded-[10px] bg-[#342A24] text-[#FFF9F2] font-semibold flex items-center gap-1.5"
              >
                <Download size={14} />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REFUND REQUEST */}
      {refundTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] p-6 space-y-4 text-[#342A24] shadow-warm-lg">
            <h3 className="font-serif font-bold text-xl">Request Session Refund</h3>
            <p className="text-xs text-[#7B6C60] leading-relaxed">
              Refunds are reviewed in accordance with HumanAPI's Escrow & Cancellation policy.
            </p>

            <form onSubmit={handleRefundSubmit} className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold">Reason for Refund Request</label>
                <textarea
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="Explain why you are requesting a refund for this session..."
                  rows={4}
                  className="w-full p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs focus:outline-none focus:border-[#C96F42]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRefundTx(null)}
                  className="px-4 py-2 rounded-[10px] bg-[#F6F0E7] text-[#342A24] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[10px] bg-[#B85D3D] text-[#FFF9F2] font-semibold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPaymentsView;
