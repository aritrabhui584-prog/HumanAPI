import React, { useState } from "react";
import { motion } from "motion/react";
import { HERO_ASSET_CONFIG, HeroVisualAssetConfig } from "../../assets/landing-reference/hero/heroConfig";
import { HeroVideo } from "./HeroVideo";

interface HeroVisualProps {
  className?: string;
  configOverride?: Partial<HeroVisualAssetConfig>;
  children?: React.ReactNode;
}

/**
 * Isolated Hero Visual Component.
 * Decouples visual artwork format (PNG, JPG, WebP, Video, HLS, 3D Canvas) from page layout.
 * Ensures the asset can be updated by editing heroConfig.ts without touching layout.
 */
export const HeroVisual: React.FC<HeroVisualProps> = ({
  className = "",
  configOverride,
  children
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const config = { ...HERO_ASSET_CONFIG, ...configOverride };

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      style={{
        backgroundColor: "#EDE3D5"
      }}
      aria-hidden="true"
    >
      {/* Background Atmosphere Texture */}
      <div
        className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(201, 111, 66, 0.08) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 70%, rgba(119, 129, 108, 0.08) 0%, transparent 50%)`
        }}
      />

      {/* Visual Asset Layer (Replaceable) */}
      <motion.div
        className="absolute inset-0 z-10 w-full h-full flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {config.type === "video" || config.type === "hls" ? (
          <HeroVideo
            videoSrc={config.src}
            poster={config.poster}
            objectFit={config.objectFit}
            objectPosition={config.objectPosition}
            opacity={config.opacity ?? 0.95}
          />
        ) : (
          <img
            src={config.src}
            alt={config.alt}
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            className="w-full h-full transition-opacity duration-700"
            style={{
              objectFit: config.objectFit,
              objectPosition: config.objectPosition,
              opacity: isLoaded || !hasError ? (config.opacity ?? 0.95) : 0.4
            }}
          />
        )}
      </motion.div>

      {/* Editorial Vignette & Warm Depth Scrims
          Ensures typography, navigation, and badges maintain pristine contrast and legibility */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, 
              rgba(237, 227, 213, 0.85) 0%, 
              rgba(237, 227, 213, 0.35) 25%, 
              rgba(237, 227, 213, 0.20) 50%, 
              rgba(237, 227, 213, 0.50) 80%, 
              rgba(237, 227, 213, 0.96) 100%
            ),
            radial-gradient(ellipse at 50% 50%, 
              rgba(237, 227, 213, 0.25) 0%, 
              rgba(237, 227, 213, 0.65) 85%
            )
          `
        }}
      />

      {/* Subtle Warm Film Grain / Material Screen */}
      <div
        className="absolute inset-0 z-25 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#342A24 1px, transparent 0)`,
          backgroundSize: "20px 20px"
        }}
      />

      {/* Optional Inset Composition Slot */}
      {children && (
        <div className="absolute inset-0 z-30 pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
};
