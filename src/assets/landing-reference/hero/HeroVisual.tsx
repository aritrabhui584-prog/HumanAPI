import React, { useState } from "react";
import { motion } from "motion/react";
import { HERO_ASSET_CONFIG, HeroVisualAssetConfig } from "./heroConfig";

interface HeroVisualProps {
  className?: string;
  configOverride?: Partial<HeroVisualAssetConfig>;
  children?: React.ReactNode;
}

/**
 * Isolated Hero Visual Component.
 * Decouples visual artwork format (PNG, JPG, WebP, Video, 3D Canvas) from page layout.
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
        backgroundColor: "#EDE3D5",
      }}
      aria-hidden="true"
    >
      {/* Background Atmosphere Texture */}
      <div
        className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(201, 106, 62, 0.08) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 70%, rgba(119, 128, 109, 0.08) 0%, transparent 50%)`
        }}
      />

      {/* Visual Asset Layer (Replaceable) */}
      <motion.div
        className="absolute inset-0 z-10 w-full h-full flex items-center justify-center"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {config.type === "video" ? (
          <video
            src={config.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full"
            style={{
              objectFit: config.objectFit,
              objectPosition: config.objectPosition,
              opacity: config.opacity ?? 0.95
            }}
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
              rgba(237, 227, 213, 0.82) 0%, 
              rgba(237, 227, 213, 0.28) 25%, 
              rgba(237, 227, 213, 0.15) 50%, 
              rgba(237, 227, 213, 0.45) 80%, 
              rgba(237, 227, 213, 0.94) 100%
            ),
            radial-gradient(ellipse at 50% 50%, 
              rgba(237, 227, 213, 0.2) 0%, 
              rgba(237, 227, 213, 0.6) 85%
            )
          `
        }}
      />

      {/* Subtle Warm Film Grain / Material Screen */}
      <div
        className="absolute inset-0 z-25 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#332A24 1px, transparent 0)`,
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
