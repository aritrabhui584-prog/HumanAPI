import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Layers, CheckCircle2, Calendar, GitBranch, Figma, MessageSquare, ExternalLink } from "lucide-react";

export const UserIntegrationsView: React.FC = () => {
  const { showNotification } = useApp();

  const [connected, setConnected] = useState<{ [key: string]: boolean }>({
    gcal: true,
    github: true,
    figma: false,
    slack: false
  });

  const toggleIntegration = (id: string, name: string) => {
    setConnected(prev => {
      const next = !prev[id];
      showNotification(`${name} ${next ? "connected successfully" : "disconnected"}.`, "success");
      return { ...prev, [id]: next };
    });
  };

  const integrations = [
    {
      id: "gcal",
      name: "Google Calendar",
      desc: "Automatically sync consultation bookings and send calendar invitations with room links.",
      icon: Calendar,
      color: "text-[#C96F42]",
      bg: "bg-[#C96F42]/10"
    },
    {
      id: "github",
      name: "GitHub Repository Sync",
      desc: "Allows verified specialists to preview pull requests or issue tickets during the consultation.",
      icon: GitBranch,
      color: "text-[#342A24]",
      bg: "bg-[#342A24]/10"
    },
    {
      id: "figma",
      name: "Figma Live Frame Link",
      desc: "Import design canvases into the consultation suite for instant 10-minute design teardowns.",
      icon: Figma,
      color: "text-[#B85D3D]",
      bg: "bg-[#B85D3D]/10"
    },
    {
      id: "slack",
      name: "Slack Notifications",
      desc: "Receive 5-minute pre-call reminders and post-consultation action notes in your Slack workspace.",
      icon: MessageSquare,
      color: "text-[#77816C]",
      bg: "bg-[#77816C]/10"
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#77816C]">
          Ecosystem Connections
        </span>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          Connected Integrations
        </h1>
        <p className="text-xs sm:text-sm text-[#7B6C60]">
          Connect your calendar, version control, and team communication to automate invitation links and issue context.
        </p>
      </div>

      <div className="space-y-3">
        {integrations.map(item => {
          const Icon = item.icon;
          const isConn = connected[item.id];

          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#C96F42]/30"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-[14px] ${item.bg} ${item.color} flex items-center justify-center shrink-0 border border-[#E8DCCB]/60`}>
                  <Icon size={22} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-[#342A24]">
                      {item.name}
                    </h3>
                    {isConn && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#77816C] bg-[#77816C]/15 px-2 py-0.5 rounded-full border border-[#77816C]/30">
                        <CheckCircle2 size={11} /> Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7B6C60] leading-relaxed max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => toggleIntegration(item.id, item.name)}
                  className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all ${
                    isConn
                      ? "border border-[#E8DCCB] bg-[#F6F0E7] text-[#7B6C60] hover:text-[#B85D3D] hover:border-[#B85D3D]/30"
                      : "bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] shadow-warm-xs"
                  }`}
                >
                  {isConn ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
