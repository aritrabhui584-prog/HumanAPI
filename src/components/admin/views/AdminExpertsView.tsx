import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Search, ShieldCheck, CheckCircle2, Star, Award, Clock, DollarSign, X } from "lucide-react";

export const AdminExpertsView: React.FC = () => {
  const { experts, toggleExpertVerification, approveExpertApplication, rejectExpertApplication, application } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExperts = experts.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          Expert Practitioner Directory & Accreditation
        </h1>
        <p className="text-xs text-[#7B6C60] mt-1">
          Manage verified practitioner profiles, category accreditations, verification badges, and applications.
        </p>
      </div>

      {/* Pending Application Banner if submitted */}
      {application && application.status !== "approved" && (
        <div className="p-5 rounded-[20px] bg-[#FFF9F2] border border-[#C96F42]/30 shadow-warm-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#C96F42]">
              <Award size={18} />
              <span className="font-serif font-bold text-base text-[#342A24]">Pending Practitioner Application</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C96F42]/10 text-[#C96F42] uppercase">
              {application.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div><span className="text-[#7B6C60]">Applicant:</span> <strong className="font-semibold">{application.fullName}</strong></div>
            <div><span className="text-[#7B6C60]">Domain:</span> <strong className="font-semibold">{application.field}</strong></div>
            <div><span className="text-[#7B6C60]">Experience:</span> <strong className="font-semibold">{application.experienceYears} Years</strong></div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => approveExpertApplication(application.id)}
              className="px-3.5 py-1.5 rounded-[9px] bg-[#77816C] hover:bg-[#66705B] text-[#FFF9F2] text-xs font-bold"
            >
              Approve Practitioner Accreditation
            </button>
            <button
              onClick={() => rejectExpertApplication(application.id, "Credentials require secondary verification")}
              className="px-3.5 py-1.5 rounded-[9px] border border-[#E8DCCB] text-[#B85D3D] text-xs font-bold"
            >
              Request Additional Proof
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search experts by name, skill, category..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
          />
        </div>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExperts.map(exp => (
          <div key={exp.id} className="p-5 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={exp.avatar}
                  alt={exp.name}
                  className="w-12 h-12 rounded-[12px] object-cover border border-[#E8DCCB]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-[#342A24]">{exp.name}</h3>
                    {exp.isVerified && <ShieldCheck size={16} className="text-[#77816C]" />}
                  </div>
                  <p className="text-xs text-[#7B6C60] line-clamp-1">{exp.headline}</p>
                </div>
              </div>

              <button
                onClick={() => toggleExpertVerification(exp.id)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all ${
                  exp.isVerified
                    ? "bg-[#77816C]/15 text-[#77816C] border border-[#77816C]/30"
                    : "bg-[#C96F42] text-[#FFF9F2]"
                }`}
              >
                {exp.isVerified ? "Verified Practitioner" : "Verify Badge"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-[12px] bg-[#F6F0E7] text-center text-xs">
              <div>
                <p className="text-[10px] text-[#7B6C60]">Rating</p>
                <p className="font-bold text-[#342A24]">★ {exp.rating}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7B6C60]">Sessions</p>
                <p className="font-bold text-[#342A24]">{exp.completedSessions}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7B6C60]">10m Rate</p>
                <p className="font-bold text-[#342A24]">₹{exp.pricing.duration10}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E8DCCB]/60">
              <span className="text-[#7B6C60]">Category: <strong className="text-[#342A24] font-semibold">{exp.category}</strong></span>
              <span className="text-[#77816C] font-semibold">Reputation Score: {exp.discoverabilityScore}/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
