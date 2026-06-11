# KVM – Klaar voor Middelbaar · Style Guide

Derived from the 5 screens in the Figma file `KVM-Claude` (file key `z7zdQEwutnNPIFi2tYR1Pu`).

---

## 1. Brand Overview

**Product:** Klaar voor Middelbaar — an interactive learning platform for Dutch middle-school students.  
**Tone:** Friendly, playful, approachable but structured. Uses a student avatar (Sander) and speech bubbles to guide learners.  
**Canvas width:** 1184 px max-width — applied as `max-width: 1184px; margin: 0 auto` on the main layout container. Desktop only.

---

## 2. Color Palette

### 2.1 Base / Neutral

| Name | Hex | Usage |
|---|---|---|
| Page Background | `#f8fafa` | Every screen's base |
| Card Background | `#ffffff` | Assignment cards, pie chart area |
| Footer / Muted BG | `#f2f4f4` | Footer, sidebar, formatting bar |
| Sidebar BG | `#f7f8f9` | Life areas sidebar |
| Secondary Button BG | `#f0f2f5` | Secondary / reset button |
| Score Chip BG | `#f1f5f9` | Score display pill |
| Border Light | `#eceeee` | Card borders, nav bottom line |
| Border Medium | `#bcc3ca` | Word pill border, dashed drop zones |
| Divider | `#e1e3e3` | Progress stepper connectors, horizontal dividers |

### 2.2 Primary – Blue

| Name | Hex | Usage |
|---|---|---|
| Primary | `#72a8f9` | Active nav breadcrumb, drop zone tint, progress dot, blue CTA |
| Primary Soft | `rgba(78,142,243,0.1)` | Active list item highlight, interaction hint bg |
| Primary Border Soft | `rgba(78,142,243,0.3)` | Active drop zone dashed border |
| Count Badge BG | `#cceaff` | Category count badge bg, score chip border |

### 2.3 Action – Green

| Name | Hex | Usage |
|---|---|---|
| Action / Submit | `#10a37f` | Primary submit/save/opslaan button |
| Life Area: Familie | `rgba(16,163,127,0.1)` | Family life area row tint |

### 2.4 Semantic / Life Area Colors

| Life Area | Dot color | Row tint |
|---|---|---|
| School | `#72a8f9` (blue) | `rgba(78,142,243,0.1)` |
| Familie | `#10a37f` (green) | `rgba(16,163,127,0.1)` |
| Vrienden | `#f59e0b` (amber) | `rgba(245,158,11,0.1)` |
| Liefde | `#ef4444` (red) | — |

### 2.5 Explanation Screen (screen 72)

| Usage | Hex |
|---|---|
| H1 text | `#3c6baa` |
| Informal card bg | `#d9ead3` |
| Informal card heading | `#38761d` |
| Formal card bg | `#667c78` |
| Quote bubble | `#72a8f9` |

### 2.6 Text

| Name | Hex | Usage |
|---|---|---|
| Dark Text | `#191c1d` | Body, headings, most text |
| Muted Text | `#6d747a` | Subtitles, footer copyright, legend labels |
| Very Muted | `rgba(109,116,122,0.4)` | Inactive breadcrumbs, placeholder separators |
| Character Bubble | `#1a1c1e` | Sander speech bubble text |

### 2.7 Medal Colors

| Medal | Hex |
|---|---|
| Gold | `#ffd700` |
| Silver | `#c0c0c0` |
| Bronze | `#cd7f32` |

### 2.8 Special Component Colors

| Component | Hex |
|---|---|
| Tip Box background | `#fef9e9` |
| Tip Box border | `#f8d760` |
| Tip label text | `#c29111` |
| Tip body text | `#453b1a` |
| Tip icon bg | `#f8d760` |
| Informal email card bg | `#fffbeb` |
| Informal email border | `#fde68a` |
| Informal email label | `#92400e` |
| Informal email body | `#78350f` |
| Requirements card bg | `#f2f3fd` |
| Requirements card border | `#c1c6d5` |
| Requirements item text | `#414753` |

---

## 3. Typography

### 3.1 Font Families

| Font | Weight | Usage |
|---|---|---|
| **Inria Sans Bold** | 700 | Headings, labels, nav links, buttons, word pills |
| **Inria Sans Regular** | 400 | Body text, inactive nav, footer copyright |
| **Nimbus Sans Bold** | 700 | H1/H2 headings on explanation screens (screen 72) |
| **Nimbus Sans Regular** | 400 | Body text on explanation screens |
| **Plus Jakarta Sans SemiBold / Regular** | 600 / 400 | Email interface labels and input fields |
| **Lexend SemiBold** | 600 | Email window title bar only |

> Inria Sans is the primary product font. Nimbus Sans appears to be a secondary/alternate used on explanation/uitleg screens.

### 3.2 Type Scale

| Role | Font | Size | Line Height | Weight | Notes |
|---|---|---|---|---|---|
| H1 | Inria Sans | 48 px | 48 px | Bold | Assignment titles |
| H1 (alt) | Inria Sans | 44 px | 52 px | Bold | Some assignment cards |
| H1 (uitleg) | Nimbus Sans | 48 px | 48 px | Bold | Explanation screens, `#3c6baa` |
| H2 | Nimbus Sans | 24 px | 32 px | Bold | Card section headings, tracking `1.2px`, uppercase |
| H3 | Inria Sans | 18 px | 28 px | Bold | Card sub-labels ("Opdracht 1") |
| H4 | Inria Sans | 16 px | 24 px | Bold | Sidebar heading, nav link |
| H4 (uitleg) | Nimbus Sans | 16 px | 24 px | Bold | Footer links on explanation screens |
| Body Large | Inria Sans | 20 px | 28 px | Bold | Score chip, drop zone label, step text |
| Body Large (uitleg) | Nimbus Sans | 20 px | 28–32.5 px | Regular | Explanation body paragraph |
| Body | Inria Sans | 16 px | 24 px | Regular | Footer copyright, sidebar description |
| Body Small | Inria Sans | 14 px | 20 px | Regular | Step labels (inactive), sidebar items |
| Body Small Bold | Inria Sans | 14 px | 20 px | Bold | Word pills, active step label, sidebar bold items |
| Caption | Inria Sans | 13 px | 18 px | Regular | Sub-items in sidebar |
| Overline | Inria Sans | 11 px | 16 px | Bold | Section labels (e.g. "ALTIJD IN JE LEVEN"), tracking `1.2px`, uppercase |
| Tiny | Inria Sans | 11 px | 14 px | Bold | Pie chart center label, legend text |

---

## 4. Spacing & Layout

| Token | Value | Usage |
|---|---|---|
| Page padding | `48 px` | Main content horizontal/top padding |
| Card padding | `48–49 px` | Assignment card inner padding |
| Card gap | `40 px` | Vertical gap between card sections |
| Section gap | `32 px` | Gap between comparison cards, gap between columns |
| Component gap | `24 px` | Gap between sidebar and chart area |
| Inner gap | `16 px` | Gap between form elements, legend items |
| Tight gap | `8–12 px` | Icon-text pairs, breadcrumb parts |

---

## 5. Border Radius

| Component | Radius |
|---|---|
| Assignment card | `40 px` |
| Footer (top corners) | `64 px` |
| Primary/secondary buttons | `9999 px` (pill) |
| Drop zones | `32 px` |
| Sidebar / pie chart area | `24 px` |
| Tip box, comparison cards, requirements card | `16 px` |
| Character bubble | `22 px` |
| Interaction hint banner | `12 px` |
| Count badge | `9999 px` (pill) |
| Word pill | `9999 px` (pill) |
| Medal badges | `9999 px` (circle) |
| Progress step dots | `9999 px` (circle) |
| Search field | `9999 px` (pill) |

---

## 6. Shadows & Elevation

| Name | Value | Usage |
|---|---|---|
| Card shadow | `0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)` | Assignment cards |
| Button shadow (green) | `0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)` | Submit button |
| Button shadow (blue) | `0 10px 20px rgba(78,142,243,0.30)` | Start button |
| Active step ring | `0 0 0 4px rgba(78,142,243,0.20), 0 10px 15px -3px rgba(0,0,0,0.10)` | Progress step (active) |
| Medal shadow | `0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)` | Medal badges |
| Word pill shadow | `0 1px 1px rgba(0,0,0,0.05)` | Draggable word pills |
| Header shadow | `0 4px 10px rgba(0,0,0,0.03)` | Sticky top bar |
| Quote bubble shadow | `0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)` | Educator speech bubble |

---

## 7. Component Patterns

### 7.1 Page Layout

Every screen uses the same shell:
```
Header (sticky)
  └── Nav bar (logo + breadcrumb + avatar)
  └── Progress stepper bar (backdrop-blur, semi-transparent white)
Main content (top: 145px, padding: 48px)
Footer (rounded top, #f2f4f4)
```

Background decoration:
- Base color `#f8fafa`
- Radial gradient from top-right corner: `rgba(163,197,248,0.2)` → transparent at 50%
- Blurred circle bottom-right: 512 px, `rgba(215,227,255,0.2)`, `blur(50px)`
- Some screens also have a top-left teal blur: 384 px, `rgba(193,218,234,0.3)`, `blur(32px)`

### 7.2 Navigation Header

- Sticky, `#f8fafa` bg, `border-bottom: 1px solid #eceeee`
- Logo: 121 × 48 px
- Breadcrumb: items separated by `/` in muted color; active item in `#72a8f9`
- Right side: settings icon (20 px) + user avatar (40 px circle, `#72a8f9` border 2 px)

### 7.3 Progress Stepper

Horizontal stepper below the nav bar. Layout: `step — divider — step — divider — ...`

| State | Circle size | Circle bg | Text weight | Opacity |
|---|---|---|---|---|
| Active | 40 px | `#72a8f9` | Bold | 100% |
| Inactive | 32 px | `#e1e3e3` | Regular | 40% |

Connector: `#e1e3e3`, 2 px height, fills remaining space.  
Stepper bar: `backdrop-blur(2px)`, `rgba(255,255,255,0.5)` bg, `px-[32px] py-[16px]`.

### 7.4 Assignment Card

- White bg, `#eceeee` 1 px border, `40px` radius, `48px` padding
- Drop shadow (see §6 Card shadow)
- Structure:
  1. Assignment label (`#72a8f9`, 18 px bold) e.g. "Opdracht 1"
  2. Assignment title (`#191c1d`, 48 px bold)
  3. Optional subtitle / description (`#6d747a`, 16 px regular)
  4. Content area (varies per assignment type)
  5. Action buttons row (right-aligned)

### 7.5 Word Pills (Draggable)

- White bg, `#bcc3ca` 1 px border, pill shape
- Padding: `py-[11.5px] px-[21px]`
- Left: small drag-handle icon
- Text: `#191c1d`, 14 px bold
- Shadow: `drop-shadow(0 1px 1px rgba(0,0,0,0.05))`

### 7.6 Drop Zones

Two variants:

**Active (Informeel / Blue):**
- `rgba(78,142,243,0.05)` bg
- `2px dashed rgba(78,142,243,0.3)` border
- Placeholder text: `14px`, `rgba(78,142,243,0.4)`, tracking `1.4px`, uppercase

**Inactive (Formeel / Gray):**
- `#eceeee` bg
- `2px dashed #bcc3ca` border
- Placeholder text: `14px`, `rgba(109,116,122,0.4)`, tracking `1.4px`, uppercase

Both: `32px` radius, `34px` padding, `256px` height.

### 7.7 Buttons

**Primary — Submit / Save (Green)**
```
bg: #10a37f  |  px: 40px  py: 16px  |  radius: 9999px
font: 20px bold white
shadow: 0 10px 15px -3px rgba(0,0,0,0.10)
icon: arrow right (19×16px)
```

**Primary — Start (Blue)**
```
bg: #72a8f9  |  px: 64px  py: 20px  |  radius: 48px
font: 24px bold white
drop-shadow: 0 10px 20px rgba(78,142,243,0.30)
icon: play/arrow (25×25px)
```

**Secondary — Reset**
```
bg: #f0f2f5  |  px: 32px  py: 14px  |  radius: 9999px
font: 17px bold #6d747a
```

### 7.8 Score Chip

```
bg: #f1f5f9  |  border: 1px solid rgba(78,142,243,0.10)
drop-shadow: 0 1px 1px rgba(0,0,0,0.05)
radius: 9999px  |  px: 25px  py: 9px
font: 20px bold #72a8f9, tracking 0.5px
content: "Score: X / Y" (two separate spans)
```

### 7.9 Medal Badges (Top Right of Cards)

- Three 48 px circles, overlapping by 16 px (z-order: bronze → silver → gold)
- Each: solid fill, 4 px white border, drop shadow
- Interior trophy icon: ~16.7 × 8.3 px

### 7.10 Character Bubble (Sander / Mascot)

```
bg: white  |  border: 1px solid #cceaff  |  radius: 22px
padding: py-[21px] pl-[25px] pr-[50px]
font: 18px bold #1a1c1e
max-width: 220px
tail: 16px rotated square, bottom-center, white fill + #cceaff bottom+right border
```

Sander character image: 192 × 599 px, displayed rotated 180° on Y axis (CSS `-scale-y-100 rotate-180`).

### 7.11 Tip Box

```
bg: #fef9e9  |  border: 1.5px solid #f8d760  |  radius: 16px
padding: px-[20px] py-[16px]
```

- Icon: 36 px circle, `#f8d760` bg, 💡 emoji
- Label: "TIP", `13px bold #c29111`, tracking `1px`
- Body: `14px regular #453b1a`, line-height `22px`

### 7.12 Life Area Sidebar

```
bg: #f7f8f9  |  border: 1px solid #eceeee  |  radius: 24px  |  width: 272px
```

**Search field:** white bg, `#bcc3ca` border, pill shape, 🔍 prefix  
**Section labels (ALTIJD IN JE LEVEN):** `11px bold #6d747a`, tracking `1.2px`, uppercase  
**Life area row:** `px-[20px] py-[10px]`, color dot (12 px), emoji, bold label, checkmark  
**Category header:** `px-[20px] py-[12px]`, emoji, bold label, count badge, collapse arrow  
**Count badge:** `#cceaff` bg, `#72a8f9` text, `11px bold`, pill  
**Sub-items:** `pl-[36px] pr-[20px] py-[8px]`, emoji + label + `+` button in `#72a8f9`  
**Dividers:** 1 px `#eceeee` full-width lines  

### 7.13 Pie Chart Area

```
bg: white  |  border: 1px solid #eceeee  |  radius: 24px  |  padding: 24px
```

- Title: `18px bold #191c1d` centered
- Pie chart SVG (480 px or 340 px)
- Center circle with "Mijn leven" label (`11px bold`)
- Segment labels: emoji + `11px bold white`
- Legend row: 10 px color dots + `12px regular #6d747a`
- Interaction hint banner: `#cceaff` bg, `12px radius`, 💡 icon, `13px #191c1d`

### 7.14 Educator Quote Bubble

```
bg: #72a8f9  |  bottom-border: 4px solid #72a8f9  |  radius: 16px
padding: px-[24px] pt-[24px] pb-[28px]
font: 20px regular white
shadow: 0 10px 15px -3px rgba(0,0,0,0.10)
tail: 16px rotated square on left side, #72a8f9 fill
```

Avatar: 128 px circular frame, white 4 px border, drop shadow.

### 7.15 Comparison Cards (Explanation Screen)

**Informeel (left):**
- `#d9ead3` bg, 1 px `rgba(0,0,0,0.05)` border, `16px` radius
- Heading: "INFORMELE CHAT", `24px bold #38761d`, tracking `1.2px`
- Phone UI mockup (dark rounded rectangle) + character

**Formeel (right):**
- `#667c78` bg, 1 px `rgba(0,0,0,0.05)` border, `16px` radius
- Heading: "FORMELE BRIEF", `24px bold white`, tracking `1.2px`
- Letter mockup (white card with gray placeholder lines) + character

### 7.16 Email Interface

Outer shell: `#f2f4f4` bg, `1px solid rgba(188,202,194,0.2)`, `32px` radius, shadow  
**Title bar:** `#e1e3e3` bg, traffic-light dots (12 px, red/green/green), "Nieuw Bericht" `12px Lexend SemiBold`  
**Body:** white bg  
**Fields (Aan, Onderwerp):** `Plus Jakarta Sans Bold 14px #3d4944` label, regular text, `rgba(188,202,194,0.2)` bottom divider  
**Textarea:** `16px Plus Jakarta Sans Regular rgba(188,202,194,0.4)` placeholder  
**Formatting bar:** `#f2f4f4` bg, formatting icons (bold, italic, list, attachment)

### 7.17 Informal Email Example Card

```
bg: #fffbeb  |  border: 1px solid #fde68a  |  radius: 16px  |  padding: 33px
transform: rotate(-1deg)  |  shadow: 0 10px 15px -3px rgba(0,0,0,0.10)
```

- Label: "INFORMELE E-MAIL", `14px bold #92400e`, tracking `1.4px`, uppercase
- Body: `16px italic Inria Sans #78350f`
- Corner badge: `#fef3c7` bg, rounded-bl, 64 px, contains warning icon

### 7.18 Requirements List Card

```
bg: #f2f3fd  |  border: 1px solid #c1c6d5  |  radius: 16px  |  padding: 25px
gap: 24px
```

- Header: blue info icon (20 px) + `16px bold #181c22`
- Items: red ✕ icon (14 px) + `16px regular #414753`

### 7.19 Footer

```
bg: #f2f4f4  |  border-radius: 64px top-left/top-right
padding: px-[48px] py-[40px]
layout: space-between (logo | links | copyright)
```

- Logo: 121 × 48 px
- Links: "Privacy", "Contact" — `16px bold #191c1d`
- Copyright: `16px regular #6d747a` — "© 2026 Klaar voor Middelbaar"

---

## 8. Iconography

Icons are SVG assets served as image files. Sizes observed:
- Drag handle: 5 × 8 px
- Step icons (book, pencil, star, flag): ~12–16 px
- Arrow right: 19 × 16 px
- Checkmark: `✓` character, colored per life area
- `+` add button: bold Inria Sans `14–16px`

---

## 9. Motion & Interaction Hints

- Active step on progress bar has a pulsing ring: `box-shadow: 0 0 0 4px rgba(78,142,243,0.20)`
- Nav sub-bar uses `backdrop-blur(2px)` for frosted glass effect
- Sander mascot appears to "talk" via the speech bubble (static in design, animated in implementation)
- Drag-and-drop affordance: pills have subtle shadow + drag-handle icon

---

## 10. Screens Summary

| Node | Name | Type | Description |
|---|---|---|---|
| `1:2` | Woordsoorten Sorteren | Assignment | Drag-and-drop word sorting (Informeel vs Formeel) |
| `12:2` | Mijn levensgebieden | Assignment | Pie chart (full-width, no character) |
| `21:249` | Mijn levensgebieden | Assignment | Pie chart (with Sander character on left) |
| `72:2` | Uitleg: Formeel of Informeel? | Explanation | Theory page with comparison cards and start button |
| `73:161` | Formele e-mail schrijven | Assignment | Rewrite informal email into formal email |
