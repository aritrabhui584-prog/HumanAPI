# HumanAPI Landing Reference Hero Asset Directory

This directory is reserved for the final HumanAPI hero image / artwork asset.

## Future Asset Replacement Instructions
When you have the final visual artwork (JPG, PNG, WebP, SVG, transparent PNG, 3D render, or video):

1. Place your asset file into this directory (e.g., `hero-artwork.png`, `hero-artwork.webp`, or `hero-artwork.jpg`).
2. Update `heroConfig.ts` in this directory to point to your new file:
   ```ts
   export const HERO_ASSET = {
     type: 'image', // 'image' | 'video' | 'component'
     src: new URL('./your-hero-artwork.png', import.meta.url).href,
     alt: 'HumanAPI Verified Expert Consultations',
     objectFit: 'cover', // 'cover' | 'contain'
     objectPosition: 'center 45%',
   };
   ```
3. That is all! The `<HeroVisual />` component automatically consumes this configuration with responsive framing, warm vignette blending, and graceful fallback. No page layout or markup changes are required.

## Placeholder Specifications
- **Aspect Ratio**: 16:9 to 21:9 responsive container fit
- **Tone**: Warm editorial palette (`#F4EEE5`, `#EDE3D5`, `#C96A3E`, `#77806D`, `#332A24`)
- **Safe Area**: Center-weighted focal imagery with subtle top & bottom warm depth masking so headlines and floating navigation remain 100% legible across all device sizes.
