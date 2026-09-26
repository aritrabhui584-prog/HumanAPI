import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Layers, CheckCircle2, Calendar, GitBranch, Figma, MessageSquare, Key, ShieldCheck, X } from "lucide-react";

export const UserIntegrationsView: React.FC = () => {
  const { showNotification } = useApp();

  const [connected, setConnected] = useState<{ [key: string]: boolean }>({
    gcal: true,
    github: true,
    figma: false,
    slack: false
  });

  const [configs, setConfigs] = useState<{ [key: string]: string }>({
    gcal: "gcal_oauth_8921.apps.googleusercontent.com",
    github: "aritrabhui584-prog/HumanAPI",
    figma: "",
    slack: ""
  });

  const [configModalIntegration, setConfigModalIntegration] = useState<string | null>(null);
  const [modalKeyInput, setModalKeyInput] = useState("");

  useEffect(() => {
    async function fetchIntegrations() {
      try {
        const res = await fetch("/api/integrations");
        if (res.ok) {
          const data = await res.json();
          if (data?.integrations) {
            const statusMap: { [key: string]: boolean } = {};
            const configMap: { [key: string]: string } = {};
            Object.keys(data.integrations).forEach(key => {
              statusMap[key] = Boolean(data.integrations[key].connected);
              configMap[key] = data.integrations[key].config?.key || data.integrations[key].config?.clientId || data.integrations[key].config?.repoSync || "";
            });
            setConnected(prev => ({ ...prev, ...statusMap }));
            setConfigs(prev => ({ ...prev, ...configMap }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch server integration status:", err);
      }
    }
    fetchIntegrations();
  }, []);

  const toggleIntegration = async (id: string, name: string) => {
    const nextStatus = !connected[id];
    setConnected(prev => ({ ...prev, [id]: nextStatus }));

    try {
      await fetch("/api/integrations/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId: id, connect: nextStatus })
      });
      showNotification(`${name} ${nextStatus ? "connected & synchronized" : "disconnected"}.`, "success");
    } catch (err) {
      showNotification(`Toggled ${name} locally.`, "info");
    }
  };

  const handleSaveConfig = async () => {
    if (!configModalIntegration) return;
    const id = configModalIntegration;
    setConfigs(prev => ({ ...prev, [id]: modalKeyInput }));
    setConnected(prev => ({ ...prev, [id]: true }));

    try {
      await fetch("/api/integrations/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId: id, config: { key: modalKeyInput } })
      });
      showNotification(`Updated API configuration for ${id.toUpperCase()}`, "success");
    } catch (err) {
      showNotification("Saved configuration locally.", "info");
    }

    setConfigModalIntegration(null);
    setModalKeyInput("");
  };

  const integrations = [
    {
      id: "gcal",
      name: "Google Calendar",
      desc: "Automatically sync consultation bookings and send calendar invitations with room links.",
      icon: Calendar,
      color: "text-[#C96F42]",
      bg: "bg-[#C96F42]/10",
      envVar: "GOOGLE_CALENDAR_CLIENT_ID",
      placeholder: "e.g. 1029384756-abc123xyz.apps.googleusercontent.com"
    },
    {
      id: "github",
      name: "GitHub Repository Sync",
      desc: "Allows verified specialists to preview pull requests or issue tickets during the consultation.",
      icon: GitBranch,
      color: "text-[#342A24]",
      bg: "bg-[#342A24]/10",
      envVar: "GITHUB_CLIENT_ID / Personal Access Token",
      placeholder: "e.g. ghp_9812739182379128391"
    },
    {
      id: "figma",
      name: "Figma Live Frame Link",
      desc: "Import design canvases into the consultation suite for instant 10-minute design teardowns.",
      icon: Figma,
      color: "text-[#B85D3D]",
      bg: "bg-[#B85D3D]/10",
      envVar: "FIGMA_ACCESS_TOKEN",
      placeholder: "e.g. figd_90812390182390"
    },
    {
      id: "slack",
      name: "Slack Notifications",
      desc: "Receive 5-minute pre-call reminders and post-consultation action notes in your Slack workspace.",
      icon: MessageSquare,
      color: "text-[#77816C]",
      bg: "bg-[#77816C]/10",
      envVar: "SLACK_WEBHOOK_URL",
      placeholder: "e.g. https://hooks.slack.com/services/T00/B00/XXXX"
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
          Connected Integrations & Server Webhooks
        </h1>
        <p className="text-xs sm:text-sm text-[#7B6C60]">
          Connect your calendar, version control, and team communication servers to automate invitation links and issue context.
        </p>
      </div>

      <div className="space-y-3">
        {integrations.map(item => {
          const Icon = item.icon;
          const isConn = connected[item.id];
          const hasConfig = Boolean(configs[item.id]);

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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-base text-[#342A24]">
                      {item.name}
                    </h3>
                    {isConn && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#77816C] bg-[#77816C]/15 px-2 py-0.5 rounded-full border border-[#77816C]/30">
                        <CheckCircle2 size={11} /> Active Webhook Server
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7B6C60] leading-relaxed max-w-xl">
                    {item.desc}
                  </p>
                  {hasConfig && (
                    <p className="text-[11px] font-mono text-[#C96F42] pt-0.5 truncate max-w-md">
                      Key/Ref: {configs[item.id]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => {
                    setConfigModalIntegration(item.id);
                    setModalKeyInput(configs[item.id] || "");
                  }}
                  className="px-3 py-2 rounded-[10px] border border-[#E8DCCB] bg-[#FFF9F2] text-xs font-semibold text-[#342A24] hover:border-[#C96F42] transition-colors flex items-center gap-1.5"
                >
                  <Key size={13} className="text-[#C96F42]" />
                  <span>Configure API</span>
                </button>

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

      {/* Configuration Modal */}
      {configModalIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1714]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DCCB]/60">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#342A24]">
                <ShieldCheck size={20} className="text-[#C96F42]" />
                <span>Configure {configModalIntegration.toUpperCase()} API</span>
              </div>
              <button
                onClick={() => setConfigModalIntegration(null)}
                className="p-1 rounded-full text-[#7B6C60] hover:bg-[#F6F0E7]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#7B6C60] leading-relaxed">
              Enter your credential or Webhook URL. You can also paste this into your project's <code className="bg-[#F6F0E7] px-1 py-0.5 rounded text-[#342A24] font-mono">.env.local</code> file.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#342A24]">API Key / Webhook Token</label>
              <input
                type="text"
                value={modalKeyInput}
                onChange={e => setModalKeyInput(e.target.value)}
                placeholder={integrations.find(i => i.id === configModalIntegration)?.placeholder || "Enter API Key..."}
                className="w-full px-3 py-2.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] font-mono focus:outline-none focus:border-[#C96F42]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setConfigModalIntegration(null)}
                className="px-4 py-2 rounded-[10px] border border-[#E8DCCB] text-xs font-semibold text-[#7B6C60]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
