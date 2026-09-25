import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface AssessmentTimerProps {
  expiresAt: string;
  onTimeExpired?: () => void;
  className?: string;
}

export const AssessmentTimer: React.FC<AssessmentTimerProps> = ({
  expiresAt,
  onTimeExpired,
  className = ""
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expiry - now) / 1000));
  });

  useEffect(() => {
    const expiry = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setSecondsLeft(diff);

      if (diff <= 0) {
        clearInterval(interval);
        if (onTimeExpired) {
          onTimeExpired();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onTimeExpired]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const isUrgent = secondsLeft <= 120 && secondsLeft > 0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.2 rounded-full border text-xs font-timer font-semibold tracking-tight transition-colors ${
        isUrgent
          ? "bg-[#B85D3D]/10 border-[#B85D3D]/40 text-[#B85D3D]"
          : "bg-[#FFF9F2] border-[#E8DCCB] text-[#342A24]"
      } ${className}`}
      aria-label={`Time remaining in assessment: ${minutes} minutes ${seconds} seconds`}
      title="Assessment Timer"
    >
      <Clock size={13} className={isUrgent ? "text-[#B85D3D]" : "text-[#7B6C60]"} />
      <span>{timeString} remaining</span>
    </div>
  );
};
