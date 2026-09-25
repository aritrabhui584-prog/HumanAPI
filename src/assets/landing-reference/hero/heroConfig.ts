/**
 * HUMANAPI HERO ASSET CONFIGURATION
 *
 * To replace the hero artwork when you provide the final visual asset:
 * 1. Drop your file (e.g. hero-visual.png, .webp, .jpg, or .mp4) in this folder.
 * 2. Update `src` below to your file path.
 * 3. Adjust `objectFit` and `objectPosition` if desired.
 *
 * The <HeroVisual /> component automatically updates across all screen sizes.
 */

import placeholderUrl from "./hero-placeholder.svg";

export interface HeroVisualAssetConfig {
  type: "image" | "video" | "hls" | "custom";
  src: string;
  poster?: string;
  alt: string;
  objectFit: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition: string;
  aspectRatio?: string; // e.g. "16 / 9" or "21 / 9"
  opacity?: number;
}

export const HERO_ASSET_CONFIG: HeroVisualAssetConfig = {
  type: "image",
  src: placeholderUrl,
  alt: "HumanAPI - Verified Human Expert Consultations Architectural Environment",
  objectFit: "cover",
  objectPosition: "center 48%",
  aspectRatio: "16 / 9",
  opacity: 0.95
};
