# HumanAPI UI/UX & Design System Audit

## 1. Design System Overview

HumanAPI follows a warm, editorial, high-trust visual language. The design system rejects generic SaaS templates, cold blue gradients, and aggressive glassmorphism in favor of deliberate typography, natural warm tones, and cinematic visual grounding.

---

## 2. Color Palette Specifications

### Product Surfaces (Warm Canvas)
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `Warm Ivory` | `#F6F0E7` | Primary document background & canvas |
| `Cream` | `#FFF9F2` | Elevated card surfaces & navbar background |
| `Burnt Orange` | `#C96F42` | Primary brand accent & active state indicator |
| `Terracotta` | `#B85D3D` | Hover states & primary action emphasis |
| `Warm Cocoa` | `#342A24` | Primary high-contrast text & dark CTA sections |
| `Taupe` | `#7B6C60` | Secondary typography & neutral borders |
| `Muted Sage` | `#77816C` | Verification badges & status indicators |

### Cinematic Welcome Room (Hero Palette)
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `Deep Red` | `#3A0B08` | Root dark backdrop & overscroll protection |
| `Burnt Red` | `#7F1D13` | Radial wallpaper core tint |
| `Cinematic Orange` | `#C84A24` | Radial wallpaper glow highlight |
| `Warm Amber` | `#F0A23A` | Dark theme brand highlight |
| `Warm White` | `#FFF4E8` | Dark room headline typography |

---

## 3. Component Guidelines & Accessibility Audit

### Typography Hierarchy
- **Font Family**: `Manrope` (Google Fonts modern sans-serif).
- **Display Headlines**: `clamp(56px, 5.5vw, 88px)` on desktop, `clamp(40px, 12vw, 58px)` on mobile. `font-weight: 500/600`, `letter-spacing: -0.05em`.
- **Section Headers**: `32px`–`42px`, `font-semibold`, `letter-spacing: -0.035em`.
- **Body Copy**: `15px`–`17px`, `line-height: 1.6`, `color: #7B6C60`.

### Interaction Rules
- **Hover Transitions**: `150ms`–`200ms` `ease-out`. Cards lift `translateY(-2px)`.
- **Focus Rings**: `focus-visible:ring-2 focus-visible:ring-[#C96F42]`.
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce`. Disables decorative light sweeps, scale transforms, and scroll-linked translations.
