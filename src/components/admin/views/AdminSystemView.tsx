import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Layers, Activity, Tag, CheckCircle2, AlertTriangle, SlidersHorizontal, Plus } from "lucide-react";

export const AdminSystemView: React.FC = () => {
  const { featureFlags, toggleFeatureFlag, systemHealth } = useApp();

  const [categories, setCategories] = useState([
    { id: "cat-1", name: "Software Development", description: "Frontend, Backend, Mobile, Full-Stack Architecture", active: true, expertCount: 84 },
    { id: "cat-2", name: "System Architecture", description: "Distributed Systems, Microservices, Scalability", active: true, expertCount: 42 },
    { id: "cat-3", name: "AI & Machine Learning", description: "LLMs, Fine-tuning, RAG, PyTorch, Model Deployments", active: true, expertCount: 36 },
    { id: "cat-4", name: "UI/UX Design", description: "Product Design, Systems, Design Audits", active: true, expertCount: 29 },
    { id: "cat-5", name: "Cybersecurity", description: "Application Security, Vulnerability Audits", active: true, expertCount: 18 }
  ]);

  const toggleCategoryStatus = (id: string) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          System Controls, Categories & Feature Flags
        </h1>
        <p className="text-xs text-[#7B6C60] mt-1">
          Configure platform categories, operational feature toggles, and system-wide service availability.
        </p>
      </div>

      {/* Feature Flags Section */}
      <div className="p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#342A24]">High-Impact Feature Flags</h2>
            <p className="text-xs text-[#7B6C60]">Modifying feature flags affects platform registration, booking, and payout pathways live.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(featureFlags).map(([key, val]) => (
            <div key={key} className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-xs text-[#342A24]">{key}</p>
                <p className="text-[11px] text-[#7B6C60]">Status: {val ? "ENABLED" : "DISABLED"}</p>
              </div>

              <button
                onClick={() => toggleFeatureFlag(key)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all shadow-warm-xs ${
                  val ? "bg-[#77816C] text-[#FFF9F2]" : "bg-[#B85D3D] text-[#FFF9F2]"
                }`}
              >
                {val ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category Management */}
      <div className="p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#342A24]">Expertise Taxonomy & Categories</h2>
        </div>

        <div className="space-y-3">
          {categories.map(c => (
            <div key={c.id} className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="font-bold text-sm text-[#342A24]">{c.name}</h3>
                <p className="text-[#7B6C60]">{c.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-semibold text-[#7B6C60]">{c.expertCount} Experts</span>
                <button
                  onClick={() => toggleCategoryStatus(c.id)}
                  className={`px-3 py-1 rounded-[8px] text-[11px] font-bold ${
                    c.active ? "bg-[#77816C]/15 text-[#77816C]" : "bg-[#B85D3D]/15 text-[#B85D3D]"
                  }`}
                >
                  {c.active ? "Active" : "Deactivated"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
