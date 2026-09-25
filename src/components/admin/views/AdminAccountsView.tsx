import React from "react";
import { useApp } from "../../../context/AppContext";
import { Lock, ShieldCheck, UserCheck, Key, CheckCircle2 } from "lucide-react";

export const AdminAccountsView: React.FC = () => {
  const { adminUsers, adminUser } = useApp();

  const rolePermissionsMatrix = [
    { role: "OWNER", desc: "Full administrative control, platform fee configuration, owner management, permanent deletion", members: "Platform Owner" },
    { role: "ADMIN", desc: "System settings, feature flags, expert verification, user restrictions, moderation", members: "System Administrator" },
    { role: "FINANCE", desc: "Payment transaction ledgers, refund processing, expert payouts, fee monitoring", members: "Finance Manager" },
    { role: "MODERATOR", desc: "Dispute queue, user reports, ban enforcement, session review", members: "Moderation Lead" },
    { role: "SUPPORT", desc: "Client support cases, session metadata lookup, assistance ticket queue", members: "Support Specialist" }
  ];

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          Administrative Accounts & Permission Matrix
        </h1>
        <p className="text-xs text-[#7B6C60] mt-1">
          Internal administrative roster, Multi-Factor Authentication enforcement, and role-based access control (RBAC).
        </p>
      </div>

      {/* Roster */}
      <div className="rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8DCCB] bg-[#F6F0E7] flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#342A24]">Authorized Administrative Roster</h2>
          <span className="text-xs font-semibold text-[#7B6C60]">{adminUsers.length} Admin Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#342A24]">
            <thead className="bg-[#F6F0E7] border-b border-[#E8DCCB] text-[11px] font-bold text-[#7B6C60] uppercase">
              <tr>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">2FA / MFA</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCCB]/60 font-sans">
              {adminUsers.map(adm => (
                <tr key={adm.id} className="hover:bg-[#F6F0E7]/60 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <img src={adm.avatar} alt={adm.name} className="w-8 h-8 rounded-[8px] object-cover border border-[#E8DCCB]" />
                    <div>
                      <div className="font-bold text-[#342A24]">{adm.name}</div>
                      <div className="text-[11px] text-[#7B6C60]">{adm.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      adm.role === "OWNER" ? "bg-[#342A24] text-[#FFF9F2]" : "bg-[#C96F42]/15 text-[#C96F42]"
                    }`}>
                      {adm.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#77816C] flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    <span>Hardware MFA Active</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#7B6C60]">{adm.lastLogin}</td>
                  <td className="py-3.5 px-4 font-bold text-[#77816C] capitalize">{adm.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-4">
        <h2 className="font-serif font-bold text-lg text-[#342A24]">
          Role-Based Access Control (RBAC) Permissions Matrix
        </h2>
        <div className="space-y-3">
          {rolePermissionsMatrix.map(m => (
            <div key={m.role} className="p-3.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-mono font-bold text-[#C96F42] uppercase text-xs mr-2">[{m.role}]</span>
                <span className="text-[#342A24] font-semibold">{m.desc}</span>
              </div>
              <span className="text-[11px] text-[#7B6C60] font-mono shrink-0">Assigned: {m.members}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
