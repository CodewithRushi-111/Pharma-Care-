---
name: Apothecary
colors:
  surface: '#FAF9F6'
  surface-dim: '#F1F4F0'
  surface-bright: '#FAF9F6'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#FAF9F6'
  surface-container: '#F1F4F0'
  surface-container-high: '#E5EAE4'
  surface-container-highest: '#DDE3DD'
  on-surface: '#1F2521'
  on-surface-variant: '#5B655F'
  inverse-surface: '#1F2521'
  inverse-on-surface: '#FAF9F6'
  outline: '#DDE3DD'
  outline-variant: '#CBD3CB'
  surface-tint: '#2F5D50'
  primary: '#2F5D50'
  on-primary: '#FAF9F6'
  primary-container: '#254A40'
  on-primary-container: '#FAF9F6'
  inverse-primary: '#8EB4A8'
  secondary: '#C97B4A'
  on-secondary: '#FFFFFF'
  secondary-container: '#F3E3D6'
  on-secondary-container: '#C97B4A'
  tertiary: '#3F7D5C'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#EAF1EC'
  on-tertiary-container: '#3F7D5C'
  error: '#B3483F'
  on-error: '#FFFFFF'
  error-container: '#FBECEB'
  on-error-container: '#B3483F'
  primary-fixed: '#8EB4A8'
  primary-fixed-dim: '#8EB4A8'
  on-primary-fixed: '#1F2521'
  on-primary-fixed-variant: '#2F5D50'
  secondary-fixed: '#F3E3D6'
  secondary-fixed-dim: '#F3E3D6'
  on-secondary-fixed: '#1F2521'
  on-secondary-fixed-variant: '#C97B4A'
  tertiary-fixed: '#EAF1EC'
  tertiary-fixed-dim: '#EAF1EC'
  on-tertiary-fixed: '#1F2521'
  on-tertiary-fixed-variant: '#3F7D5C'
  background: '#FAF9F6'
  on-background: '#1F2521'
  surface-variant: '#E5EAE4'
  bg-subtle: '#F1F4F0'
  border-muted: '#DDE3DD'
  text-muted: '#5B655F'
  surface-elevated: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  sidebar-width: 240px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---
# design.md
## Visual Design System & Google Stitch Generation Guide
### AI-Powered Smart Pharmacy & Telemedicine Platform

This document defines the visual identity for the platform and provides ready-to-use prompts for generating high-fidelity screens in **Google Stitch**. It implements the UI requirements from Section 10 of the PRD: a light, premium, clinically trustworthy theme — deliberately not a playful consumer app, and not a generic "SaaS blue" template.

---

## 1. Design Thesis

Most health-tech UI defaults to one of two clichés: sterile hospital-white-and-blue, or an overly casual wellness-app pastel look. Neither fits a platform that has to feel like **a place you'd trust with your prescriptions** while still feeling **premium and calm to use daily**.

The direction here draws from **apothecary and clinical-print vernacular**: the quiet authority of a pharmacist's label, the precision of a lab report, warmed up with a soft sage-and-cream palette instead of cold clinical blue. The signature element is a **"prescription-label" card treatment** — a subtle left-edge color bar + monospaced meta-data (dosage, status, time) on key cards (medicine cards, appointment cards, prescription cards) — evoking a pharmacy label without being literal or gimmicky.

---

## 2. Design Tokens

### 2.1 Color Palette (Light Theme)

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FAF9F6` | Page background — warm off-white, not stark white |
| `--color-surface` | `#FFFFFF` | Cards, panels, modals |
| `--color-surface-alt` | `#F1F4F0` | Secondary surface — sage-tinted grey for subtle sections |
| `--color-primary` | `#2F5D50` | Deep sage green — primary brand color, used for headers, primary buttons, nav |
| `--color-primary-hover` | `#254A40` | Hover/active state of primary |
| `--color-accent` | `#C97B4A` | Warm terracotta-clay accent — used sparingly for Rx badges, key highlights, active states (NOT the same #D97757 Claude-associated shade; kept distinct and slightly more muted/brick) |
| `--color-accent-soft` | `#F3E3D6` | Accent tint background for badges/banners |
| `--color-text-primary` | `#1F2521` | Primary text — near-black with a green undertone, not pure black |
| `--color-text-secondary` | `#5B655F` | Secondary/muted text |
| `--color-border` | `#DDE3DD` | Hairline borders, dividers |
| `--color-success` | `#3F7D5C` | Delivered / Confirmed / Completed states |
| `--color-warning` | `#B8863B` | Pending verification / awaiting action |
| `--color-info-banner-bg` | `#EAF1EC` | AI disclaimer banners — calm, not alarming |
| `--color-error` | `#B3483F` | Rejected / cancelled / true errors only |

**Contrast check:** `--color-primary` (#2F5D50) on `--color-bg` (#FAF9F6) = 8.1:1 (AA/AAA pass for text). `--color-text-primary` on white = 15.8:1. All body text combinations pass WCAG 2.1 AA.

### 2.2 Typography

- **Display face:** `Fraunces` (serif, variable optical size) — used for H1/H2 headings and the hero moment. Its slightly warm, slab-like serif gives the pharmacy-label authority without feeling like a hospital sign.
- **Body face:** `Inter` — used for all body copy, UI labels, buttons. Clean, highly legible at small sizes.
- **Meta/data face:** `IBM Plex Mono` — used exclusively for dosage figures, order IDs, timestamps, and prescription details, reinforcing the "label" signature.

Type scale (px, at 1x):
| Role | Font | Size | Weight |
|---|---|---|---|
| H1 / Page title | Fraunces | 36 | 600 |
| H2 / Section | Fraunces | 26 | 600 |
| H3 / Card title | Inter | 18 | 600 |
| Body | Inter | 15 | 400 |
| Caption / label | Inter | 13 | 500 (uppercase, letter-spacing 0.04em) |
| Meta / data (dosage, IDs, timers) | IBM Plex Mono | 13–14 | 500 |

### 2.3 Layout & Spacing

- Base spacing unit: **8px grid**.
- Max content width: **1200px**, centered, with generous side gutters (min 24px mobile, 64px desktop).
- Corner radius: **12px** on cards and buttons, **6px** on badges/tags — rounded but restrained, never pill-shaped except for status chips.
- Shadows: soft, diffuse, low-opacity — `0 4px 16px rgba(47,93,80,0.08)` on resting cards, slightly deeper on hover. No hard drop shadows.
- Cards use a **left border accent bar** (4px, colored by status/category) as the signature structural device — this is the one place the design "takes a risk," and it's justified because it mirrors a real pharmacy label's color-coded edge stripe, and it lets a user scan order/appointment status by color without reading text.

### 2.4 Iconography & Imagery

- Icons: thin-stroke (1.5px), rounded-cap line icons (e.g., Phosphor or Lucide icon set), never filled/solid style — keeps the interface feeling precise rather than heavy.
- No stock photography of generic "smiling doctors" — instead use simple line-illustrations in the primary/accent palette for empty states and onboarding, reinforcing the label/print aesthetic.
- Avoid red-cross or overly literal medical iconography; favor abstract shapes (capsule outline, leaf, pulse-line) tied to the sage palette.

### 2.5 Motion

- Page transitions: 200ms ease-out fade + 8px slide.
- Status changes (order stepper, appointment confirmation): a single deliberate checkmark-draw animation on completion — one orchestrated moment, not scattered micro-animations everywhere.
- Reduced-motion: all animations respect `prefers-reduced-motion`; fall back to instant state changes.

---

## 3. Screen Inventory

| # | Screen | Priority |
|---|---|---|
| 1 | Patient Dashboard (home) | Must |
| 2 | AI Healthcare Assistant (chat) | Must |
| 3 | Medicine Catalog / Search | Must |
| 4 | Medicine Detail + Add to Cart | Must |
| 5 | Cart / Checkout + Prescription Upload | Must |
| 6 | Order Tracking (status stepper) | Must |
| 7 | Doctor Directory / Search | Must |
| 8 | Doctor Profile + Slot Booking | Must |
| 9 | Video Consultation Room | Must |
| 10 | Digital Prescription View (post-consult) | Must |
| 11 | Health Records Timeline | Should |
| 12 | Pharmacy Admin — Verification Queue | Should |
| 13 | Login / Signup | Must |

---

## 4. Google Stitch Prompts

Use one prompt per screen for best fidelity. Paste the **Global Style Preamble** into Stitch first (or prepend it to each screen prompt), then follow with the specific screen prompt.

### 4.1 Global Style Preamble (prepend to every screen prompt)

```
Design a light-themed, premium healthcare web app screen. Background is warm
off-white (#FAF9F6), not stark white. Primary brand color is a deep sage green
(#2F5D50) used for headers, primary buttons, and active nav states. Accent
color is a muted warm terracotta/clay (#C97B4A) used sparingly for badges and
highlights only. Text is near-black with a green undertone (#1F2521), body
copy in Inter font, headings in Fraunces serif font (warm, slightly editorial,
not corporate). Any dosage figures, order IDs, or timestamps use a monospace
font (IBM Plex Mono) to look like precise clinical data. Cards have a soft
12px corner radius, a subtle diffuse shadow, and a thin 4px colored left-edge
accent bar (like a pharmacy label stripe) whose color indicates status or
category. Icons are thin-stroke line icons, not filled. The overall feeling
should be calm, precise, and trustworthy — like a well-designed apothecary
label or a lab report — NOT a playful consumer wellness app, and NOT a cold
clinical blue hospital portal. Avoid stock photos of doctors; use simple line
illustrations in the sage/clay palette for empty states.
```

### 4.2 Screen: Patient Dashboard

```
[Global Style Preamble]

Screen: Patient home dashboard for a healthcare platform, desktop web layout,
1440px wide.

Layout:
- Left sidebar (240px): logo mark at top, then nav items with icons —
  Dashboard, AI Assistant, Pharmacy, Doctors, Health Records, Profile. Active
  item highlighted with sage-green background and white text.
- Top bar: greeting "Good morning, [Name]" in Fraunces serif, search bar,
  notification bell icon, profile avatar.
- Main content, 3-column card grid below a welcome banner:
  1. "Ask the AI Assistant" card — sage background, short prompt input,
     3 suggested quick-questions as chips (e.g. "What is paracetamol for?").
  2. "Upcoming Appointment" card — doctor name, specialization, date/time in
     monospace, a small "Join Call" button that's disabled/greyed until
     the appointment window opens.
  3. "Recent Order" card — medicine thumbnail, order status shown as a
     4-step horizontal stepper (Placed → Verified → Shipped → Delivered)
     with the current step in sage green and future steps in light grey.
- Below the grid: a "Health Timeline" preview strip showing the last 3
  events (a consultation, a prescription, an order) as small horizontal
  cards with a left accent-color bar per event type.
- A floating circular action button, bottom-right, sage green with a chat
  icon, for the AI Assistant — persistent across all screens.
```

### 4.3 Screen: AI Healthcare Assistant (Chat)

```
[Global Style Preamble]

Screen: AI Healthcare Assistant chat interface, desktop web layout.

Layout:
- Left sidebar same as dashboard, "AI Assistant" nav item active.
- Main panel: chat conversation view, warm off-white background.
  - User messages: right-aligned, sage-green filled bubble, white text.
  - Assistant messages: left-aligned, white card with soft shadow, left
    4px accent bar in a calm blue-grey (informational, distinct from
    status colors), containing the assistant's answer.
  - Every assistant message that discusses a medicine or symptom shows a
    small tinted banner directly beneath it in a soft sage-tinted
    background (#EAF1EC), icon of an info circle, text: "This is general
    information, not medical advice. Please consult a doctor or
    pharmacist for guidance specific to you." — styled calmly, NOT as a
    red warning.
  - Below an assistant answer about a medicine, show 1-2 small inline
    "catalog suggestion" cards (medicine name, price, an "Rx required"
    clay-colored badge if applicable, "Add to cart" button).
- Bottom input bar: rounded text input with placeholder "Ask about a
  medicine, symptom, or book a doctor...", a send button in sage green,
  and a small mic icon for voice input.
- Top of chat panel: a subtle header reading "AI Health Assistant —
  informational support, available 24/7" in Fraunces serif.
```

### 4.4 Screen: Medicine Catalog / Search

```
[Global Style Preamble]

Screen: Medicine catalog and search results, desktop web layout.

Layout:
- Left sidebar same as dashboard, "Pharmacy" active.
- Top: search bar with category filter chips below it (Pain Relief,
  Antibiotics, Vitamins, Skin Care, Digestive Health, etc.), chips use
  outline style, active chip filled sage green.
- Main content: responsive grid of medicine cards (4 per row desktop).
  Each card: product image placeholder (simple line-drawn capsule/bottle
  icon), medicine name in Inter semi-bold, generic name in smaller grey
  text, price in monospace, small "Rx" badge in clay/terracotta color
  top-right corner ONLY if prescription required, "Add to Cart" button
  in sage green outline style.
- Right side: a slim filter panel with price range slider, "in stock only"
  toggle, dosage form checkboxes (Tablet, Syrup, Injection).
```

### 4.5 Screen: Medicine Detail + Add to Cart

```
[Global Style Preamble]

Screen: Medicine detail page, desktop web layout.

Layout:
- Two-column layout: left 40% shows a large product image area (simple
  line illustration of a medicine bottle/blister pack in sage palette),
  right 60% shows details.
- Right column: medicine name (Fraunces serif, large), generic
  name/composition in monospace caption below it, price prominently
  displayed, a clay-colored "Prescription Required" badge with a small
  document icon if applicable, quantity stepper, "Add to Cart" primary
  button in sage green.
- Below: three stacked info sections with left accent-bar cards:
  "Usage & Dosage" (blue-grey accent), "Precautions" (warning amber
  accent), "Common Side Effects" (neutral grey accent) — each with a
  small icon and concise text.
- A calm banner at the bottom of the page: "Always confirm dosage with
  your doctor or pharmacist" in the same soft sage-tinted disclaimer
  style used in the AI Assistant screen, for visual consistency.
```

### 4.6 Screen: Cart / Checkout + Prescription Upload

```
[Global Style Preamble]

Screen: Shopping cart and checkout page with prescription upload step.

Layout:
- Left column (60%): cart item list, each row showing medicine name,
  quantity stepper, price, remove icon. Any item requiring a prescription
  shows a clay "Rx" badge and a note "Prescription required for this item."
- Below the cart list: a "Prescription Upload" card with a dashed-border
  drop zone (sage-tinted), an upload-cloud line icon, text "Drag and drop
  or click to upload your prescription (JPG, PNG, PDF)", and a thumbnail
  preview once uploaded.
- Right column (40%): sticky order summary card — subtotal, delivery fee,
  total in monospace figures, and a large "Place Order" primary button.
  Below the button, small text: "Prescription-required items will be
  verified by our pharmacist before dispatch."
```

### 4.7 Screen: Order Tracking

```
[Global Style Preamble]

Screen: Order tracking / status detail page.

Layout:
- Header: Order ID in monospace, order date.
- Prominent horizontal stepper across the top: Placed → Prescription
  Verification → Confirmed → Packed → Shipped → Delivered. Completed
  steps filled sage green with a checkmark icon, current step
  highlighted with a pulsing ring in clay accent, future steps light
  grey outline.
- Below stepper: order item list (same card style as cart), a delivery
  address card, and an estimated delivery date in monospace.
- A left-accent-bar card showing "Pharmacist Note" if the order was
  flagged during verification (amber accent bar).
```

### 4.8 Screen: Doctor Directory

```
[Global Style Preamble]

Screen: Doctor search / directory page.

Layout:
- Left sidebar same as dashboard, "Doctors" active.
- Top: search bar + specialization filter chips (General Physician,
  Dermatologist, Pediatrician, Cardiologist, etc.).
- Main grid: doctor cards, 3 per row. Each card: circular avatar
  placeholder (simple initials on sage background if no photo), doctor
  name (Inter semi-bold), specialization in clay-colored small caption,
  star rating, "Available today" or "Next slot: [date]" in monospace,
  "View Profile" outline button.
```

### 4.9 Screen: Doctor Profile + Slot Booking

```
[Global Style Preamble]

Screen: Doctor profile and appointment booking page.

Layout:
- Left column (35%): doctor avatar, name (Fraunces serif), specialization,
  years of experience, qualifications list, rating.
- Right column (65%): a calendar/date-picker strip showing the next 7
  days as selectable pills, and below it a grid of available time slots
  as small buttons (available slots outline sage, booked slots disabled
  grey, selected slot filled sage green).
- Below: a "Confirm Appointment" summary card showing selected date/time
  in monospace, consultation fee, and a primary "Confirm Booking" button.
```

### 4.10 Screen: Video Consultation Room

```
[Global Style Preamble]

Screen: Telemedicine video consultation room, full-screen focused layout,
minimal chrome.

Layout:
- Nearly full-viewport dark-neutral video canvas area (this is the one
  screen where a darker background is appropriate, to reduce glare and
  keep focus on the call) showing two video tiles: large tile for the
  other participant, small picture-in-picture tile bottom-right for
  self-view.
- Bottom floating control bar (rounded pill container, semi-transparent
  dark background): mic toggle icon, camera toggle icon, end-call button
  (filled in error-red #B3483F, the one place red is appropriate), a
  "Notes" icon to open prescription panel.
- Top-left overlay: patient/doctor name and appointment time in small
  white monospace text.
- A slide-out right panel (triggered by the notes icon), light themed
  matching the rest of the app, where the doctor can add prescription
  details during the call: medicine name input, dosage input, duration
  input, "Add to Prescription" button, and a running list of added items.
```

### 4.11 Screen: Digital Prescription View

```
[Global Style Preamble]

Screen: Digital prescription document view, styled to evoke a formal
printed prescription while staying consistent with the app's light theme.

Layout:
- Centered document card, max-width 700px, white background, soft shadow,
  resembling a printed prescription pad: doctor name/qualifications at
  top in Fraunces serif, patient name and date in monospace beneath a
  thin divider line.
- Prescribed medicines listed in a clean table: medicine name, dosage,
  frequency, duration — dosage/frequency/duration values in monospace
  for that "label" precision feel.
- Doctor's digital signature area (simple stylized signature line) and
  a small verified checkmark badge in sage green reading "Digitally
  issued and verified."
- A "Download PDF" and "Order these medicines" button pair at the
  bottom, sage green primary and outline secondary.
```

### 4.12 Screen: Health Records Timeline

```
[Global Style Preamble]

Screen: Patient health records / history timeline page.

Layout:
- Left sidebar same as dashboard, "Health Records" active.
- Vertical timeline down the center-left: each entry is a card with a
  small colored dot on the timeline connector (green dot = consultation,
  clay dot = prescription, blue-grey dot = order), date in monospace,
  short title (e.g., "Consultation with Dr. Rao — General Physician"),
  and an expand chevron to reveal details inline.
- Right side filter panel: toggle filters for Consultations,
  Prescriptions, Orders; a date range picker.
```

### 4.13 Screen: Pharmacy Admin — Verification Queue

```
[Global Style Preamble]

Screen: Pharmacy admin prescription verification queue, internal tool
aesthetic but consistent with the same light premium theme.

Layout:
- Left sidebar with admin-specific nav: Verification Queue, Inventory,
  Doctors, Users.
- Main content: a table/list of pending orders, each row expandable to
  show the uploaded prescription image side-by-side with the ordered
  medicine list. Row includes order ID (monospace), patient name,
  submitted time, and three action buttons: "Approve" (sage filled),
  "Reject" (outline in error-red), "Request Re-upload" (outline neutral).
- A left accent-bar color per row indicating how long the order has been
  waiting (green under 1hr, amber 1-4hrs, red-brick over 4hrs) to help
  admins triage by urgency.
```

### 4.14 Screen: Login / Signup

```
[Global Style Preamble]

Screen: Login and signup page, split-screen layout.

Layout:
- Left half (55%): a calm illustrated panel in the sage/clay palette —
  abstract line illustration combining a capsule shape, a leaf, and a
  subtle pulse-line motif, with a short Fraunces-serif tagline like
  "Your health, in one place." No literal stock photography.
- Right half (45%): centered auth card, white surface, soft shadow.
  Tabs to switch between "Log In" and "Sign Up," email and password
  fields with sage-green focus rings, a primary sage-green submit button,
  a divider labeled "or continue with," and a Google sign-in button
  below it.
```

---

## 5. Component Notes for Implementation

- **Status stepper component:** reusable across Order Tracking and any multi-stage flow; steps defined as data (label, state: complete/current/upcoming), not hardcoded per screen.
- **Rx badge:** a single reusable component (`<PrescriptionBadge />`) so the visual treatment of "prescription required" stays identical across catalog, detail, and cart screens.
- **Disclaimer banner:** one reusable component (`<InfoDisclaimer />`) used identically in the AI Assistant and Medicine Detail screens — consistency here matters for user trust, per PRD Section 10.
- **Left-accent-bar card:** the signature structural device — implement as a single card component with a `accentColor` prop, reused for chat messages, medicine info sections, timeline entries, and admin queue rows, so the "label" motif reads as a deliberate system rather than one-off styling.

---

## 6. What to Avoid

- No cold clinical blue (#0080FF-style) as a primary — this reads as generic hospital-portal default.
- No terracotta at exactly `#D97757` — kept the accent distinct (`#C97B4A`, more muted/brick) to avoid an unintentional resemblance to unrelated AI-tool branding.
- No filled/solid icon sets — keep everything thin-stroke for precision.
- No stock photography of doctors/patients smiling at cameras.
- No red used for anything except true errors/cancellations and the end-call button — reserve it so it retains meaning.
