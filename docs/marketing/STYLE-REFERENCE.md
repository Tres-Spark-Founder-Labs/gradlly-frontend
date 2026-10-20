# Gradlly — Style Reference

> Clinical white, one teal signal. A compliance instrument for people who buy under procurement scrutiny.

**Theme:** light

---

## Who this is drawn for

This matters more than any token below, and the first two attempts at this site
ignored it.

The people who sign for Gradlly are not founders browsing on a phone. They are
a registered manager at a care group, a principal contractor's compliance lead,
a staffing agency's head of resourcing, a training provider's quality manager,
a levy-paying employer's L&D and finance teams. They buy against a procurement
checklist, they are audited by Ofsted and the ESFA, and the cost of being wrong
is an enforcement notice rather than a bad quarter.

What that means for the design:

- **The site is evidence, not persuasion.** It is read the way a specification is
  read: scanned for whether the thing does what it claims, then read closely.
- **Confidence is shown by restraint.** One accent colour, one typeface, no
  gradients, no illustration, no motion that is not answering an action. A page
  that tries hard looks like a product that has to.
- **Density is credibility.** This audience is comfortable with a lot of
  information well organised. Big empty hero sections with four words in them
  read as having nothing to say.
- **Nothing may be claimed that is not confirmed.** The product's whole
  proposition is attestation, so a site carrying invented figures would
  contradict itself. There are no statistics, no logos and no testimonials on
  this site until there are real ones.

Nearest in register: Brex and Ramp for the instrument feel, Stripe for
typographic confidence, GOV.UK for the seriousness without borrowing its
austerity.

---

## Tokens — Colours

One accent. Teal is the only colour that appears on an interactive surface.
Brass identifies a product and never becomes a button, because an accent that is
scattered stops meaning anything.

| Name       | Value     | Token                | Role                                                                                                                                                               |
| ---------- | --------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Paper      | `#ffffff` | `--color-paper`      | Page canvas and card surfaces. The dominant surface on every page.                                                                                                 |
| Fog        | `#f3f4f1` | `--color-fog`        | The only alternate section surface. Bands a section off without a border. Never used for cards sitting on itself.                                                  |
| Navy       | `#13233a` | `--color-navy`       | Primary text, headings, and the dark frame at the top and bottom of every page.                                                                                    |
| Abyss      | `#0b1526` | `--color-abyss`      | Footer and the announcement bar. Deeper than Navy so the two dark bands are distinguishable where they meet content.                                               |
| Graphite   | `#4b5566` | `--color-graphite`   | Body paragraphs and sub-head descriptions. The workhorse grey for anything that is not a heading.                                                                  |
| Steel      | `#767f8f` | `--color-steel`      | Captions, helper text, placeholders, and reference data labels. Never used for a paragraph.                                                                        |
| Mist       | `#d6d9d4` | `--color-mist`       | Hairline borders, dividers and input outlines. 1px only.                                                                                                           |
| Teal       | `#0f5b5f` | `--color-teal`       | **The single functional accent.** Primary buttons, active tab indicators, focus marks, and the Continuo product mark. One per region.                              |
| Teal Wash  | `#e3eeec` | `--color-teal-wash`  | A quiet surface behind a single highlighted block per page. Decorative only, never a CTA.                                                                          |
| Brass      | `#8c6420` | `--color-brass`      | **Product identification only.** The 4px mark and small tag that says a thing belongs to Gradlly AMS or the Apprenticeship Passport. Never a fill, never a button. |
| Brass Ink  | `#845e1e` | `--color-brass-ink`  | Brass for text below 24px. Brass itself is 4.47:1 on a wash and fails AA; this is 4.92:1.                                                                          |
| Brass Wash | `#f3ebdc` | `--color-brass-wash` | The AMS equivalent of Teal Wash. Same rule.                                                                                                                        |

### Contrast, measured

| Ink on Paper        | Ratio | Verdict                                      |
| ------------------- | ----- | -------------------------------------------- |
| Navy                | 15.80 | AA, AAA                                      |
| Graphite            | 7.53  | AA, AAA                                      |
| Steel               | 4.68  | AA normal text                               |
| Teal                | 7.83  | AA, AAA                                      |
| Brass               | 5.30  | AA                                           |
| Brass on Brass Wash | 4.48  | **fails**, use Brass Ink at 4.92             |
| Navy on Brass       | 2.98  | **fails even large**, white on brass is 5.30 |
| Paper on Navy       | 15.80 | AA, AAA                                      |
| Paper on Abyss      | 17.74 | AA, AAA                                      |

---

## Tokens — Typography

### Inter Tight — everything

One family. Character comes from scale, tracking and composition, not from a
second voice. Inter Tight is drawn tight, so the compressed engineered feel
comes from the typeface rather than from negative tracking fighting a face that
does not want it.

- **Substitute:** Inter, with `letter-spacing` reduced by a further 0.005em
- **Weights:** 400, 500, 600
- **Numerals:** `font-variant-numeric: tabular-nums` globally. This site puts
  reference data in the open and figures that change width between rows read as
  careless.
- **Role:** Display, headings, body, navigation, buttons, inputs, labels. Weight
  600 for display and headings, 500 for UI chrome and emphasis, 400 for body.
  Nothing is set at 700: at display sizes it reads as shouting, and this
  audience is not persuaded by volume.

### IBM Plex Mono — reference data only

Used for UKPRNs, dates, counts, statuses and the page numbers. Not a label
style, not a decorative treatment, and never a heading. The rule is strict
because a monospace face applied to small labels for texture is the commonest
piece of borrowed chrome in this category.

- **Substitute:** JetBrains Mono or ui-monospace
- **Weights:** 400, 500
- **Sizes:** 12px, 13px
- **Letter spacing:** 0
- **Role:** Reference data and nothing else. If the string is not something you
  could look up, it is not set in this face.

### Type scale

| Role       | Size             | Line height | Tracking | Weight | Token               |
| ---------- | ---------------- | ----------- | -------- | ------ | ------------------- |
| display    | clamp 48 to 76px | 1.0         | -0.035em | 600    | `--text-display`    |
| heading-lg | clamp 34 to 48px | 1.08        | -0.03em  | 600    | `--text-heading-lg` |
| heading    | clamp 26 to 34px | 1.14        | -0.025em | 600    | `--text-heading`    |
| heading-sm | 21px             | 1.25        | -0.02em  | 600    | `--text-heading-sm` |
| lead       | clamp 18 to 21px | 1.5         | -0.015em | 400    | `--text-lead`       |
| body       | 16px             | 1.6         | -0.01em  | 400    | `--text-body`       |
| body-sm    | 15px             | 1.55        | -0.01em  | 400    | `--text-body-sm`    |
| caption    | 13px             | 1.45        | -0.005em | 400    | `--text-caption`    |
| ref        | 13px             | 1.4         | 0        | 500    | `--text-ref`        |

Body measure is capped at 68 characters. Display is capped at 18 characters, so
a headline breaks into two or three lines rather than running the width of a
1320px container.

---

## Tokens — Spacing and shape

**Base unit:** 4px. **Density:** comfortable, tending dense in lists.

### Spacing scale

`4 8 12 16 24 32 40 56 72 96 128`

| Use                      | Value                 |
| ------------------------ | --------------------- |
| Section padding, mobile  | 56px top and bottom   |
| Section padding, desktop | 96px top and bottom   |
| Card padding             | 28px, 32px at desktop |
| List row padding         | 20px vertical         |
| Element gap              | 12px to 16px          |
| Heading to body          | 20px                  |
| Body to content          | 40px                  |

### Radius

| Element                 | Value  | Token           |
| ----------------------- | ------ | --------------- |
| Cards, inputs, buttons  | 12px   | `--radius-md`   |
| Tags and chips          | 6px    | `--radius-sm`   |
| Product marks and rules | 0      | `--radius-none` |
| Avatars and status dots | 9999px | `--radius-full` |

Never 8px or 10px as a compromise. A component group shares one radius.

### Layout

- **Page max width:** 1320px
- **Content column:** 1120px for text-led pages
- **Gutters:** 20px, 32px at 768, 48px at 1280
- **Section gap:** 0. Sections are separated by surface change or a 1px Mist
  rule, not by empty space.

### Elevation

There is none. Cards are defined by Paper on Fog contrast and a 1px Mist
hairline. The only exception is a floating element detached from the canvas
(a cookie dialog or a modal), which takes
`0 1px 2px rgb(19 35 58 / 0.06), 0 12px 32px -12px rgb(19 35 58 / 0.18)`.

---

## Components

### Announcement bar

Full-bleed Abyss, 40px tall, Paper text at caption size weight 500, one inline
Teal link. Dismissible. Used for a single time-bound message and nothing else.

### Primary navigation

Paper background, 1px Mist bottom border that appears only once the page has
scrolled past 48px. Height 68px. Wordmark left. Page links centre-left at
body-sm weight 500 Navy, the current page at weight 600 with a 2px Teal
underline. Right: "Sign in" as a plain Navy text link, then "Book a demo" as the
one filled Teal button.

### Teal button, filled

Teal fill, Paper text at body-sm weight 600, 12px radius, 12px by 24px padding.
One per region. This is the only saturated fill in the system.

### Outline button

Transparent fill, 1px Navy border, Navy text at body-sm weight 600, 12px radius,
12px by 24px padding. Sits beside the filled button as the lower-commitment
option.

### Text link

Navy, 1px underline at 3px offset in Mist, which goes Navy on hover. Inline body
links are never Teal: Teal means "this is the action".

### Capability card

Paper fill, 1px Mist border, 12px radius, 28px padding. Title at heading-sm
Navy. Body at body-sm Graphite. A 4px product mark on the left edge when the
card belongs to one product. No shadow, no hover lift; hover takes the border to
Navy.

### Attestation row

The system's signature component, and the one that says what the product is.
A claim at heading-sm Navy, a 1px Mist rule, and under it the confirmation at
ref size Steel, prefixed by a 4px product mark. Used anywhere the copy names who
confirms something.

### Specification list

A ruled list, not cards. Each row 20px vertical padding with a 1px Mist top
border, first row only taking a border above and the last a border below. Where
the rows are a sequence, a two-digit number in Plex Mono at ref size Steel sits
in a 40px column to the left.

### Comparison table

Used for the two products. Paper, 1px Mist outer border, 12px radius, header row
on Fog with ref-size Steel labels, body rows separated by 1px Mist. Product
columns are identified by a 4px mark in the header cell, never by a tinted
column.

### Tab set

A row of body-sm weight 500 Graphite labels with 16px padding, the active one in
Navy weight 600 with a 2px Teal indicator beneath. The indicator slides between
tabs over 180ms. Content below changes without the page moving.

### Field

Paper fill, 1px Mist border, 12px radius, 12px by 14px padding, body size Navy.
Placeholder in Steel. Label above at caption size Steel. On focus the border
goes Navy and a 2px Teal ring sits outside it. On error the border goes Navy at
2px with the message below at caption size Navy, never red alone.

### Dark call to action band

Full-bleed Navy, 96px vertical padding. Heading at heading-lg Paper, body at
lead size Paper at 75% opacity, one Paper-filled button with Navy text. The
inverse of the page, which is what makes it read as the end of an argument.

### Footer

Full-bleed Abyss, 72px vertical padding. Wordmark, then three link columns with
ref-size Steel headers and body-sm Paper-at-80% links, then the portal sign-in
list, then a 1px rule and the copyright line at caption size.

---

## Do's and Don'ts

### Do

- Use Teal for exactly one purpose: the primary action, the active indicator,
  and the Continuo product mark. One filled Teal element per region.
- Keep Brass to product identification. A 4px mark or a small tag, never a fill
  and never a button.
- Set every heading at weight 600 and let tracking do the rest. Display runs at
  -0.035em, which is what makes it read as engineered.
- Use `tabular-nums` everywhere. This site shows reference data in the open.
- Separate sections by surface change or a 1px Mist rule. Never by empty space
  alone.
- Cap body measure at 68 characters and display at 18, so a headline breaks
  rather than stretching across a 1320px container.
- Use Graphite for paragraphs and Steel for captions. Steel is never used for
  anything longer than a line.
- Put real density on the page. Four words in a tall hero reads as having
  nothing to say to this audience.

### Don't

- Never introduce a third colour. Teal and Brass carry meaning; a green, a red
  or a purple added for a state breaks the contract.
- Never use Brass as a background behind Navy text. It is 2.98:1, which fails
  even the large-text threshold, and it rounds to 3.0 where a careless check
  passes it.
- Never use a drop shadow for a card. Paper on Fog and a 1px Mist hairline are
  the elevation system.
- Never set a heading at 700, and never set display in a serif. The first draft
  of this site used an editorial serif and it gave a compliance product a
  literary voice.
- Never use a monospace face for texture. Plex Mono is for strings you could
  look up and nothing else.
- Never mix radii inside a component group. Buttons, inputs and cards are all
  12px. Tags are 6px. Rules and product marks are 0.
- Never put a figure, a logo or a quotation on this site that is not real and
  attributable. The product is attestation; inventing proof contradicts it.
- Never animate on scroll. Motion answers an action or a page load, and nothing
  else.

---

## Glass, bento and mockups

Added 21 October, and they override three earlier rules in this document. The
rules they replace are kept above rather than deleted, so the record shows what
changed and when.

### Glass

Translucent surfaces, used on **tiles and mockup frames only**. Not on buttons,
which need an edge you can trust, and not on a body surface, which would cost
legibility this audience will not forgive.

```css
.tile {
  border: 1px solid rgb(255 255 255 / 0.7);
  background-color: rgb(255 255 255 / 0.62);
  backdrop-filter: blur(20px) saturate(140%);
  box-shadow: var(--shadow-tile);
}
```

The border is paper, not Mist. Against a translucent fill a grey hairline reads
as grime.

**This supersedes "there is no elevation".** Glass needs a shadow or it has no
relationship to what is behind it. Two are defined: `--shadow-tile` at rest and
`--shadow-glass` on hover, both tight and low-opacity rather than the soft grey
blur that marks a template.

Glass also needs something to refract, which is what the washes are for: two
radial fields in the product colours at 15% opacity, blurred 90px, sitting
behind content and never over it. **This supersedes "no gradients".** They carry
no information, so they are `aria-hidden`.

### Bento

A tile grid where span encodes importance. One dark tile per grid carries the
section's conclusion; the rest are glass. Tiles are 24px radius, which is the
one radius above 12px in the system and exists because a mockup frame inside a
12px tile looks pasted on.

Grid: `lg:grid-cols-3` with the lead tile at `lg:col-span-2`. Gap 16px, tighter
than the old 40px card padding, because a bento reads as one object and wide
gutters break it into separate cards again.

### Mockups

Drawn in markup, not shipped as images: sharp at any density, nothing to
download, correctable in a line when the interface changes.

**They carry no figures, no names and no dates.** Where a value would sit there
is a neutral block. This is not a stylistic choice: the mockups these replaced
carried £142,400, 94% and £8,000 inside simulated dashboards, which reads as a
screenshot of real data, and that is the fabricated proof this site had stripped
from it. A mockup shows the _shape_ of the product. The moment it shows a
measurement it is a claim.

Three exist: a skills record with its confirmation lines, a cohort with progress
drawn as a bar rather than stated, and a Passport with its entries.

---

## Surfaces

| Level | Name                   | Value                 | Purpose                                                                      |
| ----- | ---------------------- | --------------------- | ---------------------------------------------------------------------------- |
| 0     | Paper                  | `#ffffff`             | The page. The dominant surface everywhere.                                   |
| 1     | Fog                    | `#f3f4f1`             | The one alternate band, for section-level contrast without a border.         |
| 2     | Teal Wash / Brass Wash | `#e3eeec` / `#f3ebdc` | One highlighted block per page, identified to a product.                     |
| 3     | Navy                   | `#13233a`             | The dark frame: nav underlay at scroll, and the closing call to action band. |
| 4     | Abyss                  | `#0b1526`             | Announcement bar and footer. The bookends.                                   |

---

## Motion

| Trigger           | What moves                                                    | Duration            | Easing                      |
| ----------------- | ------------------------------------------------------------- | ------------------- | --------------------------- |
| Page load         | Heading, then lead, then actions. Opacity and 10px translate. | 380ms, 90ms apart   | `cubic-bezier(.16,.8,.3,1)` |
| Hover on a button | Fill darkens 8%                                               | 140ms               | `ease-out`                  |
| Hover on a card   | Border Mist to Navy                                           | 140ms               | `ease-out`                  |
| Tab change        | Indicator slides                                              | 180ms               | `cubic-bezier(.16,.8,.3,1)` |
| Field focus       | Border and ring                                               | 100ms               | `ease-out`                  |
| Menu open         | Panel opacity and 8px translate                               | 180ms in, 140ms out | `cubic-bezier(.16,.8,.3,1)` |
| Form submitting   | Label change and a 1px progress rule                          | 900ms loop          | `linear`                    |

Nothing animates on scroll. Nothing animates a property that triggers layout, so
cumulative layout shift is structurally zero rather than measured low. Under
`prefers-reduced-motion: reduce` every element is forced to its end state rather
than having animation switched off, which would leave anything animating from a
hidden start invisible.

---

## Imagery

No photography and no illustration. The product has no photogenic object, the
audience is not moved by a stock meeting room, and an invented dashboard
screenshot is a fabricated claim with a frame around it.

What carries the page instead: the attestation row, the specification list, the
comparison table, and type at scale. When real product screenshots exist they
sit in a 12px-radius Paper frame with a 1px Mist border and no shadow, cropped
to the one thing they are illustrating.

Customer logos appear only when there are customers, rendered in Steel
monochrome in a single row on a Fog band.

---

## Agent prompt guide

Quick reference:

- background `#ffffff`, alternate `#f3f4f1`
- text `#13233a`, secondary `#4b5566`, caption `#767f8f`
- border `#d6d9d4`
- primary action `#0f5b5f`
- product marks: Continuo `#0f5b5f`, Gradlly AMS and Passport `#8c6420`

1. _Hero._ Paper background, 1320px container, 48px gutters. Heading at clamp
   48 to 76px Inter Tight weight 600, `#13233a`, tracking -0.035em, line-height
   1.0, max 18 characters per line. Lead below at clamp 18 to 21px weight 400
   `#4b5566`. Two buttons: filled `#0f5b5f` with white text at 15px weight 600,
   12px radius, 12px by 24px padding; and outline with a 1px `#13233a` border.

2. _Attestation row._ Claim at 21px weight 600 `#13233a`. A 1px `#d6d9d4` rule
   below it at 16px. Confirmation under that at 13px weight 500 `#767f8f`,
   preceded by a 4px by 12px block in the product's colour.

3. _Capability card._ Paper fill, 1px `#d6d9d4` border, 12px radius, 28px
   padding, no shadow. Title 21px weight 600 `#13233a`, body 15px weight 400
   `#4b5566`. Hover takes the border to `#13233a` over 140ms.

4. _Specification list._ Ruled rows, 20px vertical padding, 1px `#d6d9d4` top
   border on every row and a bottom border on the last. Sequence numbers in IBM
   Plex Mono 13px `#767f8f` in a 40px left column.

5. _Dark call to action._ Full-bleed `#13233a`, 96px vertical padding. Heading
   at clamp 34 to 48px weight 600 white, body at 21px white at 75%, one white
   button with `#13233a` text.

---

## Quick start

```css
@theme {
  /* Surfaces and ink */
  --color-paper: #ffffff;
  --color-fog: #f3f4f1;
  --color-navy: #13233a;
  --color-abyss: #0b1526;
  --color-graphite: #4b5566;
  --color-steel: #767f8f;
  --color-mist: #d6d9d4;

  /* The single accent, and the product marks */
  --color-teal: #0f5b5f;
  --color-teal-wash: #e3eeec;
  --color-brass: #8c6420;
  --color-brass-ink: #845e1e;
  --color-brass-wash: #f3ebdc;

  /* Type */
  --font-sans: var(--font-inter-tight), system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;

  --text-display: clamp(3rem, 1.9rem + 4.6vw, 4.75rem);
  --text-display--line-height: 1;
  --text-display--letter-spacing: -0.035em;

  --text-heading-lg: clamp(2.125rem, 1.75rem + 1.6vw, 3rem);
  --text-heading-lg--line-height: 1.08;
  --text-heading-lg--letter-spacing: -0.03em;

  --text-heading: clamp(1.625rem, 1.45rem + 0.75vw, 2.125rem);
  --text-heading--line-height: 1.14;
  --text-heading--letter-spacing: -0.025em;

  --text-heading-sm: 1.3125rem;
  --text-heading-sm--line-height: 1.25;
  --text-heading-sm--letter-spacing: -0.02em;

  --text-lead: clamp(1.125rem, 1.05rem + 0.3vw, 1.3125rem);
  --text-lead--line-height: 1.5;
  --text-lead--letter-spacing: -0.015em;

  --text-body: 1rem;
  --text-body--line-height: 1.6;
  --text-body--letter-spacing: -0.01em;

  --text-body-sm: 0.9375rem;
  --text-body-sm--line-height: 1.55;
  --text-body-sm--letter-spacing: -0.01em;

  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.45;
  --text-caption--letter-spacing: -0.005em;

  --text-ref: 0.8125rem;
  --text-ref--line-height: 1.4;

  /* Shape */
  --radius-sm: 6px;
  --radius-md: 12px;
  --spacing: 0.25rem;
}
```
