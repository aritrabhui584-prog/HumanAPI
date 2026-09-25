import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { FolderOpen, Plus, CheckCircle2, Clock, Calendar, X, ArrowRight } from "lucide-react";
import { Project } from "../../types";

export const UserProjectsView: React.FC = () => {
  const { projects, createProject, bookings, navigate, showNotification } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("React, Performance");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProject(
      title,
      description,
      tags.split(",").map(t => t.trim()).filter(Boolean)
    );

    setTitle("");
    setDescription("");
    setIsCreateModalOpen(false);
    showNotification("Project created successfully.", "success");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#74806B]">
            Workspace Organizer
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#332720]">
            My Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#75675C]">
            Cluster related 5/10/15-minute consultations, architectural notes, and specialist recommendations.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Create Project</span>
        </button>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(proj => {
          const linkedBookings = bookings.filter(b => proj.consultationIds.includes(b.id));

          return (
            <div
              key={proj.id}
              className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen size={18} className="text-[#C86B3C]" />
                    <h3 className="font-serif font-bold text-lg text-[#332720]">
                      {proj.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#718B68]/15 text-[#718B68] border border-[#718B68]/30 uppercase">
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-[#75675C] leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg bg-[#F7F1E7] border border-[#DED3C6] text-[10px] font-semibold text-[#75675C]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Linked Consultations list */}
                <div className="pt-2 border-t border-[#DED3C6]/60">
                  <span className="text-[11px] font-bold text-[#332720] block mb-1">
                    Linked Consultations ({linkedBookings.length}):
                  </span>
                  {linkedBookings.length === 0 ? (
                    <p className="text-[11px] text-[#75675C] italic">No consultations tied to this project yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {linkedBookings.map(lb => (
                        <div
                          key={lb.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#F7F1E7] text-xs text-[#332720]"
                        >
                          <span className="truncate">{lb.expertName} · {lb.duration}m</span>
                          <span className="text-[10px] text-[#718B68] font-semibold">{lb.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#DED3C6]/60 flex items-center justify-between text-xs">
                <span className="text-[#75675C]">Created {proj.createdAt}</span>
                <button
                  onClick={() => navigate("experts")}
                  className="font-bold text-[#C86B3C] hover:underline flex items-center gap-1"
                >
                  <span>Book Consultation for this Project</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create New Project */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#332720]/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] p-6 sm:p-8 space-y-4 shadow-warm-lg animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DED3C6] pb-3">
              <h3 className="font-serif font-bold text-xl text-[#332720]">
                Create New Project
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#75675C] hover:text-[#332720]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#332720] mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 Migrations"
                  className="w-full p-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] focus:outline-none focus:border-[#C86B3C]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#332720] mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Outline what you are building and why you need targeted expert consultations..."
                  className="w-full p-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] focus:outline-none focus:border-[#C86B3C]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#332720] mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. AI, RAG, Architecture"
                  className="w-full p-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] focus:outline-none focus:border-[#C86B3C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] font-bold text-xs shadow-warm-sm transition-all"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
