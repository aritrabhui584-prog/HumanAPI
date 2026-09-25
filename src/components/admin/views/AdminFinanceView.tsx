import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { DollarSign, SlidersHorizontal, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, RotateCcw, Lock, X } from "lucide-react";

export const AdminFinanceView: React.FC<{ initialSubTab?: "payments" | "payouts" | "fees" }> = ({ initialSubTab = "payments" }) => {
  const {
    clientTransactions,
    platformFeeConfig,
    updatePlatformFee,
    processRefund,
    holdPayout,
    releasePayout,
    adminUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"payments" | "payouts" | "fees">(initialSubTab);

  // Platform Fee Config Modal
  const [feePercent, setFeePercent] = useState<number>(platformFeeConfig.defaultFeePercent);
  const [feeReason, setFeeReason] = useState("");
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  // Refund Modal State
  const [selectedTxForRefund, setSelectedTxForRefund] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState("");

  // Payout Hold/Release State
  const [payoutList, setPayoutList] = useState([
    {
      id: "payout-88101",
      expertName: "Arjun Mehta",
      expertEmail: "arjun@google.com",
      amount: 14250,
      currency: "INR",
      method: "Bank Transfer (ACH / HDFC)",
      status: "processed",
      requestedAt: "2026-09-21"
    },
    {
      id: "payout-88102",
      expertName: "Elena Rostova",
      expertEmail: "elena@design.co",
      amount: 8900,
      currency: "INR",
      method: "UPI (elena@upi)",
      status: "pending",
      requestedAt: "Yesterday"
    },
    {
      id: "payout-88103",
      expertName: "Marcus Vance",
      expertEmail: "marcus@design.org",
      amount: 5400,
      currency: "INR",
      method: "PayPal (marcus@paypal.com)",
      status: "held",
      requestedAt: "3 days ago"
    }
  ]);

  const handleUpdateFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeReason.trim()) return;
    updatePlatformFee(Number(feePercent), feeReason);
    setIsFeeModalOpen(false);
    setFeeReason("");
  };

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxForRefund || !refundReason.trim()) return;
    processRefund(selectedTxForRefund.id, refundReason);
    setSelectedTxForRefund(null);
    setRefundReason("");
  };

  const handleToggleHoldPayout = (payoutId: string, currentStatus: string) => {
    if (currentStatus === "held") {
      releasePayout(payoutId);
      setPayoutList(prev =>
        prev.map(p => (p.id === payoutId ? { ...p, status: "pending" } : p))
      );
    } else {
      holdPayout(payoutId, "Administrative review of session dispute");
      setPayoutList(prev =>
        prev.map(p => (p.id === payoutId ? { ...p, status: "held" } : p))
      );
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
            Global Financial & Revenue Control Center
          </h1>
          <p className="text-xs text-[#7B6C60] mt-1">
            Authoritative financial ledger, client payment gateway transactions, practitioner payouts, and platform fee configurations.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center p-1 rounded-[12px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs">
          <button
            onClick={() => setActiveSubTab("payments")}
            className={`px-3.5 py-1.5 rounded-[9px] text-xs font-bold transition-all ${
              activeSubTab === "payments" ? "bg-[#C96F42] text-[#FFF9F2]" : "text-[#342A24] hover:bg-[#F6F0E7]"
            }`}
          >
            Client Payments
          </button>
          <button
            onClick={() => setActiveSubTab("payouts")}
            className={`px-3.5 py-1.5 rounded-[9px] text-xs font-bold transition-all ${
              activeSubTab === "payouts" ? "bg-[#C96F42] text-[#FFF9F2]" : "text-[#342A24] hover:bg-[#F6F0E7]"
            }`}
          >
            Expert Payouts
          </button>
          <button
            onClick={() => setActiveSubTab("fees")}
            className={`px-3.5 py-1.5 rounded-[9px] text-xs font-bold transition-all ${
              activeSubTab === "fees" ? "bg-[#C96F42] text-[#FFF9F2]" : "text-[#342A24] hover:bg-[#F6F0E7]"
            }`}
          >
            Platform Fees ({platformFeeConfig.defaultFeePercent}%)
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CLIENT PAYMENTS */}
      {activeSubTab === "payments" && (
        <div className="space-y-4">
          <div className="rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs overflow-hidden">
            <div className="p-4 border-b border-[#E8DCCB] bg-[#F6F0E7] flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#342A24]">Authoritative Client Payment Transactions</h2>
              <span className="text-xs font-semibold text-[#7B6C60]">{clientTransactions.length} Total Transactions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#342A24]">
                <thead className="bg-[#F6F0E7] border-b border-[#E8DCCB] text-[11px] font-bold text-[#7B6C60] uppercase">
                  <tr>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Expert</th>
                    <th className="py-3 px-4">Gateway / Method</th>
                    <th className="py-3 px-4">Total Settled</th>
                    <th className="py-3 px-4">Platform Fee</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCB]/60">
                  {clientTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-[#F6F0E7]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C96F42]">{tx.id}</td>
                      <td className="py-3.5 px-4 font-semibold">{tx.clientName}</td>
                      <td className="py-3.5 px-4 font-semibold">{tx.expertName}</td>
                      <td className="py-3.5 px-4">{tx.paymentMethodLabel}</td>
                      <td className="py-3.5 px-4 font-bold">₹{tx.totalAmount}</td>
                      <td className="py-3.5 px-4 text-[#77816C] font-semibold">₹{tx.platformFee}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#77816C]/15 text-[#77816C]">
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {tx.status === "refunded" ? (
                          <span className="text-[11px] font-bold text-[#B85D3D]">Refunded</span>
                        ) : (
                          <button
                            onClick={() => setSelectedTxForRefund(tx)}
                            className="px-2.5 py-1 rounded-[8px] border border-[#B85D3D]/30 text-[#B85D3D] hover:bg-[#B85D3D]/10 text-[11px] font-bold"
                          >
                            Issue Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EXPERT PAYOUTS */}
      {activeSubTab === "payouts" && (
        <div className="space-y-4">
          <div className="rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs overflow-hidden">
            <div className="p-4 border-b border-[#E8DCCB] bg-[#F6F0E7] flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#342A24]">Expert Practitioner Payout Settlement Batches</h2>
              <span className="text-xs font-semibold text-[#7B6C60]">{payoutList.length} Batches</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#342A24]">
                <thead className="bg-[#F6F0E7] border-b border-[#E8DCCB] text-[11px] font-bold text-[#7B6C60] uppercase">
                  <tr>
                    <th className="py-3 px-4">Payout ID</th>
                    <th className="py-3 px-4">Practitioner</th>
                    <th className="py-3 px-4">Payout Method</th>
                    <th className="py-3 px-4">Net Earnings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCB]/60">
                  {payoutList.map(p => (
                    <tr key={p.id} className="hover:bg-[#F6F0E7]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#342A24]">{p.id}</td>
                      <td className="py-3.5 px-4 font-semibold">{p.expertName}</td>
                      <td className="py-3.5 px-4">{p.method}</td>
                      <td className="py-3.5 px-4 font-bold text-[#77816C]">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        {p.status === "processed" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#77816C]/15 text-[#77816C]">Settled</span>}
                        {p.status === "pending" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B89152]/15 text-[#B89152]">Pending Batch</span>}
                        {p.status === "held" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B85D3D]/15 text-[#B85D3D]">Administrative Hold</span>}
                      </td>
                      <td className="py-3.5 px-4 text-[#7B6C60]">{p.requestedAt}</td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status !== "processed" && (
                          <button
                            onClick={() => handleToggleHoldPayout(p.id, p.status)}
                            className={`px-3 py-1 rounded-[8px] text-[11px] font-bold shadow-warm-xs ${
                              p.status === "held"
                                ? "bg-[#77816C] text-[#FFF9F2]"
                                : "bg-[#B85D3D] text-[#FFF9F2]"
                            }`}
                          >
                            {p.status === "held" ? "Release Payout" : "Hold Payout"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PLATFORM FEES CONFIGURATION */}
      {activeSubTab === "fees" && (
        <div className="space-y-6">
          <div className="p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#342A24]">
                  Platform Commission Rules
                </h2>
                <p className="text-xs text-[#7B6C60] mt-1">
                  Default platform fee is currently <strong className="text-[#C96F42] font-bold">{platformFeeConfig.defaultFeePercent}%</strong>.
                  Only company OWNER role administrators can update commission parameters.
                </p>
              </div>

              {adminUser?.role === "OWNER" && (
                <button
                  onClick={() => setIsFeeModalOpen(true)}
                  className="px-4 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs"
                >
                  Configure Fee Percentage
                </button>
              )}
            </div>

            <div className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#7B6C60]">Default Commission:</span>
                <p className="font-serif font-bold text-xl text-[#342A24]">{platformFeeConfig.defaultFeePercent}%</p>
              </div>
              <div>
                <span className="text-[#7B6C60]">Last Modified By:</span>
                <p className="font-semibold text-[#342A24]">{platformFeeConfig.lastUpdatedBy}</p>
              </div>
              <div>
                <span className="text-[#7B6C60]">Last Updated:</span>
                <p className="font-semibold text-[#342A24]">{new Date(platformFeeConfig.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURE FEE MODAL */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#342A24]">Configure Platform Commission Fee</h3>
              <button onClick={() => setIsFeeModalOpen(false)} className="p-1 text-[#7B6C60] hover:text-[#342A24]"><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateFeeSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#342A24]">New Commission Percentage (%)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  required
                  value={feePercent}
                  onChange={e => setFeePercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs font-bold text-[#342A24]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#342A24]">Justification / Reason for Fee Adjustment *</label>
                <input
                  type="text"
                  required
                  value={feeReason}
                  onChange={e => setFeeReason(e.target.value)}
                  placeholder="e.g. Q4 promotional commission reduction"
                  className="w-full px-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsFeeModalOpen(false)} className="w-1/2 py-2.5 rounded-[10px] border border-[#E8DCCB] text-xs font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 rounded-[10px] bg-[#C96F42] text-[#FFF9F2] text-xs font-bold shadow-warm-xs">Save Commission Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {selectedTxForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#342A24]">Issue Client Payment Refund</h3>
              <button onClick={() => setSelectedTxForRefund(null)} className="p-1 text-[#7B6C60] hover:text-[#342A24]"><X size={18} /></button>
            </div>

            <form onSubmit={handleConfirmRefund} className="space-y-4 text-xs">
              <div className="p-3 rounded-[10px] bg-[#F6F0E7]">
                <p className="font-bold text-[#342A24]">{selectedTxForRefund.id}</p>
                <p className="text-[11px] text-[#7B6C60]">Amount: ₹{selectedTxForRefund.totalAmount} · Client: {selectedTxForRefund.clientName}</p>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#342A24]">Refund Justification *</label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="e.g. Technical audio failure during consultation"
                  className="w-full px-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setSelectedTxForRefund(null)} className="w-1/2 py-2.5 rounded-[10px] border border-[#E8DCCB] text-xs font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 rounded-[10px] bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs">Execute Refund</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
