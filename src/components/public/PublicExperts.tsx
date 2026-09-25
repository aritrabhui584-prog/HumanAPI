import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { CurrencySelector } from "../common/CurrencySelector";
import { useCurrency, AnimatedPrice } from "../../lib/currency";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Star,
  ArrowRight,
  X,
  Check,
  ChevronDown,
  Clock,
  Sparkles
} from "lucide-react";
import { CATEGORIES } from "../../data/mockData";

import { SpecialistsBrowseSkeleton } from "../loading";

export const PublicExperts: React.FC = () => {
  const { experts, navigate, openBookingModal, viewParams, isRefreshing } = useApp();
  const { currency, formatPrice } = useCurrency();

  if (isRefreshing) {
    return <SpecialistsBrowseSkeleton />;
  }

  const [searchQuery, setSearchQuery] = useState(viewParams?.searchQuery || "");
  const [selectedCategory, setSelectedCategory] = useState(viewParams?.category || "All Fields");
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  // Default max price cap in INR (1500 INR = ~$17.67)
  const [maxPrice10mINR, setMaxPrice10mINR] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price_asc" | "availability">("recommended");

  React.useEffect(() => {
    if (viewParams?.searchQuery !== undefined) {
      setSearchQuery(viewParams.searchQuery);
    }
    if (viewParams?.category !== undefined) {
      setSelectedCategory(viewParams.category);
    }
  }, [viewParams]);

  // Filtering & Sorting algorithm
  const filteredExperts = useMemo(() => {
    return experts
      .filter((exp) => {
        // Category check
        if (
          selectedCategory !== "All Fields" &&
          exp.category !== selectedCategory &&
          !exp.subcategories?.includes(selectedCategory)
        ) {
          return false;
        }
        // Search query (name, headline, bio, skills, category)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = exp.name.toLowerCase().includes(q);
          const matchesHeadline = exp.headline.toLowerCase().includes(q);
          const matchesBio = exp.bio.toLowerCase().includes(q);
          const matchesCategory = exp.category.toLowerCase().includes(q);
          const matchesSkills = exp.skills.some((s) => s.toLowerCase().includes(q));
          if (
            !matchesName &&
            !matchesHeadline &&
            !matchesBio &&
            !matchesCategory &&
            !matchesSkills
          ) {
            return false;
          }
        }
        // Rating check
        if (minRating > 0 && exp.rating < minRating) return false;
        // Availability check
        if (onlyAvailableToday && !exp.availableToday) return false;
        // Price check on 10 min session
        if (exp.pricing.duration10 > maxPrice10mINR) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price_asc") return a.pricing.duration10 - b.pricing.duration10;
        if (sortBy === "availability") {
          if (a.availableToday === b.availableToday) return b.rating - a.rating;
          return a.availableToday ? -1 : 1;
        }
        // Default: Recommended (based on completion & rating)
        return b.completedSessions * b.rating - a.completedSessions * a.rating;
      });
  }, [
    experts,
    searchQuery,
    selectedCategory,
    minRating,
    onlyAvailableToday,
    maxPrice10mINR,
    sortBy
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All Fields" ||
    minRating > 0 ||
    onlyAvailableToday ||
    maxPrice10mINR < 1500;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Fields");
    setMinRating(0);
    setOnlyAvailableToday(false);
    setMaxPrice10mINR(1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#F6F0E7] py-8 sm:py-10 font-sans text-[#342A24]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header with Currency Selector */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#342A24]">
              Find Experts
            </h1>
            <p className="text-sm text-[#7B6C60] mt-1 font-medium max-w-xl">
              Connect with verified experts for focused, one-to-one help.
            </p>
          </div>

          {/* Desktop Currency Selector Location */}
          <div className="hidden sm:block shrink-0 pt-0.5">
            <CurrencySelector showLabel={true} />
          </div>
        </div>

        {/* Discovery & Filter Toolbar */}
        <div className="bg-[#FFF9F2] rounded-[16px] border border-[#342A24]/10 p-4 sm:p-5 shadow-2xs space-y-4">
          {/* Main Search Row */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expertise... (e.g. React, System Design, UI/UX, Career, Python)"
                className="w-full pl-10 pr-9 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#342A24]/12 text-[13px] text-[#342A24] placeholder-[#7B6C60]/60 focus:outline-hidden focus:border-[#C96F42] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B6C60] hover:text-[#342A24] p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort & Mobile Controls Row */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end shrink-0">
              <div className="flex items-center gap-2 flex-1 md:flex-initial">
                <span className="text-[12px] font-medium text-[#7B6C60] whitespace-nowrap hidden sm:inline">
                  Sort
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto h-[38px] px-3 py-1.5 rounded-[10px] bg-[#F6F0E7] border border-[#342A24]/12 text-[13px] font-medium text-[#342A24] focus:outline-hidden focus:border-[#C96F42]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Rating</option>
                  <option value="price_asc">Price</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              {/* Mobile Currency Selector */}
              <div className="sm:hidden shrink-0">
                <CurrencySelector showLabel={false} />
              </div>
            </div>
          </div>

          {/* Category Chips Scroll Container */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium whitespace-nowrap transition-colors duration-150 ${
                    isSelected
                      ? "bg-[#C96F42] text-[#FFF9F2] font-semibold"
                      : "bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7]/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Compact Filter Options Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#342A24]/8 text-[12px]">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Availability Filter */}
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailableToday}
                  onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                  className="rounded-[4px] border-[#342A24]/20 text-[#C96F42] focus:ring-0 w-3.5 h-3.5 accent-[#C96F42]"
                />
                <span className="font-medium text-[#342A24]">Available Today</span>
              </label>

              {/* Rating Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[#7B6C60] font-medium mr-1">Rating:</span>
                {[0, 4.8, 4.9].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`px-2 py-0.5 rounded-[6px] text-[11px] font-medium transition-colors ${
                      minRating === r
                        ? "bg-[#C96F42]/12 text-[#C96F42] font-semibold border border-[#C96F42]/30"
                        : "text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7]"
                    }`}
                  >
                    {r === 0 ? "Any" : `${r}★+`}
                  </button>
                ))}
              </div>

              {/* Price Cap Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[#7B6C60] font-medium">Max 10m:</span>
                <span className="font-semibold text-[#342A24]">
                  {formatPrice(maxPrice10mINR)}
                </span>
                <input
                  type="range"
                  min={500}
                  max={1500}
                  step={50}
                  value={maxPrice10mINR}
                  onChange={(e) => setMaxPrice10mINR(Number(e.target.value))}
                  className="w-20 accent-[#C96F42] h-1 bg-[#F6F0E7] rounded-lg cursor-pointer"
                />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-medium text-[#C96F42] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="text-[12px] font-medium text-[#7B6C60]">
              Showing <span className="font-bold text-[#342A24]">{filteredExperts.length}</span> {filteredExperts.length === 1 ? "expert" : "experts"}
            </div>
          </div>
        </div>

        {/* Experts List Container (Marketplace Row Layout) */}
        {filteredExperts.length === 0 ? (
          <div className="bg-[#FFF9F2] rounded-[16px] border border-[#342A24]/10 p-10 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#C96F42]/10 text-[#C96F42] flex items-center justify-center mx-auto">
              <Search size={20} />
            </div>
            <h3 className="font-bold text-base text-[#342A24]">No matching experts found</h3>
            <p className="text-xs text-[#7B6C60] max-w-sm mx-auto">
              Try adjusting your category, search keyword, or clearing rating and price filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-3.5 py-1.5 rounded-[8px] bg-[#C96F42] text-[#FFF9F2] text-xs font-semibold hover:bg-[#B85D3D] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="bg-[#FFF9F2] rounded-[16px] border border-[#342A24]/10 p-4 sm:p-5 shadow-2xs hover:shadow-warm-xs transition-all duration-200 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                  {/* LEFT SECTION: Photo, Name, Verified, Title, Skills */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      onClick={() => navigate("expert-detail", { expertId: expert.id })}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-[12px] object-cover border border-[#342A24]/10 shrink-0 cursor-pointer group-hover:border-[#C96F42]/40 transition-colors"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          onClick={() => navigate("expert-detail", { expertId: expert.id })}
                          className="font-bold text-base sm:text-[17px] text-[#342A24] cursor-pointer hover:text-[#C96F42] transition-colors tracking-tight"
                        >
                          {expert.name}
                        </h3>
                        {expert.isVerified && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#77816C]/10 text-[#77816C] text-[11px] font-semibold">
                            <Check size={11} className="stroke-[2.5]" />
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="text-[13px] font-medium text-[#7B6C60] line-clamp-1 leading-snug">
                        {expert.headline}
                      </p>

                      {/* Expertise / Technology Tags */}
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        {expert.skills.slice(0, 5).map((skill, idx) => (
                          <React.Fragment key={skill}>
                            <span className="text-[12px] font-medium text-[#7B6C60]">
                              {skill}
                            </span>
                            {idx < Math.min(expert.skills.length, 5) - 1 && (
                              <span className="text-[#7B6C60]/40 text-[10px] select-none">·</span>
                            )}
                          </React.Fragment>
                        ))}
                        {expert.skills.length > 5 && (
                          <span className="text-[11px] text-[#7B6C60]/60 font-medium">
                            +{expert.skills.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT / CENTER SECTION: Rating, Experience, Price, CTA */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-[#342A24]/8 shrink-0">
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div>
                        <div className="flex items-center gap-1 text-[13px] font-bold text-[#342A24]">
                          <Star size={13} className="fill-[#C96F42] text-[#C96F42]" />
                          <span>{expert.rating.toFixed(1)}</span>
                          <span className="text-[#7B6C60] font-normal">({expert.reviewCount})</span>
                        </div>
                        <p className="text-[12px] text-[#7B6C60] font-medium mt-0.5 whitespace-nowrap">
                          {expert.experienceYears}+ years exp.
                        </p>
                      </div>

                      {/* Price Block with Smooth Motion Crossfade */}
                      <div className="text-right min-w-[85px]">
                        <div className="text-base sm:text-lg font-bold text-[#342A24] tracking-tight">
                          <AnimatedPrice amountInINR={expert.pricing.duration10} />
                        </div>
                        <p className="text-[11px] font-medium text-[#7B6C60] whitespace-nowrap">
                          per 10 min
                        </p>
                      </div>
                    </div>

                    {/* Book 10m CTA Button */}
                    <button
                      type="button"
                      onClick={() => openBookingModal(expert, 10)}
                      className="h-[40px] px-3.5 sm:px-4 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-[13px] font-semibold shadow-2xs transition-all duration-150 flex items-center justify-center gap-1.5 shrink-0 group/btn"
                    >
                      <span>Book 10m</span>
                      <ArrowRight size={14} className="transition-transform duration-150 group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
