---
name: V3-X Audio Identity
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#343535'
  on-surface: '#e3e2e2'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e3e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b4b4'
  tertiary: '#bfcdff'
  on-tertiary: '#082b72'
  tertiary-container: '#97b0ff'
  on-tertiary-container: '#254188'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#27438a'
  background: '#121414'
  on-background: '#e3e2e2'
  surface-variant: '#343535'
typography:
  h1-desktop:
    fontFamily: Noto Serif
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Noto Serif
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  body:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is engineered to evoke the precision and exclusivity of high-fidelity audio engineering. The brand personality is **Modern Minimalism with a Luxurious core**, focusing on the "silence between the notes" through a sophisticated, dark monochromatic foundation punctuated by metallic gold accents.

The visual style leverages **high-end editorial layouts** and **tonal layering**. By shifting to a dark aesthetic, the system mimics the atmosphere of a professional mastering studio. It avoids unnecessary ornamentation, allowing high-resolution product photography of leather, machined aluminum, and copper wiring to provide the primary visual texture. The emotional response is one of quiet confidence, technical authority, and uncompromising quality.

## Colors

The palette is rooted in **"Obsidian Matte"** (#171717), creating a deep, immersive environment. The **Gold Accent** (#D4AF37) is used with surgical precision—reserved for primary calls to action, active states, or premium signifiers—mimicking the gold-plated connectors found in high-end audio equipment.

- **Backgrounds:** The interface uses deep charcoal and black tones (Obsidian) to reduce eye strain and emphasize content. Surfaces are layered using slight value increases to define depth.
- **Interactive States:** Gold accents provide a high-contrast focal point against the dark base. Hover states should feel responsive and utilize subtle luminosity shifts.
- **Status:** Functional feedback (errors, warnings) should be rendered in desaturated tones to prevent them from breaking the sophisticated nocturnal aesthetic.

## Typography

The typography strategy pairs the timeless elegance of **Noto Serif** for headlines with the technical precision of **Manrope** for functional text. 

- **Headlines:** Use Noto Serif with tighter letter-spacing. In dark mode, ensure font weights are sufficient to prevent "thining" against dark backgrounds.
- **Body:** Manrope provides high readability for technical specifications. Use a slightly off-white (neutral) color to reduce high-contrast vibration.
- **Captions:** Always uppercase with tracked-out letter spacing to serve as organizational labels or small metadata points.
- **System Fallbacks:** In the absence of web fonts, utilize the specified system stack to maintain a clean, sans-serif look for functional elements.

## Layout & Spacing

This design system utilizes a **12-column fixed grid** for desktop, centering the content at a maximum width of 1280px to maintain an editorial feel on wide monitors. 

- **Rhythm:** All spacing must be a multiple of the 8px base unit. 
- **White Space:** In dark mode, "negative space" feels more substantial. Use `xxl` (64px) spacing between major sections to prevent the UI from feeling "crowded," which is essential for a luxury aesthetic.
- **Grid Gutter:** A consistent 24px gutter ensures breathable separation between product grid items.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Luminous Accents** rather than traditional drop shadows, which are less effective in dark environments.

- **Surface Tiers:** Backgrounds use the darkest value. Cards and modals use slightly lighter "Surface" tones (Surface-Container) to indicate proximity to the user and create depth.
- **Low-Contrast Outlines:** Use thin neutral borders to define cards where tonal shifts are too subtle. 
- **Interactivity:** Elements should feel like physical, high-quality components. Use subtle transitions (200ms ease-out) for all hover states to mimic the smooth damping of a premium volume knob.

## Shapes

The shape language is **Refined and Rounded**, echoing the industrial design of modern high-end headphones and amplifiers while remaining structured.

- **8px (Small):** Use for input fields, buttons, and checkboxes.
- **16px (Card):** Standard for product cards and content containers.
- **24px (Modal):** Reserved for large overlays and dialogs to soften their impact on the screen.
- **Pill (100px):** Exclusively for status badges (e.g., "In Stock", "New") and technical tags.

## Components

- **Primary Buttons:** Solid Gold background with Dark (#171717) text. This provides the highest contrast for the primary action. No border.
- **Secondary Buttons:** Ghost style. Use a medium-contrast neutral border. Text matches the primary content color (off-white).
- **Input Fields:** Darker-than-surface background with a subtle bottom border that transforms into a full Gold outline when focused.
- **Product Cards:** Utilize tonal layering; the card surface should be one step lighter than the page background. Photography should be high-contrast to pop against the dark UI.
- **Audio Spec Chips:** Small, pill-shaped containers with a `Tertiary` text color and subtle border to display technical data (e.g., "32Ω", "Hi-Res").
- **Checkboxes/Radios:** Custom styled with a Gold fill when active; the unselected state should be a subtle neutral border to maintain the minimalist aesthetic.