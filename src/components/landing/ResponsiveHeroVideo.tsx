import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import desktopVideo from "../../assets/landing/background-video/desktop/humanapi-hero-1440p.mp4";
import mobileVideoMaster from "../../assets/landing/background-video/mobile/humanapi-hero-mobile.mp4";
import mobileVideoWeb from "../../assets/landing/background-video/mobile/humanapi-hero-mobile-web.mp4";
import mobilePoster from "../../assets/landing/background-video/poster/hero-mobile.webp";
import desktopPoster from "../../assets/landing/background-video/poster/hero-desktop.webp";

interface ResponsiveHeroVideoProps {
  className?: string;
  prefersReducedMotion?: boolean;
}

// Prefer faststart optimized mobile delivery asset when available
const mobileVideo = mobileVideoWeb || mobileVideoMaster;

/**
 * Helper to determine the initial video source & poster synchronously before render.
 * On phone (<768px): returns mobileVideo (faststart optimized humanapi-hero-mobile-web.mp4) & mobilePoster
 * On desktop (>=768px): returns desktopVideo (humanapi-hero-1440p.mp4) & desktopPoster
 */
const getInitialConfig = (): { src: string; poster: string } => {
  if (typeof window !== "undefined") {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    return {
      src: isMobile ? mobileVideo : desktopVideo,
      poster: isMobile ? mobilePoster : desktopPoster
    };
  }
  return { src: desktopVideo, poster: desktopPoster };
};

export const ResponsiveHeroVideo: React.FC<ResponsiveHeroVideoProps> = ({
  className = "",
  prefersReducedMotion = false
}) => {
  const [config, setConfig] = useState<{ src: string; poster: string }>(getInitialConfig);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Synchronously ensure correct initial source & poster before initial render paint
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const targetSrc = isMobile ? mobileVideo : desktopVideo;
      const targetPoster = isMobile ? mobilePoster : desktopPoster;

      if (config.src !== targetSrc || config.poster !== targetPoster) {
        setConfig({ src: targetSrc, poster: targetPoster });
      }
    }
  }, []);

  // Listen for media query breakpoint changes across 767px / 768px
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = (e: MediaQueryListEvent) => {
      const isMobile = e.matches;
      setConfig({
        src: isMobile ? mobileVideo : desktopVideo,
        poster: isMobile ? mobilePoster : desktopPoster
      });
      setIsVideoReady(false);
    };

    mobileQuery.addEventListener("change", handleChange);
    return () => {
      mobileQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const handleMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setIsVideoReady(true);
      if (import.meta.env.DEV) {
        let droppedFrames = 0;
        let totalFrames = 0;
        if ("getVideoPlaybackQuality" in video && typeof (video as any).getVideoPlaybackQuality === "function") {
          const quality = (video as any).getVideoPlaybackQuality();
          droppedFrames = quality.droppedVideoFrames || 0;
          totalFrames = quality.totalVideoFrames || 0;
        }
        console.info("[HumanAPI Hero Video Diagnostics]", {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          currentSrc: video.currentSrc,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState,
          networkState: video.networkState,
          paused: video.paused,
          duration: video.duration,
          droppedFrames,
          totalFrames
        });
      }
    }
  };

  // 1. Initial Autoplay Attempt on Mount/Key Change
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    if (video.readyState >= 1) {
      handleMetadata();
    }

    const attemptAutoplay = () => {
      video.muted = false;
      video.volume = 1.0;

      video.play()
        .then(() => {
          // Unmuted autoplay succeeded
        })
        .catch(() => {
          // Unmuted autoplay blocked by browser policy -> Fallback to muted autoplay
          video.muted = true;
          video.play().catch(() => {});
        });
    };

    attemptAutoplay();
  }, [config.src, prefersReducedMotion]);

  // 2. IntersectionObserver to Mute Video When Scrolled Away & Restore Unmuted When Returning
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Returned to view -> Attempt unmuted audible playback
            video.muted = false;
            video.volume = 1.0;
            video.play().catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          } else {
            // Scrolled out of view -> Mute audio automatically
            video.muted = true;
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [config.src, prefersReducedMotion]);

  // 3. Tab Visibility Change Listener: Pause when hidden, resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video || prefersReducedMotion) return;

      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className={`hero-video absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
      id="welcome-video-container"
    >
      {/* SOLID DARK BACKDROP FALLBACK (#160706) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#160706" }}
      />

      {/* INSTANT POSTER IMAGE BACKGROUND BEFORE VIDEO LOADS */}
      {config.poster && (
        <img
          src={config.poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isVideoReady ? "opacity-0" : "opacity-100"
          }`}
          style={{ objectFit: "cover", objectPosition: "center center" }}
        />
      )}

      {/* SINGLE REACT-KEYED VIDEO ELEMENT (Explicit src, zero child <source> tags) */}
      {!prefersReducedMotion && (
        <video
          key={config.src}
          ref={videoRef}
          src={config.src}
          poster={config.poster}
          autoPlay
          loop
          playsInline
          preload="metadata"
          muted={false}
          aria-hidden="true"
          onLoadedMetadata={handleMetadata}
          onCanPlay={handleMetadata}
          onLoadedData={handleMetadata}
          className={`absolute inset-0 w-full h-full block m-0 p-0 border-0 object-cover transition-opacity duration-500 ease-out ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: "none",
            filter: "none",
            objectFit: "cover",
            objectPosition: "center center"
          }}
        />
      )}
    </div>
  );
};

export default ResponsiveHeroVideo;
