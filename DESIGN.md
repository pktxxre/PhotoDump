# Design System Document: The Analog Frontier

## 1. Overview & Creative North Star: "The Digital Field Journal"
This design system is built to reject the frantic, high-gloss nature of modern social feeds. Our Creative North Star is **The Digital Field Journal**. We are not building a "platform"; we are crafting a tactile, unhurried space for reflection.

To achieve this, the system breaks away from rigid, boxy templates. We embrace **Intentional Asymmetry**—where photos might offset from the central axis—and **Tonal Depth**, using color shifts rather than lines to define space. The goal is an interface that feels like a heavy-stock paper journal laid out on a wooden table in the golden hour.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the natural world: the deep chlorophyll of a forest, the sun-bleached sand of a desert trail, and the glow of a waning fire.

### The "No-Line" Rule
Standard UI relies on 1px borders to separate ideas. This system prohibits them. We define boundaries through **Subtle Tonal Transitions**.
- Use `surface-container-low` for the main page body.
- Use `surface-container` or `surface-container-high` for interactive elements or secondary modules.
- **Why:** This creates a soft-focus transition that feels organic, not engineered.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. An image card (`surface-container-lowest`) sits atop a gallery section (`surface-container-low`), which sits on the global `surface`. This "stacking" creates depth without clutter.

### The "Glass & Gradient" Rule
To add "soul" to digital elements:
- **Glassmorphism:** For floating navigation or over-photo labels, use `surface` at 70% opacity with a `24px` backdrop blur. This allows the colors of the user's photos to bleed into the UI.
- **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#173124) to `primary-container` (#2d4739). This mimics the natural depth found in evergreen needles.

---

## 3. Typography: The Human Touch
Our typography pairing balances the intellectual weight of a serif with the modern clarity of a geometric sans.

- **Display & Headlines (`notoSerif`):** These are our "Voice." Large, expressive, and warm. Use `display-lg` for trip titles to evoke the feeling of a book cover. The serif adds a sense of history and "granola" authenticity.
- **Body & Titles (`plusJakartaSans`):** These are our "Utility." Clean, highly legible, and friendly. We use `body-lg` for captions to ensure they feel like a personal letter.
- **Editorial Hierarchy:** Use high-contrast scaling. Pair a `display-md` title with a significantly smaller `label-md` date stamp to create professional, magazine-style layouts.

---

## 4. Elevation & Depth
We eschew the "material" drop shadow in favor of **Tonal Layering**.

- **The Layering Principle:** Rather than lifting a card with a shadow, lift it by changing its token. A `surface-container-lowest` card on a `surface-dim` background provides a natural, soft lift.
- **Ambient Shadows:** If an element must float (like a FAB), use an extra-diffused shadow: `offset: 0, 8px; blur: 24px; color: on-surface (8% opacity)`. This mimics soft, overcast daylight.
- **The "Ghost Border":** If accessibility requires a boundary, use `outline-variant` at 15% opacity. Never use 100% opaque lines.
- **Softness:** All containers must adhere to the `xl` (1.5rem) or `lg` (1rem) roundedness scale. Sharp corners are forbidden; they feel too "tech."

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), `on-primary` text, `full` roundedness.
- **Secondary:** `surface-container-highest` fill, `primary` text. No border.
- **Tertiary:** Transparent background, `primary` text with a `label-md` weight.

### Cards & Photo Presentation
- **The Golden Rule:** No dividers. Separate content using the Spacing Scale (minimum `24px` between elements).
- **Photo-First:** Use `surface-container-lowest` as a thin "polaroid" frame around high-quality images.
- **Interactive States:** On hover, a card should transition from `surface-container-lowest` to `surface-bright`.

### Inputs & Selection
- **Input Fields:** Use `surface-container-high` with `none` or `sm` roundedness for a slightly more "notepaper" feel. Use `plusJakartaSans` for input text.
- **Chips:** For tagging locations (e.g., "National Park"). Use `secondary-fixed` for the background and `on-secondary-fixed-variant` for text. These should look like small, sun-baked stones.
- **Checkboxes/Radios:** Use `primary` when selected. Use a soft `surface-dim` for unselected states to keep the UI "quiet."

### Contextual Components: "The Route Map"
- **The Trail Line:** Instead of a standard map line, use a dashed `outline` token with `2px` thickness to represent the unhurried nature of a road trip.

---

## 6. Do’s and Don’ts

### Do
- **Embrace White Space:** Give photos room to breathe. Use "wasteful" margins to create a premium, editorial feel.
- **Use "Granola" Logic:** If a color feels "neon" or "electric," it’s wrong. Stick to the muted, earthy tones provided.
- **Think Asymmetrically:** It’s okay if a caption is left-aligned while the image is slightly right-weighted. It feels more human.

### Don’t
- **No Hard Outlines:** Do not use `outline` at 100% opacity to box things in.
- **No Pure Blacks:** Always use `on-surface` (#1c1c18) for text. Pure black is too harsh for this "calm" system.
- **No Fast Animations:** Transitions should be slightly slower than the OS default (e.g., 300ms–400ms) with a soft `cubic-bezier` to emphasize the "unhurried" brand personality.