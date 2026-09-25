import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface HeroVideoProps {
  videoSrc: string;
  poster?: string;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  opacity?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  videoSrc,
  poster,
  className = "",
  objectFit = "cover",
  objectPosition = "center",
  opacity = 0.95,
  autoPlay = true,
  loop = true,
  muted = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || prefersReducedMotion) return;

    let hlsInstance: Hls | null = null;
    const isHls = videoSrc.endsWith(".m3u8") || videoSrc.includes("/hls/");

    const handlePlay = () => {
      if (autoPlay) {
        video.play().catch(() => {
          // Graceful handling of browser autoplay policies
        });
      }
    };

    if (isHls) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          capLevelToPlayerSize: true
        });
        hlsInstance = hls;
        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoaded(true);
          handlePlay();
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setHasError(true);
            hls.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native Safari HLS
        video.src = videoSrc;
        video.addEventListener("loadedmetadata", () => {
          setIsLoaded(true);
          handlePlay();
        });
      }
    } else {
      // Standard MP4 or WebM video
      video.src = videoSrc;
      video.addEventListener("loadeddata", () => {
        setIsLoaded(true);
        handlePlay();
      });
      video.addEventListener("error", () => {
        setHasError(true);
      });
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [videoSrc, autoPlay, prefersReducedMotion]);

  if (prefersReducedMotion && poster) {
    return (
      <img
        src={poster}
        alt="HumanAPI consultation workspace background"
        className={`w-full h-full ${className}`}
        style={{
          objectFit,
          objectPosition,
          opacity
        }}
      />
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Poster fallback while video loads or on error */}
      {poster && (!isLoaded || hasError) && (
        <img
          src={poster}
          alt="HumanAPI consultation background preview"
          className="absolute inset-0 w-full h-full transition-opacity duration-700"
          style={{
            objectFit,
            objectPosition,
            opacity: hasError ? 0.8 : opacity
          }}
        />
      )}

      <video
        ref={videoRef}
        loop={loop}
        muted={muted}
        playsInline
        poster={poster}
        className={`w-full h-full transition-opacity duration-700 ${
          isLoaded && !hasError ? "opacity-100" : "opacity-0"
        }`}
        style={{
          objectFit,
          objectPosition,
          opacity
        }}
      />
    </div>
  );
};
