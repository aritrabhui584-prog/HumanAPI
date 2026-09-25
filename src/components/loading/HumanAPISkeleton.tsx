import React from "react";
import "./loading.css";

export type SkeletonVariant =
  | "text"
  | "heading"
  | "avatar"
  | "card"
  | "button"
  | "input"
  | "table-row"
  | "metric"
  | "profile"
  | "list-item";

export interface HumanAPISkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string;
  height?: string;
  count?: number;
}

export const HumanAPISkeleton: React.FC<HumanAPISkeletonProps> = ({
  variant = "text",
  className = "",
  width,
  height,
  count = 1
}) => {
  const getVariantStyles = (): string => {
    switch (variant) {
      case "heading":
        return "h-7 sm:h-8 w-3/4 rounded-[8px]";
      case "avatar":
        return "w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] shrink-0";
      case "card":
        return "w-full h-36 sm:h-44 rounded-[20px]";
      case "button":
        return "w-28 sm:w-36 h-10 rounded-[11px]";
      case "input":
        return "w-full h-11 rounded-[11px]";
      case "table-row":
        return "w-full h-12 rounded-[10px]";
      case "metric":
        return "w-full h-28 rounded-[18px]";
      case "profile":
        return "w-full h-48 rounded-[24px]";
      case "list-item":
        return "w-full h-16 rounded-[14px]";
      case "text":
      default:
        return "h-4 w-full rounded-[6px]";
    }
  };

  const renderSingle = (key: number) => (
    <div
      key={key}
      role="status"
      aria-busy="true"
      style={{ width, height }}
      className={`humanapi-skeleton-pulse rounded-[10px] ${getVariantStyles()} ${className}`}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-2.5 w-full">
        {Array.from({ length: count }).map((_, i) => renderSingle(i))}
      </div>
    );
  }

  return renderSingle(0);
};

/* ====================================================================
 * COMPONENT-MATCHING SKELETON LAYOUTS
 * Match exact card & grid geometries to prevent layout shifting
 * ==================================================================== */

/** 1. Client Dashboard Overview Skeleton */
export const ClientOverviewSkeleton: React.FC = () => (
  <div className="space-y-6 w-full animate-in fade-in duration-200">
    {/* Welcome Header */}
    <div className="p-6 rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] space-y-3">
      <HumanAPISkeleton variant="heading" width="40%" />
      <HumanAPISkeleton variant="text" width="65%" />
    </div>

    {/* Metric Cards Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <HumanAPISkeleton variant="metric" count={1} />
      <HumanAPISkeleton variant="metric" count={1} />
      <HumanAPISkeleton variant="metric" count={1} />
      <HumanAPISkeleton variant="metric" count={1} />
    </div>

    {/* Main Grid: Active Booking & Quick Ask */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <HumanAPISkeleton variant="card" height="180px" />
        <HumanAPISkeleton variant="card" height="220px" />
      </div>
      <div className="space-y-4">
        <HumanAPISkeleton variant="card" height="300px" />
      </div>
    </div>
  </div>
);

/** 2. Expert Workspace Overview Skeleton */
export const ExpertOverviewSkeleton: React.FC = () => (
  <div className="space-y-6 w-full animate-in fade-in duration-200">
    {/* Header */}
    <div className="flex justify-between items-center">
      <HumanAPISkeleton variant="heading" width="30%" />
      <HumanAPISkeleton variant="button" />
    </div>

    {/* Metric Cards Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <HumanAPISkeleton variant="metric" count={1} />
      <HumanAPISkeleton variant="metric" count={1} />
      <HumanAPISkeleton variant="metric" count={1} />
      <HumanAPISkeleton variant="metric" count={1} />
    </div>

    {/* Active Session & Requests */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <HumanAPISkeleton variant="card" height="240px" />
        <HumanAPISkeleton variant="card" height="200px" />
      </div>
      <div className="space-y-4">
        <HumanAPISkeleton variant="card" height="340px" />
      </div>
    </div>
  </div>
);

/** 3. Specialists Browse Grid Skeleton */
export const SpecialistsBrowseSkeleton: React.FC = () => (
  <div className="space-y-6 w-full animate-in fade-in duration-200">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <HumanAPISkeleton variant="heading" width="35%" />
      <HumanAPISkeleton variant="input" width="260px" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <HumanAPISkeleton variant="card" height="280px" />
      <HumanAPISkeleton variant="card" height="280px" />
      <HumanAPISkeleton variant="card" height="280px" />
      <HumanAPISkeleton variant="card" height="280px" />
      <HumanAPISkeleton variant="card" height="280px" />
      <HumanAPISkeleton variant="card" height="280px" />
    </div>
  </div>
);

/** 4. Session History List Skeleton */
export const SessionHistorySkeleton: React.FC = () => (
  <div className="space-y-4 w-full animate-in fade-in duration-200">
    <HumanAPISkeleton variant="heading" width="25%" className="mb-4" />
    <HumanAPISkeleton variant="list-item" count={4} />
  </div>
);

/** 5. Admin Data Table Skeleton */
export const AdminTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => (
  <div className="space-y-3 w-full bg-[#FFF9F2] p-5 rounded-[20px] border border-[#E8DCCB] animate-in fade-in duration-200">
    <div className="flex justify-between items-center mb-4">
      <HumanAPISkeleton variant="heading" width="25%" />
      <HumanAPISkeleton variant="button" />
    </div>
    <div className="space-y-2">
      <HumanAPISkeleton variant="table-row" className="bg-[#E8DCCB]/60" />
      {Array.from({ length: rows }).map((_, i) => (
        <HumanAPISkeleton key={i} variant="table-row" />
      ))}
    </div>
  </div>
);

export default HumanAPISkeleton;
