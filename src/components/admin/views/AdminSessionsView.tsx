import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Search, Calendar, Clock, Video, CheckCircle2, DollarSign, AlertCircle } from "lucide-react";

export const AdminSessionsView: React.FC = () => {
  const { bookings } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.expertName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          Consultation Sessions Monitor
        </h1>
        <p className="text-xs text-[#7B6C60] mt-1">
          Inspect platform consultations, live WebRTC rooms, scheduled sprint sessions, and completion statuses.
        </p>
      </div>

      <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Session ID, Client, Expert, Topic..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
          />
        </div>
      </div>

      <div className="rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#342A24]">
            <thead className="bg-[#F6F0E7] border-b border-[#E8DCCB] text-[11px] font-bold text-[#7B6C60] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Expert</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Topic Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCCB]/60 font-sans">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-[#F6F0E7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#C96F42]">{b.id}</td>
                  <td className="py-3.5 px-4 font-semibold">{b.userName}</td>
                  <td className="py-3.5 px-4 font-semibold">{b.expertName}</td>
                  <td className="py-3.5 px-4">{b.duration} Mins</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#77816C]/15 text-[#77816C] capitalize">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold">₹{b.price}</td>
                  <td className="py-3.5 px-4 text-[#7B6C60] max-w-xs truncate">{b.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
