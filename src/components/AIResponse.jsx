import { useEffect } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";

/**
 * AIResponse
 * Floating overlay that shows Claude's text responses (explain / formula).
 * Disappears automatically after 8s, or when user taps X.
 */
export function AIResponse({ response, isThinking, dark, onDismiss }) {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!response) return;
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [response, onDismiss]);

  if (!isThinking && !response) return null;

  const bg = dark
    ? "bg-[#2c2c2e]/90 border-[#3a3a3c] text-white"
    : "bg-white/90 border-gray-200 text-[#1c1c1e]";

  const label =
    response?.action === "explain"
      ? "Explanation"
      : response?.action === "formula"
      ? "Formula"
      : response?.action === "calculate"
      ? "Calculating…"
      : "";

  return (
    <div
      className={`
        fixed bottom-28 right-6 z-[9998]
        w-72 rounded-2xl border backdrop-blur-md shadow-2xl
        p-4 flex flex-col gap-2
        transition-all duration-300 animate-in fade-in slide-in-from-bottom-4
        ${bg}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#e2adcb]">
          <Sparkles size={13} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            {isThinking ? "Thinking…" : label}
          </span>
        </div>
        {!isThinking && (
          <button
            onClick={onDismiss}
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Body */}
      {isThinking ? (
        <div className="flex items-center gap-2 text-sm opacity-60">
          <Loader2 size={14} className="animate-spin" />
          Processing your request…
        </div>
      ) : (
        <p className="text-sm leading-relaxed opacity-90">{response?.text}</p>
      )}

      {/* Auto-dismiss bar */}
      {!isThinking && (
        <div className="h-0.5 rounded-full bg-[#e2adcb]/20 overflow-hidden mt-1">
          <div
            className="h-full bg-[#e2adcb] rounded-full"
            style={{ animation: "shrink 8s linear forwards" }}
          />
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); } to { transform: translateY(0); } }
        .animate-in { animation: fade-in 0.2s ease, slide-in-from-bottom-4 0.2s ease; }
      `}</style>
    </div>
  );
}
