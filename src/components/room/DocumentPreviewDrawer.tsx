import React, { useState, useRef } from "react";
import {
  X,
  FileText,
  FileCode,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  FileCheck,
  Paperclip,
  Share2,
  Eye
} from "lucide-react";

export interface SharedDocument {
  id: string;
  name: string;
  size: string;
  type: "code" | "markdown" | "sql" | "image" | "pdf" | "json";
  uploadedBy: "Client" | "Expert";
  timestamp: string;
  content: string;
  description?: string;
  language?: string;
}

interface DocumentPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documents: SharedDocument[];
  onUploadDocument: (doc: SharedDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onShareToChat?: (text: string) => void;
  expertName: string;
}

export const DocumentPreviewDrawer: React.FC<DocumentPreviewDrawerProps> = ({
  isOpen,
  onClose,
  documents,
  onUploadDocument,
  onDeleteDocument,
  onShareToChat,
  expertName
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || "");
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterType, setFilterType] = useState<string>("all");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active document
  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  // Auto-sync active document if list changes
  React.useEffect(() => {
    if (documents.length > 0 && !documents.some(d => d.id === selectedDocId)) {
      setSelectedDocId(documents[0].id);
    }
  }, [documents, selectedDocId]);

  if (!isOpen) return null;

  const handleCopyContent = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (doc: SharedDocument) => {
    const element = document.createElement("a");
    const file = new Blob([doc.content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    let type: SharedDocument["type"] = "code";

    if (["jpg", "jpeg", "png", "svg", "webp", "gif"].includes(ext)) {
      type = "image";
      reader.readAsDataURL(file);
    } else if (ext === "md" || ext === "markdown") {
      type = "markdown";
      reader.readAsText(file);
    } else if (ext === "sql") {
      type = "sql";
      reader.readAsText(file);
    } else if (ext === "json") {
      type = "json";
      reader.readAsText(file);
    } else if (ext === "pdf") {
      type = "pdf";
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }

    reader.onload = () => {
      const content = reader.result as string;
      const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1048576).toFixed(1) + " MB";
      };

      const newDoc: SharedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: formatBytes(file.size),
        type,
        uploadedBy: "Client",
        timestamp: "Just now",
        content: content || "// Empty file",
        description: `Uploaded document during consultation session`,
        language: ext || "plaintext"
      };

      onUploadDocument(newDoc);
      setSelectedDocId(newDoc.id);

      if (onShareToChat) {
        onShareToChat(`Shared document: 📎 ${newDoc.name} (${newDoc.size})`);
      }
    };
  };

  const filteredDocs = documents.filter(d => {
    if (filterType === "all") return true;
    if (filterType === "code") return d.type === "code" || d.type === "sql" || d.type === "json";
    if (filterType === "visual") return d.type === "image";
    if (filterType === "docs") return d.type === "markdown" || d.type === "pdf";
    return true;
  });

  const getDocIcon = (type: SharedDocument["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon size={16} className="text-[#C4934B]" />;
      case "sql":
      case "code":
        return <FileCode size={16} className="text-[#718B68]" />;
      case "json":
        return <FileCode size={16} className="text-[#C86B3C]" />;
      default:
        return <FileText size={16} className="text-[#A45338]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#17100D]/70 backdrop-blur-sm animate-in fade-in duration-200"
      id="document-preview-drawer"
      role="dialog"
      aria-label="Shared Documents Drawer"
    >
      <div
        className="w-full max-w-4xl h-full bg-[#FFFDF9] border-l border-[#DED3C6] shadow-warm-xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#DED3C6] bg-[#FFF9F0] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C86B3C]/15 border border-[#C86B3C]/30 text-[#C86B3C] flex items-center justify-center shrink-0">
              <Share2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332720]">
                  Shared Session Materials
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#718B68]/15 border border-[#718B68]/30 text-[11px] font-bold text-[#718B68]">
                  {documents.length} Files
                </span>
              </div>
              <p className="text-xs text-[#75675C]">
                Collaborative document and code viewer between you and <span className="font-semibold text-[#332720]">{expertName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] text-xs font-bold shadow-warm-xs transition-all flex items-center gap-1.5"
              id="drawer-upload-btn"
            >
              <Upload size={14} />
              <span className="hidden sm:inline">Upload New</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.md,.json,.sql,.js,.ts,.tsx,.jsx,.html,.css,.py,.svg,.png,.jpg,.jpeg"
            />

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#F7F1E7] hover:bg-[#EBE2D5] border border-[#DED3C6] flex items-center justify-center text-[#75675C] hover:text-[#332720] transition-colors"
              aria-label="Close document drawer"
              id="close-document-drawer-btn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Body: Two-Pane Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Document File List */}
          <div className="w-full md:w-72 lg:w-80 border-r border-[#DED3C6] bg-[#F7F1E7]/70 flex flex-col shrink-0">
            {/* Filter Tabs */}
            <div className="p-3 border-b border-[#DED3C6] flex items-center gap-1 bg-[#FFF9F0]">
              {[
                { id: "all", label: "All" },
                { id: "code", label: "Code & SQL" },
                { id: "visual", label: "Visuals" },
                { id: "docs", label: "Docs" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterType === tab.id
                      ? "bg-[#332720] text-[#FFF9F0] shadow-warm-xs"
                      : "text-[#75675C] hover:bg-[#EBE2D5]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Document Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-8 text-[#75675C] text-xs">
                  No materials match this category.
                </div>
              ) : (
                filteredDocs.map(doc => {
                  const isSelected = doc.id === activeDoc?.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setZoomLevel(1);
                      }}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all relative group ${
                        isSelected
                          ? "bg-[#FFFDF9] border-[#C86B3C] shadow-warm-sm ring-1 ring-[#C86B3C]/30"
                          : "bg-[#FFF9F0] hover:bg-[#FFFDF9] border-[#DED3C6]"
                      }`}
                      id={`doc-item-${doc.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 overflow-hidden">
                          <div className="p-2 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] shrink-0 mt-0.5">
                            {getDocIcon(doc.type)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#332720] truncate">
                              {doc.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-[#75675C] mt-0.5">
                              <span>{doc.size}</span>
                              <span>·</span>
                              <span className={doc.uploadedBy === "Expert" ? "text-[#C86B3C] font-semibold" : "text-[#718B68] font-semibold"}>
                                {doc.uploadedBy}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleDownload(doc);
                            }}
                            className="p-1 rounded-lg hover:bg-[#F7F1E7] text-[#75675C] hover:text-[#332720]"
                            title="Download"
                          >
                            <Download size={13} />
                          </button>
                          {doc.uploadedBy === "Client" && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onDeleteDocument(doc.id);
                              }}
                              className="p-1 rounded-lg hover:bg-[#B85C3B]/15 text-[#B85C3B]"
                              title="Remove"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Upload Drop Zone */}
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-[#C86B3C] bg-[#C86B3C]/5"
                    : "border-[#DED3C6] hover:border-[#C86B3C] bg-[#FFF9F0]/60"
                }`}
              >
                <Upload size={20} className="mx-auto text-[#75675C] mb-1.5" />
                <p className="text-xs font-bold text-[#332720]">Drop file here to share</p>
                <p className="text-[10px] text-[#75675C] mt-0.5">Code, logs, diagrams, or markdown</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Active Document Preview Area */}
          <div className="flex-1 flex flex-col bg-[#FFFDF9] overflow-hidden">
            {activeDoc ? (
              <>
                {/* Active Document Header */}
                <div className="p-3.5 sm:p-4 border-b border-[#DED3C6] bg-[#FFFDF9] flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-1.5 rounded-lg bg-[#F7F1E7] border border-[#DED3C6]">
                      {getDocIcon(activeDoc.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#332720] truncate">
                          {activeDoc.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#F7F1E7] text-[10px] font-medium text-[#75675C] uppercase tracking-wider">
                          {activeDoc.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#75675C]">
                        Shared by <strong className="text-[#332720]">{activeDoc.uploadedBy}</strong> at {activeDoc.timestamp} · {activeDoc.size}
                      </p>
                    </div>
                  </div>

                  {/* Top Right Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Zoom controls for visuals */}
                    {activeDoc.type === "image" && (
                      <div className="flex items-center gap-1 bg-[#F7F1E7] p-1 rounded-xl border border-[#DED3C6] mr-1">
                        <button
                          onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                          className="p-1 rounded text-[#75675C] hover:text-[#332720]"
                          title="Zoom Out"
                        >
                          <ZoomOut size={14} />
                        </button>
                        <span className="text-[10px] font-mono font-bold px-1 text-[#332720]">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                          onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                          className="p-1 rounded text-[#75675C] hover:text-[#332720]"
                          title="Zoom In"
                        >
                          <ZoomIn size={14} />
                        </button>
                        <button
                          onClick={() => setZoomLevel(1)}
                          className="p-1 rounded text-[#75675C] hover:text-[#332720]"
                          title="Reset"
                        >
                          <RotateCcw size={13} />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={handleCopyContent}
                      className="px-2.5 py-1.5 rounded-xl bg-[#F7F1E7] hover:bg-[#EBE2D5] border border-[#DED3C6] text-xs font-semibold text-[#332720] flex items-center gap-1.5 transition-colors"
                      title="Copy content"
                      id="copy-doc-content-btn"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-[#718B68]" />
                          <span className="text-[#718B68]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload(activeDoc)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#F7F1E7] hover:bg-[#EBE2D5] border border-[#DED3C6] text-xs font-semibold text-[#332720] flex items-center gap-1.5 transition-colors"
                      title="Download file"
                      id="download-active-doc-btn"
                    >
                      <Download size={13} />
                      <span className="hidden sm:inline">Download</span>
                    </button>

                    {onShareToChat && (
                      <button
                        onClick={() =>
                          onShareToChat(`Let's review lines in 📄 ${activeDoc.name}`)
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-[#C86B3C]/15 hover:bg-[#C86B3C]/25 text-[#C86B3C] text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Reference in Session Chat"
                      >
                        <MessageSquare size={13} />
                        <span className="hidden sm:inline">Discuss in Chat</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Preview Content Renderer */}
                <div className="flex-1 overflow-auto p-4 bg-[#201712]">
                  {activeDoc.type === "image" ? (
                    /* Visual / SVG / Diagram Renderer */
                    <div className="w-full h-full min-h-[360px] flex items-center justify-center p-4 bg-[#17100D] rounded-2xl overflow-auto border border-[#DED3C6]/20">
                      {activeDoc.content.startsWith("<svg") ? (
                        <div
                          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
                          className="transition-transform duration-150 max-w-full"
                          dangerouslySetInnerHTML={{ __html: activeDoc.content }}
                        />
                      ) : (
                        <img
                          src={activeDoc.content}
                          alt={activeDoc.name}
                          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
                          className="max-h-full object-contain transition-transform duration-150 rounded-xl"
                        />
                      )}
                    </div>
                  ) : activeDoc.type === "markdown" ? (
                    /* Formatted Markdown Reader */
                    <div className="p-6 rounded-2xl bg-[#FFFDF9] text-[#332720] border border-[#DED3C6] shadow-warm-xs max-w-3xl mx-auto space-y-4 font-sans text-xs leading-relaxed">
                      <div className="border-b border-[#DED3C6] pb-3">
                        <h3 className="font-serif text-lg font-bold text-[#332720]">
                          {activeDoc.name}
                        </h3>
                        <p className="text-[11px] text-[#75675C]">
                          Consultation Working Document
                        </p>
                      </div>
                      <div className="whitespace-pre-wrap font-mono text-xs text-[#48372E] bg-[#F7F1E7] p-4 rounded-xl border border-[#DED3C6]">
                        {activeDoc.content}
                      </div>
                    </div>
                  ) : (
                    /* Code / SQL / JSON / Text Viewer with Line Numbers */
                    <div className="rounded-2xl bg-[#17100D] border border-[#DED3C6]/15 font-mono text-xs overflow-x-auto shadow-warm-md">
                      <div className="px-4 py-2 bg-[#261B15] border-b border-[#DED3C6]/15 flex items-center justify-between text-[11px] text-[#DED3C6]">
                        <span className="text-[#C4934B]">{activeDoc.language || activeDoc.type}</span>
                        <span>{activeDoc.content.split("\n").length} lines</span>
                      </div>
                      <div className="p-4 flex text-xs leading-relaxed">
                        {/* Line numbers */}
                        <div className="pr-4 mr-4 border-r border-[#DED3C6]/20 text-[#75675C] select-none text-right font-mono">
                          {activeDoc.content.split("\n").map((_, i) => (
                            <div key={i}>{i + 1}</div>
                          ))}
                        </div>
                        {/* Code body */}
                        <pre className="text-[#EADCCF] overflow-x-auto whitespace-pre font-mono flex-1">
                          <code>{activeDoc.content}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#75675C]">
                <FileText size={40} className="text-[#DED3C6] mb-3" />
                <h4 className="font-serif text-base font-bold text-[#332720]">
                  No document selected
                </h4>
                <p className="text-xs max-w-sm mt-1">
                  Select a document from the left panel or click "Upload New" to share materials with your specialist.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Notice */}
        <div className="p-3 bg-[#FFF9F0] border-t border-[#DED3C6] px-5 flex items-center justify-between text-[11px] text-[#75675C] shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#C86B3C]" />
            Documents are encrypted in transit and purged following consultation conclusion unless saved to Workspace Projects.
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#C86B3C] hover:underline"
          >
            Done viewing
          </button>
        </div>
      </div>
    </div>
  );
};
