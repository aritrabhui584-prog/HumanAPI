# HumanAPI Hero Video Assets Directory

This directory stores adaptive, resolution-matched video sources for the Cinematic Welcome Hero:

## Recommended Video Delivery Specifications

| Asset Filename | Target Resolution | Recommended Bitrate | Aspect Ratio | Target Device Tier |
| :--- | :--- | :--- | :--- | :--- |
| `hero-desktop-4k.mp4` | 3840 × 2160 (4K UHD) | 12 - 16 Mbps | 16:9 | High-DPI Desktop Monitors (≥ 2560px) |
| `hero-desktop-1080.mp4` | 1920 × 1080 (FHD) | 4 - 6 Mbps | 16:9 | Standard Laptops & 1080p Screens |
| `hero-mobile.mp4` | 1080 × 1920 / 720 × 1280 | 2.5 - 4 Mbps | 9:16 (Portrait) | Mobile Devices & Phones (< 768px) |
| `hero-poster.jpg` | 1920 × 1080 | N/A | 16:9 | Immediate Poster Backdrop |

## Source Asset Audit Findings
* Current fallback asset: `src/assets/landing/background/humanapi-hero.mp4`
* Encoded Resolution: **848 × 478** (SD 480p)
* Bitrate: **192 kbps**
* Codec: **H.264 / AVC1**
* Note: Upscaling an 848 × 478 video on 1080p/4K monitors inherently causes visual softness due to lack of native pixel density. Placing higher-resolution 4K (`3840x2160`) or 1080p (`1920x1080`) files into this directory will automatically upgrade streaming quality without code modifications.
