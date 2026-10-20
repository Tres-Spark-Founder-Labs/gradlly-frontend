# Gradlly — Style Reference

> Warm editorial. Cream surfaces, oversized light serif, olive for contrast, terracotta for action.

**Theme:** light. **Visual reference:** kindsight.io.

Gradlly's content, terminology, brand name, information architecture and
features are unchanged. Only the visual language is taken from the reference.
None of Kindsight's wording, product names, imagery or data appears here.

---

## Who this is drawn for

Registered managers at care groups, compliance leads at principal contractors,
heads of resourcing at staffing agencies, quality managers at training
providers, and the L&D and finance teams at levy-paying employers. They buy
against a procurement checklist and are audited by Ofsted and the ESFA.

The warm editorial register suits them because it reads as considered rather
than as sold-at. What it must not become is decorative: every surface, colour
and piece of motion below has a job, and anything that does not is removed.

**Nothing may be claimed that is not confirmed.** The product's proposition is
attestation, so there are no statistics, no logos and no testimonials on this
site until there are real ones, and the product visuals carry no figures at all.

---

## Tokens — Colours

| Name       | Value     | Token                | Role                                                                                                  |
| ---------- | --------- | -------------------- | ----------------------------------------------------------------------------------------------------- |
| Cream      | `#faf5f1` | `--color-cream`      | The page and the navigation. The signature surface.                                                   |
| Linen      | `#fefffa` | `--color-linen`      | Cards and insets. Half a step warmer than cream, which is the only thing holding a card off the page. |
| Sand       | `#e5e1d6` | `--color-sand`       | Secondary section bands, and muted blocks inside product visuals.                                     |
| Olive      | `#3d4128` | `--color-olive`      | Selective dark surface, one per page, and the Continuo product mark.                                  |
| Ink        | `#0e0f0a` | `--color-ink`        | Primary text, borders, focus ring.                                                                    |
| Ink soft   | `#4a4c42` | `--color-ink-soft`   | Body paragraphs and section notes.                                                                    |
| Ink muted  | `#6b6d61` | `--color-ink-muted`  | Captions, eyebrows, helper text. Never a paragraph.                                                   |
| Hairline   | `#e3ddd4` | `--color-hairline`   | 1px dividers and card borders. Deliberately low contrast.                                             |
| Terracotta | `#de7653` | `--color-terracotta` | **Primary action**, and the Gradlly AMS and Passport mark.                                            |
| Coral      | `#e7573d` | `--color-coral`      | Button hover, and occasional outlined detail.                                                         |
| Chartreuse | `#e1f079` | `--color-chartreuse` | The accent underline, text selection, and focus on olive. Never body text.                            |

No blue. No colour outside this set.

### Product colour, carried across

Colour identifies a product, and always has on this site. The previous palette
used teal for Continuo and brass for Gradlly AMS, and neither exists here, so
they are mapped rather than dropped: **Continuo takes olive, Gradlly AMS and the
Passport take terracotta.** Both are in the reference palette and both are
distinguishable at a 4px mark.

### Contrast, measured

| Pair                    | Ratio | Verdict                    |
| ----------------------- | ----- | -------------------------- |
| Ink on cream            | 17.77 | AAA                        |
| Ink soft on cream       | 8.07  | AAA                        |
| Ink muted on cream      | 5.56  | AA, AAA large              |
| Olive on cream          | 9.77  | AAA                        |
| Ink muted on sand       | 4.61  | AA normal text             |
| Linen on olive          | 10.53 | AAA                        |
| Linen on terracotta     | 3.06  | **large text and UI only** |
| Terracotta on cream     | 2.84  | **never, as text**         |
| Terracotta ink on cream | 5.51  | AA, AAA large              |
| Ink on chartreuse       | 15.52 | AAA                        |
| Ink on olive            | 1.82  | **never**                  |

Two of these set hard rules. The terracotta button takes linen text at 15px
weight 500, which is UI text and clears the 3:1 non-text threshold, and
terracotta is never used for a paragraph. And ink never appears on olive: olive
surfaces take linen, and focus on them is chartreuse.

A third rule came out of measuring rather than estimating: terracotta as a text
colour is 2.84:1 on cream and fails even the non-text threshold. Terracotta-
coloured text uses `--color-terracotta-ink` at `#975038` (5.51 on cream, 4.57 on
sand), and plain terracotta is a fill only. Measuring also caught ink-muted at
4.03:1 on sand, below AA, so it was darkened 8% to 4.61.

---

## Tokens — Typography

|           | Family                       | Role                                                                      |
| --------- | ---------------------------- | ------------------------------------------------------------------------- |
| Display   | Playfair Display, weight 400 | Page titles, hero headlines, section headings, card titles, the wordmark. |
| Interface | Inter                        | Body, labels, buttons, inputs, tables, captions.                          |

The reference uses Times Now and Founders Grotesk. Both are commercially
licensed, so the brief's stated fallbacks are used. Swapping either is one line
in `app/fonts.js`.

**The serif never carries dense copy, tables, labels or form controls.** It is
display type only. That is a rule from the brief and it is also what keeps the
page readable at 15px.

### Type scale

| Role    | Size              | Line height | Tracking | Family    |
| ------- | ----------------- | ----------- | -------- | --------- |
| display | clamp 44 to 112px | 0.95        | -0.03em  | serif 400 |
| title   | clamp 36 to 68px  | 1.0         | -0.028em | serif 400 |
| section | clamp 30 to 44px  | 1.06        | -0.025em | serif 400 |
| subhead | clamp 20 to 24px  | 1.22        | -0.02em  | serif 400 |
| lead    | clamp 18 to 21px  | 1.55        | -0.011em | sans 400  |
| body    | 17px              | 1.62        | -0.009em | sans 400  |
| body-sm | 15px              | 1.58        | -0.008em | sans 400  |
| caption | 13px              | 1.45        | 0        | sans 400  |

Display caps at 15 characters a line, body at 62, leads at 44. An oversized
serif needs the measure to stop it before the line runs out of breath.

### The accent

One meaningful word in a display headline, set italic with a hand-drawn
chartreuse underline beneath it.

Drawn as an SVG stroke, not a border: a straight 3px rule under a 112px serif
reads as a link underline. The path is uneven on purpose and sits behind the
glyphs, so a descender crosses it the way it would have crossed a pen line. It
draws left to right on load, once the headline has arrived.

**Once per page at most.** It is a brand gesture and it stops being one the
moment a second heading carries it. On the home page it is "trusted", because
the whole proposition turns on that word.

---

## Tokens — Spacing and shape

**Base:** 4px. Section rhythm 80px at mobile, 112 to 120px at desktop.

| Use                | Value                           |
| ------------------ | ------------------------------- |
| Page max width     | 1200px                          |
| Gutters            | 24px, 40px at 768, 48px at 1024 |
| Card padding       | 28px, 36px at desktop           |
| Heading to content | 64px                            |
| List row padding   | 24px vertical                   |

| Element                       | Radius |
| ----------------------------- | ------ |
| Buttons, inputs               | 10px   |
| Cards, panels, product frames | 24px   |
| Marks and bars                | full   |

### Elevation

Effectively none. Surfaces separate tonally, cream to linen to sand, with a 1px
hairline where an edge is needed. A shadow appears only where a product visual
overlaps something, which the brief permits and this build does not yet need.

---

## Components

**Primary button.** Terracotta fill, linen text at 15px weight 500, 10px radius,
28px by 14px padding. Hover goes coral. One primary per section.

**Secondary button.** Transparent, 1px ink border, ink text, same geometry.
Hover inverts to an ink fill.

**Text link.** Ink with a 1px underline at 5px offset in ink at 30%, going full
ink on hover. Never terracotta: terracotta means "this is the action".

**Card.** Linen on cream, 1px hairline, 24px radius, 28px padding, no shadow.

**Olive panel.** One per page. 24px radius, linen text, carrying the single
claim a section rests on. Not a page background.

**Attestation.** A claim at subhead in the serif, its detail in sans, then the
confirmation at caption size preceded by a 4px mark in the product's colour.
Gradlly's own recurring idea, kept through the restyle: the proposition is not
that something is true but that somebody confirmed it.

**Specification list.** Ruled rows, 1px hairline on top of each and below the
last. Numbered only where the rows genuinely are a sequence, which in this copy
is the two flows in How it works and nothing else. The numeral is in the serif.

**Product visual.** Linen frame, hairline, 24px radius, a caption bar with a
product dot. **No figures, no names, no dates.** Where a value would sit there
is a sand block. The visuals these replaced carried £142,400, 94% and £8,000
inside simulated dashboards, which reads as a screenshot of real data; this
brief forbids the same thing from the other direction.

**Navigation.** Cream, 1px hairline on scroll only, 68px tall. Wordmark left,
four items centre, Sign in as a text link, Book a demo as the terracotta button.

**Footer.** Olive, linen text: section links, portal sign-ins, legal, and the
copyright line with its placeholder.

---

## Motion

| Trigger      | What moves                                              | Duration                      | Easing                       |
| ------------ | ------------------------------------------------------- | ----------------------------- | ---------------------------- |
| Page load    | Eyebrow, headline, lead, body, actions, then the visual | 620ms each, 60 to 120ms apart | `cubic-bezier(.16,.8,.26,1)` |
| Page load    | The accent underline draws left to right                | 680ms at 760ms                | `cubic-bezier(.3,.8,.3,1)`   |
| Button hover | Terracotta to coral                                     | 200ms                         | `ease-out`                   |
| Link hover   | Underline opacity                                       | 200ms                         | `ease-out`                   |
| Field focus  | Border and ring                                         | 100ms                         | `ease-out`                   |
| Menu open    | Panel opacity and translate                             | 180ms in, 140ms out           | `cubic-bezier(.16,.8,.3,1)`  |

Nothing animates on scroll. Nothing animates a property that triggers layout, so
cumulative layout shift is structurally zero rather than measured low. Under
`prefers-reduced-motion: reduce` everything is forced to its end state rather
than switched off, which would leave anything animating from a hidden start
invisible.

---

## Do's and Don'ts

### Do

- Keep most of the site light and warm. Olive is one surface per page.
- Use terracotta for the action and nothing else. Coral is its hover.
- Keep chartreuse to the accent underline, selection and focus on olive.
- Let whitespace do the work: 80 to 120px between sections, and no extra
  dividers, cards or decoration added to fill a gap.
- Set display type at weight 400. The size and the tracking carry it.
- Keep the serif out of body copy, labels, tables and form controls.
- Separate surfaces tonally, cream to linen to sand, with a hairline where an
  edge is needed.

### Don't

- Never introduce blue, or any colour outside the palette above.
- Never put ink on olive. It is 1.82:1.
- Never use terracotta for body text or an inline link.
- Never put the accent underline on more than one heading per page.
- Never add a gradient, a glass surface or a soft drop shadow. The previous
  system used all three; this one separates by warmth.
- Never put a figure, a logo or a quotation on this site that is not real and
  attributable, and never put one inside a product visual.
- Never animate on scroll.

---

## Superseded

This replaced a navy, teal and brass system with glass tiles over gradient
washes, dated 20 October. The two share exactly one rule: colour identifies a
product. The rest, including the bento grid and the translucent surfaces, is
gone, because this brief asks for warm light surfaces, minimal cards, rare
shadows and no gradients.

`/gradlly-ams` is excluded from all of it. That route carries the original
approved design and is not restyled, by standing instruction.
