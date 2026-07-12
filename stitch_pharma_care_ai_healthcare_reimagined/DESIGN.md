---
name: Pharma Care
colors:
  surface: '#031712'
  surface-dim: '#031712'
  surface-bright: '#293d37'
  surface-container-lowest: '#00110d'
  surface-container-low: '#0a1f1a'
  surface-container: '#0f231e'
  surface-container-high: '#192e28'
  surface-container-highest: '#243933'
  on-surface: '#d0e8df'
  on-surface-variant: '#bacbbf'
  inverse-surface: '#d0e8df'
  inverse-on-surface: '#20342f'
  outline: '#84958a'
  outline-variant: '#3b4a42'
  surface-tint: '#00e2a1'
  primary: '#89ffca'
  on-primary: '#003825'
  primary-container: '#14e8a6'
  on-primary-container: '#006344'
  inverse-primary: '#006c4b'
  secondary: '#93ffde'
  on-secondary: '#00382b'
  secondary-container: '#00e9bd'
  on-secondary-container: '#006450'
  tertiary: '#cff0e4'
  on-tertiary: '#17362d'
  tertiary-container: '#b3d4c8'
  on-tertiary-container: '#3e5d53'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#44ffbb'
  primary-fixed-dim: '#00e2a1'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005138'
  secondary-fixed: '#3bfed0'
  secondary-fixed-dim: '#00e0b5'
  on-secondary-fixed: '#002018'
  on-secondary-fixed-variant: '#005140'
  tertiary-fixed: '#c8eadd'
  tertiary-fixed-dim: '#adcec2'
  on-tertiary-fixed: '#012019'
  on-tertiary-fixed-variant: '#2f4c43'
  background: '#031712'
  on-background: '#d0e8df'
  surface-variant: '#243933'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
The brand personality is clinical precision meets high-end technology. It targets a demographic that values health-tech innovation, privacy, and seamless digital experiences. The emotional response is one of "calm confidence"—moving away from the sterile, anxiety-inducing aesthetics of traditional healthcare toward a serene, "boutique digital clinic" feel.

The design style is **Futuristic Minimalism** with a heavy emphasis on **Glassmorphism**. It utilizes deep, dark emerald tones to establish a grounded sense of security, layered with translucent surfaces that suggest transparency and clarity. Motion is used to reinforce the "smart" aspect of the AI, with floating elements and magnetic interactions providing a tactile, premium responsiveness.

## Colors
The palette is rooted in the "Emerald Night" spectrum. The Primary Background (#071C17) provides an infinite depth that allows accent colors to pop with bioluminescent energy. 

The Primary Accent (#14E8A6) is used for critical calls to action and active states, while the Highlight (#2AF5C8) is reserved for gradients and interactive indicators. Secondary surfaces use #0E2D25 to create subtle visual hierarchy without relying on high-contrast lines. Secondary text is tinted with the emerald base (#A6C8BE) to maintain a cohesive, low-stress visual environment.

## Typography
The typography strategy leverages a trio of contemporary sans-serifs to establish authority and technical precision. **Hanken Grotesk** is used for "huge" headlines, featuring tight tracking to create a high-fashion, premium impact. 

**Inter** handles all body copy, ensuring maximum legibility for medical information and dosage instructions. **Geist** is utilized for labels, metadata, and technical readouts (like AI-generated insights), providing a monospaced "developer-tool" aesthetic that reinforces the platform's smart, algorithmic nature. All headings should use optical kerning and generous bottom margins to prevent visual crowding.

## Layout & Spacing
This design system utilizes a **Fluid Grid** with oversized margins to create an "airy," premium feel reminiscent of high-end editorial layouts. A 12-column system is used for desktop, with a significant 64px margin on either side to "float" the content in the center of the deep emerald background.

Spacing follows an 8px linear scale. However, for section-level separation, use "Mega-Spacing" (128px or 160px) to give the AI visualizations and large typography room to breathe. On mobile, the grid collapses to 4 columns with 20px gutters, maintaining the 8px rhythm for all component internals.

## Elevation & Depth
Hierarchy is achieved through **Glassmorphic Layering**. Instead of traditional drop shadows, depth is communicated via:

1.  **Backdrop Blurs:** Surfaces use a 12px to 20px Gaussian blur on the background layer, creating a "frosted emerald" effect.
2.  **Inner Glows:** A 1px semi-transparent white stroke (top and left) mimics light hitting the edge of a glass pane.
3.  **Shadow Tints:** When shadows are used, they are never pure black; they use a highly saturated, deep emerald (#030C0A) with a 40% opacity and a large (32px+) blur radius to simulate ambient occlusion in a dark environment.
4.  **Z-Axis Transforms:** Active cards should slightly scale (1.02x) and use CSS `translateY(-4px)` to appear as if they are magnetically lifting off the surface.

## Shapes
The shape language is "Squircle-adjacent." All primary containers, inputs, and cards use a **0.5rem (8px)** base radius, scaling up to **1.5rem (24px)** for large glass cards and modals. This level of roundedness avoids the playfulness of "pill-shaped" designs while remaining much softer and more approachable than sharp-edged industrial interfaces. Buttons and interactive chips should utilize the `rounded-xl` (1.5rem) setting to invite touch and interaction.

## Components
- **Glass Cards:** The signature component. Background: `rgba(14, 45, 37, 0.6)`. Backdrop-filter: `blur(16px)`. Border: `1px solid rgba(255, 255, 255, 0.08)`.
- **Magnetic Buttons:** Primary buttons use a gradient from #14E8A6 to #2AF5C8. On hover, implement a subtle "magnetic" pull effect where the button follows the cursor slightly (5-10px) via CSS transforms.
- **Input Fields:** Minimalist under-lines or fully transparent containers with a subtle `rgba(255, 255, 255, 0.05)` fill. Focus state triggers a glow effect on the border using the primary accent color.
- **Interactive 3D Elements:** AI health visualizations (e.g., DNA strands, heart rate monitors) should use CSS `perspective` and `rotateY` to create a sense of physical presence within the dark space.
- **Status Chips:** Small, pill-shaped indicators for "Live Consultation" or "Prescription Ready." These should use a subtle pulse animation on the background to signify "Smart" activity.
- **Lists:** Items separated by the low-opacity border token, with a "hover-reveal" state that brightens the background blur of the specific list row.