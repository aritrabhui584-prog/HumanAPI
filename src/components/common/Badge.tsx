import React from "react";
import { Star, ShieldCheck, Zap, Award } from "lucide-react";

export const RatingStars: React.FC<{
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}> = ({ rating, count, size = "md", showValue = true }) => {
  const iconSize = size === "sm" ? 13 : size === "lg" ? 18 : 15;

  return (
    <div className="inline-flex items-center gap-1.5 font-medium">
      <div className="flex items-center text-[#C4934B]">
        {[1, 2, 3, 4, 5].map(star => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <Star
              key={star}
              size={iconSize}
              className={`${
                filled
                  ? "fill-[#C4934B] text-[#C4934B]"
                  : half
                  ? "fill-[#C4934B]/50 text-[#C4934B]"
                  : "text-[#DED3C6]"
              }`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="font-semibold text-[#332720] text-sm ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-[#75675C]">({count})</span>
      )}
    </div>
  );
};

export const VerificationBadge: React.FC<{
  label?: string;
  size?: "sm" | "md";
}> = ({ label = "Verified Expert", size = "md" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border border-[#74806B]/30 bg-[#74806B]/10 text-[#74806B] ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <ShieldCheck size={size === "sm" ? 12 : 14} className="text-[#74806B]" />
      {label}
    </span>
  );
};

export const QualityBadge: React.FC<{
  type: "top_rated" | "rapid" | "fellow" | "custom";
  text?: string;
}> = ({ type, text }) => {
  if (type === "top_rated") {
    return (
      <span className="inline-flex items-center gap-1 font-medium rounded-full border border-[#C4934B]/30 bg-[#C4934B]/10 text-[#8E631F] px-2 py-0.5 text-[11px]">
        <Award size={12} />
        Top Rated
      </span>
    );
  }
  if (type === "rapid") {
    return (
      <span className="inline-flex items-center gap-1 font-medium rounded-full border border-[#C86B3C]/30 bg-[#C86B3C]/10 text-[#B85C3B] px-2 py-0.5 text-[11px]">
        <Zap size={12} />
        Rapid Responder
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-medium rounded-full border border-[#DED3C6] bg-[#FFF9F0] text-[#75675C] px-2 py-0.5 text-[11px]">
      {text || "Verified"}
    </span>
  );
};
