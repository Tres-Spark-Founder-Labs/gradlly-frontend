# Marketing rebuild: design spec

Phase 2. No code. Builds on [SURVEY.md](SURVEY.md) and the rulings of
20 October 2026.

## How the inputs are being used

**Copy** is `content-v1.md`, verbatim. Nothing is invented. Bracketed items
render as visible placeholders.

**The mockup is a guide, not a standard.** Per the instruction of 20 October,
this is an original design that takes its direction from
`mockups/desktop.png` and `mockups/mobile-hero.png` rather than a reproduction
of them. What carries over unchanged: the palette (verified below), the serif
display and humanist sans pairing, colour as product identity, and the idea
that the two products are drawn as connected. What is designed fresh: the
structure, the type system, the spacing, the radius hierarchy, and every
section's composition.

**Two readings recorded for correction.** Ruling 2 says the Gradlly OS page "is
rebuilt to content-v1.md and the mockup like every other section" and that
components with no place in `content-v1.md` are deleted. `content-v1.md`'s
navigation (§1) has no Gradlly OS item. So this spec builds **one page**, with
no preserved legacy page and no Gradlly OS nav item, and treats the earlier
instruction about a Gradlly OS nav link as withdrawn by ruling 2. Say so if that
is wrong; it is one nav item and one route either way.

---

## 1. Design plan

### Subject

A record-keeping product for UK regulated work. Continuo holds what a worker
has been confirmed able to do, and the checks that clear them to do it. Gradlly
AMS runs an apprenticeship and emits a Passport the apprentice keeps. The
vernacular is not SaaS. It is the register, the countersignature, the site card,
the DBS certificate, the ILR return: a claim is worth nothing until a named
person confirms it on a date with evidence attached.

The page's primary job is to make one idea land: proof that travels, instead of
proof rebuilt at every step.

### Colour

Six values, verified by sampling `mockups/desktop.png` (section 3).

| Role  | Hex       | Why                                                  |
| ----- | --------- | ---------------------------------------------------- |
| Navy  | `#13233A` | All display and body ink. The register's ink colour. |
| Teal  | `#0F5B5F` | Continuo, and only Continuo.                         |
| Brass | `#8C6420` | Gradlly AMS and the Passport, and only those.        |
| Paper | `#F3F4F1` | Page ground.                                         |
| White | `#FFFFFF` | Raised surfaces.                                     |
| Slate | `#4B5566` | Secondary ink.                                       |

Two tints, `#E3EEEC` (teal) and `#F3EBDC` (brass), for product-owned surfaces.

Colour carries product identity, so it is never spent on decoration. There are
no gradient washes anywhere in this design.

### Type

Two families, clearly distinct.

- **Newsreader** (OFL, variable) for display, headings, and the italic
  supporting line. A high-contrast editorial serif with ball terminals and a
  genuinely characterful italic.
- **Public Sans** (OFL, variable) for body, UI and buttons. The humanist face of
  the US Web Design System, drawn for civic interfaces. On the nose for a
  product about statutory checks, and it holds up at 13px where a display serif
  would not.

Both self-hosted via `next/font/local`. Provisional per Decision 5 (section 4).

### Layout concept: the spine

A single vertical rule runs down the left edge of the content column, from
below the hero to the footer. It is the only continuous element on the page,
and its colour says which product you are reading about: **teal** through
Continuo, **brass** through Gradlly AMS and the Passport, **hairline grey**
through the neutral sections. Where `content-v1.md` says the two products meet,
the spine is the thing that draws it.

This is the design's one idea. It does three jobs at once:

1. It encodes the central positioning claim. "Two products. Each works on its
   own," and "Works together when apprentices move into work" stop being
   sentences and become the shape of the page.
2. It replaces the labels. Because the spine's colour already tells you whose
   section you are in, the design needs no eyebrow above each heading, which is
   both a standing rule here and the commonest template tell.
3. It gives the page a left axis. Everything hangs from it. Content is **left
   aligned** throughout, with no centred blocks except the two full-bleed
   product plates.

```
DESKTOP 1440                                   MOBILE 390
┌──────────────────────────────────────┐      ┌─────────────────┐
│  nav                                 │      │ nav        [=]  │
├──────────────────────────────────────┤      ├─────────────────┤
│                                      │      │                 │
│  From trained                        │      │  From trained   │
│  to trusted.                         │      │  to trusted.    │
│  Skills you can prove.               │      │  Skills you     │
│                                      │      │  can prove.     │
│  body (60ch)   [Book a demo] [See]   │      │  body           │
│                                      │      │  [Book a demo]  │
│  ┌─teal plate──┐  ┌─brass plate───┐  │      │  [See how]      │
│  │ Continuo    │  │ Gradlly AMS   │  │      │  ┌─teal──────┐  │
│  └──────┬──────┘  └───────┬───────┘  │      │  └─────┬─────┘  │
│         └ ─ ─ ─ ─ ─ ─ ─ ─ ┘          │      │        ┊        │
├──────────────────────────────────────┤      │  ┌─brass─────┐  │
│┊ Proof gets rebuilt at every step.   │      │  └───────────┘  │
│┊                                     │      ├─────────────────┤
│┊ ───────── ───────── ─────────       │      │┊ Proof gets ... │
│┊ skills    evidence  apprentices     │      │┊ ─────────       │
├──────────────────────────────────────┤      │┊ skills          │
│┃ Continuo. Verified skills.          │      │┊ ─────────       │
│┃  (spine turns teal here)            │      │┊ evidence        │
```

### Principles

1. **Attestation is the unit.** Wherever the copy names who confirms something,
   the design shows that as structure: a claim, a hairline, the confirmer.
2. **Radius is hierarchy, not habit.** Plates 0, cards 10px, controls 6px,
   markers fully round. Nothing shares a radius by default.
3. **One shadow, used once.** The two hero plates sit on the page. Nothing else
   casts anything.
4. **Numbered markers only where there is a sequence**, which in this copy is
   exactly one place: How it works.
5. **Quiet everywhere the spine is loud.** Every other element is flat, ruled
   and left-aligned.

---

## 2. Self-review against the generic defaults

The skill's calibration list, worked honestly. Three of these were in my first
pass and were revised.

**Trait 1, warm cream ground with a high-contrast serif display.** The guide is
close to this and I cannot change the palette, which is brand. **What I
changed:** the serif does not do the work alone. The memorable element is the
spine, a structural device; the serif is set at weight 400 rather than 700, so
it reads as a document rather than as a luxury masthead, and the ground is
`#F3F4F1`, a cool grey paper, not `#F4F1EA` cream. I also refused the gradient
wash behind the hero that the existing page uses (`Hero.jsx:10`).

**Trait 4, the SaaS-card kit.** My first pass had the Continuo sub-sections
(Verified checks, A compliance evidence engine, Continuous not one-off) as three
identical rounded cards with the same shadow. That is the kit exactly.
**Changed to:** three ruled columns hanging from the spine, no border, no
shadow, separated by a 1px hairline, with the group heading sitting in the left
margin. Cards survive in only two places, where the content genuinely is a set
of parallel objects: the four ways to work with Continuo, and the four portals.

**Trait 5, template chrome.** My first pass had tracked-out small labels above
each section heading, carrying `content-v1.md`'s "For employers and agencies in
regulated work" line. **Changed to:** that line is sentence case, 15px, in the
product colour, set _below_ the heading as a readership note rather than above
it as an eyebrow. Also removed from the plan: middle-dot meta strings, a
monospace face for small labels, any `→` after a link, and `#0B0B0B` style
tinted near-blacks. Ink is `#13233A`, which is a colour, not a dodge.

**Trait 3, broadsheet.** I use hairline rules, so this needed care. **What
keeps it out:** the radius hierarchy above (cards at 10px are not broadsheet),
two saturated full-bleed plates, and no multi-column justified text anywhere.
Line length is capped at 68 characters.

**What I did not change:** the two-plate hero and the dotted connector between
them. Those come from the guide and they are the best idea in it.

**Chanel check, the one thing removed:** a small teal "verified" tick glyph that
I had planned before each confirmed bullet in the Continuo list. It was
decoration standing in for the attestation idea rather than expressing it, and
twenty of them would have been wallpaper. The bullets are plain; the attestation
idea lives in the structure instead.

---

## 3. Tokens

### Palette, verified

Sampled from `mockups/desktop.png` (2880x11800) by area. Every value given for
verification is confirmed exactly.

| Token          | Hex       | Share of mockup | Verified |
| -------------- | --------- | --------------- | -------- |
| `--paper`      | `#F3F4F1` | 45.24%          | yes      |
| `--white`      | `#FFFFFF` | 27.23%          | yes      |
| `--teal`       | `#0F5B5F` | 7.31%           | yes      |
| `--brass`      | `#8C6420` | 7.27%           | yes      |
| `--teal-tint`  | `#E3EEEC` | 5.04%           | yes      |
| `--brass-tint` | `#F3EBDC` | 3.72%           | yes      |
| `--navy`       | `#13233A` | 1.44%           | yes      |

Two further values are in the mockup and were not in the list to verify:

| Token     | Hex       | Share | Role          |
| --------- | --------- | ----- | ------------- |
| `--slate` | `#4B5566` | 0.38% | Secondary ink |
| `--rule`  | `#D6D9D4` | 0.06% | Hairline      |

One token is added by this spec and is not in the mockup:

| Token         | Hex       | Role                                           |
| ------------- | --------- | ---------------------------------------------- |
| `--brass-ink` | `#845E1E` | Brass for small text on a tint. See section 5. |

### Type scale

Fluid between the two ends with `clamp()`. Tracking in em.

| Level           | Mobile 390 | Desktop 1440 | Weight     | Tracking | Face        |
| --------------- | ---------- | ------------ | ---------- | -------- | ----------- |
| Display (h1)    | 40 / 1.05  | 64 / 1.02    | 400        | -0.02    | Newsreader  |
| Section (h2)    | 30 / 1.14  | 40 / 1.10    | 400        | -0.015   | Newsreader  |
| Plate head      | 26 / 1.15  | 34 / 1.12    | 400        | -0.015   | Newsreader  |
| Subhead (h3)    | 20 / 1.28  | 22 / 1.25    | 500        | -0.01    | Newsreader  |
| Lead, italic    | 19 / 1.40  | 24 / 1.35    | 400 italic | -0.005   | Newsreader  |
| Body            | 16 / 1.65  | 17 / 1.65    | 400        | 0        | Public Sans |
| Body small      | 15 / 1.60  | 15 / 1.60    | 400        | 0        | Public Sans |
| Readership note | 15 / 1.45  | 15 / 1.45    | 500        | 0        | Public Sans |
| Meta            | 13 / 1.50  | 13 / 1.50    | 500        | 0        | Public Sans |
| Control         | 16 / 1.00  | 16 / 1.00    | 600        | 0        | Public Sans |

Measure: body 68ch, italic lead 60ch (serif tolerates more but the lead is
short). Serif body is not used, so the longer-measure allowance does not apply.

### Spacing

4px base: `4 8 12 16 24 32 48 64 96 128 160`.

Section rhythm: 96 mobile, 128 at 768, 160 at 1440. Within a section, heading to
body 24, body to content 48, between sibling blocks 32.

### Container

| Breakpoint | Gutter | Content max |
| ---------- | ------ | ----------- |
| 390        | 20     | fluid       |
| 768        | 40     | fluid       |
| 1024+      | 64     | 1140        |

The spine sits in the gutter, 24px left of the content column, so text does not
indent around it.

### Radius

| Element                     | Radius | Why                               |
| --------------------------- | ------ | --------------------------------- |
| Product plates              | 0      | Edge-anchored plates, not objects |
| Cards                       | 10     | Held objects                      |
| Buttons, inputs, menu panel | 6      | Controls                          |
| Numbered markers            | 999    | Markers                           |

### Rules and borders

| Use         | Spec                                                   |
| ----------- | ------------------------------------------------------ |
| Spine       | 2px solid, product colour or `--rule`                  |
| Divider     | 1px solid `--rule`                                     |
| Card border | 1px solid `--rule`; on tint, the product colour at 20% |
| Focus ring  | 2px solid `--navy`, 2px offset; on plates, `--white`   |

### Shadow

One, used on the two hero plates only:
`0 1px 2px rgb(19 35 58 / 0.04), 0 8px 24px -12px rgb(19 35 58 / 0.14)`.

---

## 4. Fonts

Decision 5 applies: the repo names Poppins and JetBrains Mono in
`apps/main/assets/css/globals.css:14-15` but loads neither, and ruling 7
confirms they do not bind.

| Role                           | Face        | Licence | Delivery                                        |
| ------------------------------ | ----------- | ------- | ----------------------------------------------- |
| Display, headings, italic lead | Newsreader  | OFL 1.1 | `next/font/local`, variable woff2, subset latin |
| Body, UI, controls             | Public Sans | OFL 1.1 | `next/font/local`, variable woff2, subset latin |

Chosen over the obvious picks deliberately: Playfair Display is the default
display serif of generated pages, and Inter the default sans. Newsreader gives
the same editorial contrast with a distinctive italic, which this page needs
because the supporting line is italic. Public Sans is the civic-interface face,
which suits a product about statutory checks and stays legible at 13px.

**Provisional, pending designer confirmation.** The mockup's actual faces are
not named in any file in this repository, and these are a judgement about the
closest free, self-hostable match. Both are a one-line swap if the designer
names something else.

---

## 5. Contrast

Every pair, computed to WCAG 2.1 relative luminance. AA normal text needs 4.50,
AA large (24px, or 18.66px bold) needs 3.00.

| Ink \ Ground | Paper | White | Teal tint | Brass tint | Navy  | Teal | Brass |
| ------------ | ----- | ----- | --------- | ---------- | ----- | ---- | ----- |
| Navy         | 14.31 | 15.80 | 13.32     | 13.34      | n/a   | 2.02 | 2.98  |
| Slate        | 6.82  | 7.53  | 6.35      | 6.35       | 2.10  | 1.04 | 1.42  |
| Teal         | 7.09  | 7.83  | 6.60      | 6.61       | 2.02  | n/a  | 1.48  |
| Brass        | 4.80  | 5.30  | **4.47**  | **4.48**   | 2.98  | 1.48 | n/a   |
| White        | 1.10  | n/a   | 1.19      | 1.18       | 15.80 | 7.83 | 5.30  |
| Paper        | n/a   | 1.10  | 1.07      | 1.07       | 14.31 | 7.09 | 4.80  |

### The two failures, and the fix

**Brass on either tint fails AA for body text** at 4.47 and 4.48, as predicted.

The fix is one extra token, `--brass-ink: #845E1E`, used only for text below
24px sitting on a tint. It clears to **4.92** on both tints, and 5.28 on paper.

A smaller darkening does technically clear: `#89621F` reaches 4.63. It is
rejected because 0.13 of headroom survives no antialiasing, no opacity and no
rounding difference between engines. `#845E1E` is a 6% darkening, visually the
same brass, with 0.42 of margin.

**Navy on brass fails at 2.98**, below even the large-text threshold. So the
brass plate (the Passport) takes **white** ink at 5.30, never navy. The teal
plate also takes white, at 7.83. Recorded because 2.98 rounds to 3.0 and would
pass a careless check.

Everything else on a light ground passes AA for normal text. `--slate` is
capped at body size and never used below 15px.

---

## 6. Section map

The ten sections of `content-v1.md` against what is built.

| §   | Content                 | Built as                                                                                                             | Spine    |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Navigation              | Sticky bar: wordmark, five anchors, Sign in, Book a demo. Mobile: toggle to full panel                               | n/a      |
| 2   | Hero                    | Display, italic lead, body, two controls, two product plates joined by the dotted connector                          | starts   |
| 3   | The problem             | Three ruled columns, no cards                                                                                        | `--rule` |
| 4   | Continuo                | Heading, readership note, body; teal plate with the core statement and four bullets; three ruled columns; four cards | teal     |
| 5   | Gradlly AMS             | Heading, readership note, body; What it handles as a ruled list; four portal cards                                   | brass    |
| 6   | Apprenticeship Passport | Brass plate, white ink, four bullets                                                                                 | brass    |
| 7   | How it works            | Two numbered columns, teal and brass, then Better together as a single ruled note                                    | splits   |
| 8   | Who it's for            | Four audience rows, each tagged with its product colour                                                              | `--rule` |
| 9   | Book a demo             | Heading, body, five fields, privacy line                                                                             | `--rule` |
| 10  | Footer                  | Wordmark line, copyright with placeholder, six links                                                                 | ends     |

Anchors, per Phase 3 item 2: `#continuo`, `#gradlly-ams`, `#passport`,
`#how-it-works`, `#book-a-demo`.

Sections §4 "Four ways to work with Continuo" and §5 "Four portals" are the only
card grids. §7 is the only numbered content.

---

## 7. Designs for what the guide does not show

### 7a. Navigation, with Sign in

```
DESKTOP 1024+
┌────────────────────────────────────────────────────────────────┐
│ Gradlly    Continuo  Gradlly AMS  Passport  How it works        │
│                                        Sign in  [Book a demo]   │
└────────────────────────────────────────────────────────────────┘
  ^wordmark  ^anchors, slate, navy on hover, 2px teal underline
             on :focus-visible            ^text link  ^navy fill
```

Sticky, `--paper` at 92% with a backdrop blur, a 1px `--rule` bottom border that
appears only once scrolled past 48px. Height 72.

Sign in is a quiet text link, navy, 500, no border, placed before Book a demo
with 24px between them. It is a `<details>`-free plain link to the portal
chooser: because there are four portals and `content-v1.md` names none of them
in the nav, the link goes to `#sign-in`, a small panel in the footer listing all
four, each `href` read from `NEXT_PUBLIC_{EMPLOYER,PROVIDER,APPRENTICE,FLOW}_URL`

- `/login`. One link in the nav, four destinations in one place, no dropdown to
  trap focus.

```
MOBILE 390, closed                MOBILE 390, open
┌─────────────────────┐          ┌─────────────────────┐
│ Gradlly        [≡]  │          │ Gradlly        [✕]  │
└─────────────────────┘          ├─────────────────────┤
                                 │ Continuo            │
                                 │ ─────────────────── │
                                 │ Gradlly AMS         │
                                 │ ─────────────────── │
                                 │ Apprenticeship      │
                                 │ Passport            │
                                 │ ─────────────────── │
                                 │ How it works        │
                                 │ ─────────────────── │
                                 │ Sign in             │
                                 ├─────────────────────┤
                                 │ [ Book a demo     ] │
                                 └─────────────────────┘
```

The open panel is a full-width sheet below the bar, not a full-screen takeover,
so the wordmark and close control stay where the toggle was. Items are 22px
Newsreader, left aligned, 56px rows divided by hairlines. Book a demo is a
full-width navy button pinned at the bottom of the sheet.

Behaviour: `aria-expanded` on the toggle, `aria-controls` to the panel.
Focus moves to the first item on open. Tab cycles within the panel and wraps.
Escape closes. On close, focus returns to the toggle. Body scroll locks while
open. The panel is `inert` when closed, not merely hidden.

### 7b. Mobile layout, every section below the hero

Single column throughout, 20px gutters, spine at 8px from the left edge.

```
§3 problem        §4 Continuo          §5 AMS              §7 how it works
┌──────────────┐  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│┊ Proof gets  │  │┃ Continuo.   │    │┃ Gradlly AMS │    │┊ How it works│
│┊ rebuilt ... │  │┃ Verified    │    │┃ runs the    │    │┊             │
│┊             │  │┃ skills...   │    │┃ apprentice..│    │┊ How Continuo│
│┊ ──────────  │  │┃             │    │┃             │    │┊ works       │
│┊ Skills and  │  │┃ For employ..│    │┃ For training│    │┊ ① Verify    │
│┊ checks are  │  │┃ (teal note) │    │┃ (brass note)│    │┊   skills... │
│┊ proved ...  │  │┃             │    │┃             │    │┊ ② Share     │
│┊             │  │┃ body        │    │┃ body        │    │┊ ③ Onboard   │
│┊ ──────────  │  │┃             │    │┃             │    │┊ ④ Stay      │
│┊ Evidence is │  │┃┌teal plate─┐│    │┃ What it     │    │┊             │
│┊ pieced ...  │  │┃│ Verified  ││    │┃ handles     │    │┊ How AMS     │
│┊             │  │┃│ skills,   ││    │┃ ──────────  │    │┊ works       │
│┊ ──────────  │  │┃│ not       ││    │┃ Enrolment   │    │┊ ① Enrol     │
│┊ Apprentices │  │┃│ claimed   ││    │┃ ──────────  │    │┊ ② Deliver   │
│┊ finish ...  │  │┃│ ones      ││    │┃ Off-the-job │    │┊ ③ Reach     │
└──────────────┘  │┃│ • bullet  ││    │┃ ──────────  │    │┊ ④ Complete  │
                  │┃└───────────┘│    │┃ ...         │    │┊             │
   rules replace  │┃             │    │┃             │    │┊ ──────────  │
   the desktop    │┃ Verified    │    │┃┌card───────┐│    │┊ Better      │
   column gaps    │┃ checks      │    │┃│ Provider  ││    │┊ together    │
                  │┃ ──────────  │    │┃└───────────┘│    └──────────────┘
                  │┃ A compliance│    │┃┌card───────┐│
                  │┃ evidence... │    │┃│ Employer  ││    numbered markers
                  │┃ ──────────  │    │┃└───────────┘│    appear here only
                  │┃ Continuous, │    │┃  (1 col)    │
                  │┃ not one-off │    └──────────────┘
                  │┃             │
                  │┃┌card──┐     │    §6 Passport
                  │┃│Self- │     │    ┌──────────────┐
                  │┃│serve │     │    │┃┌brass plate┐│
                  │┃└──────┘     │    │┃│ The       ││
                  │┃  (2 col)    │    │┃│ Appren... ││
                  └──────────────┘    │┃│ Passport. ││
                                      │┃│ white ink ││
                                      │┃│ • bullet  ││
                                      │┃└───────────┘│
                                      └──────────────┘
```

Grid changes by breakpoint: problem 1 / 3 / 3. Continuo ruled columns 1 / 3 / 3.
Four ways 2 / 2 / 4. Portals 1 / 2 / 2. How it works 1 / 2 / 2. Who it's for
1 / 1 / 2. Plate bullets 1 / 1 / 2.

### 7c. Who it's for

Four rows, not four cards. Each row is the audience, its sentence, and the
product it belongs to, with a colour bar at the row's left edge.

```
DESKTOP                                               MOBILE
┌────────────────────────────────────────────────┐   ┌──────────────┐
│ Built for each side of the journey.            │   │ Built for    │
│                                                │   │ each side... │
│ ▌ Employers and agencies     Hire and deploy   │   │              │
│ ▌ in regulated work          on verified ...   │   │ ▌ Employers  │
│ teal                         Continuo          │   │ ▌ and agen.. │
│ ──────────────────────────────────────────────  │   │   Hire and   │
│ ▌ Training providers         Run delivery ...  │   │   deploy ... │
│ brass                        Gradlly AMS       │   │   Continuo   │
│ ──────────────────────────────────────────────  │   │ ──────────── │
│ ▌ Levy-paying employers      See every ...     │   │ ▌ Training   │
│ ▌ and SMEs                   Gradlly AMS       │   │ ▌ providers  │
│ ──────────────────────────────────────────────  │   └──────────────┘
│ ▌▌ Apprentices and workers   A free, ...       │
│ teal+brass                   Passport, Continuo│
└────────────────────────────────────────────────┘
```

Desktop is a two-column row: audience on 4 columns, sentence on 7. The product
name from `content-v1.md`'s parentheses becomes the row's attribution, set in
Meta, in the product colour. The last row carries both bars because the copy
names both products, which is the colour rule doing real work rather than
being applied for consistency.

### 7d. Book a demo, all states

Five fields per Decision 3, stacked, full width, on a `--white` card at radius
10 within a `--paper` section.

```
┌──────────────────────────────────────┐   ERROR on a field
│ See Gradlly with your own programme. │   ┌────────────────────┐
│                                      │   │ Work email         │
│ Whether you hire into regulated      │   │ ┌────────────────┐ │
│ roles or run apprenticeships, ...    │   │ │ sam@          │ │ 2px navy
│                                      │   │ └────────────────┘ │ border,
│ ┌──────────────────────────────────┐ │   │ Enter a work email │ navy text
│ │ Name                             │ │   │ address so we can  │ below,
│ │ [                              ] │ │   │ reply.             │ aria-
│ │ Work email                       │ │   └────────────────────┘ describedby
│ │ [                              ] │ │
│ │ Organisation                     │ │   SENDING
│ │ [                              ] │ │   [ Sending…          ]
│ │ I'm interested in                │ │    disabled, 1px navy
│ │ ( ) Continuo (verified skills)   │ │    rule animating L to R
│ │ ( ) Gradlly AMS and the          │ │
│ │     Apprenticeship Passport      │ │   SENT, replaces the form
│ │ ( ) Both                         │ │   ┌────────────────────┐
│ │                                  │ │   │ Request sent.      │
│ │ [ Request a demo              ]  │ │   │ We will reply to   │
│ │                                  │ │   │ the address you    │
│ │ We use your details only to      │ │   │ gave.              │
│ │ reply to this request. Privacy   │ │   └────────────────────┘
│ └──────────────────────────────────┘ │    teal 2px top rule
│                                      │
│ Or email us at [CONTACT EMAIL]       │
└──────────────────────────────────────┘
```

"I'm interested in" is a radio group in a `<fieldset>` with a visible
`<legend>`, not a select: three options, all worth seeing at once, and a native
group needs no JavaScript.

The honeypot is a text input named `role`, wrapped in a div positioned off
screen with `aria-hidden="true"` and `tabindex="-1"`, never `display:none`
(some autofill still fills hidden fields, and `display:none` is the pattern bots
check for). Label reads "Leave this field empty".

Error summary: on a failed submit, a single block above the first field lists
each problem as a link to its field, and receives focus. Per-field messages are
`aria-describedby`. No colour-only signalling: every error state has a 2px
border, an icon-free text message, and `aria-invalid`.

`[CONTACT EMAIL]` renders as that literal string in Meta type, in `--slate`,
with a `title` explaining it is a placeholder. It is in
`LAUNCH-CHECKLIST.md`.

### 7e. Footer

```
DESKTOP                                               MOBILE
┌────────────────────────────────────────────────┐   ┌──────────────┐
│ Gradlly. From trained to trusted.              │   │ Gradlly.     │
│                                                │   │ From trained │
│ Continuo   Gradlly AMS   Apprenticeship        │   │ to trusted.  │
│ Passport   Privacy   Terms   Accessibility     │   │              │
│                                                │   │ Continuo     │
│ Sign in: Employer · Provider · Apprentice      │   │ Gradlly AMS  │
│          · Flow                                │   │ ...          │
│ ──────────────────────────────────────────────  │   │              │
│ © 2026 Gradlly. [REGISTERED COMPANY DETAILS]   │   │ Sign in      │
└────────────────────────────────────────────────┘   │ Employer     │
                                                     │ Provider     │
  navy ground, paper ink at 14.31:1                  │ ...          │
                                                     └──────────────┘
```

The footer is the one navy-ground region, which closes the page where the spine
ends. `#sign-in` lands here, so the nav's Sign in link scrolls to a real
destination with all four portals listed. The four URLs come from env; a portal
whose env var is unset is not rendered, rather than rendered as a dead link.

The middle dots between the sign-in links are the one place a separator list is
right, because they are four peers of one kind. Every other list on the page is
ruled, not dotted.

---

## 8. Motion

Ruling 3. No scroll-reveal and no entrance animation on any section. Every
item below is inside `@media (prefers-reduced-motion: no-preference)`; under
`reduce`, durations collapse to `0.01ms` and the end state applies immediately.

### 8a. The one orchestrated moment: hero on load

| Step | Element           | Properties                               | Delay | Duration | Easing                     |
| ---- | ----------------- | ---------------------------------------- | ----- | -------- | -------------------------- |
| 1    | Display headline  | `opacity 0 to 1`, `translateY 10px to 0` | 0     | 420ms    | `cubic-bezier(.2,.7,.2,1)` |
| 2    | Italic lead       | same                                     | 110ms | 380ms    | same                       |
| 3    | Body and controls | same                                     | 210ms | 360ms    | same                       |
| 4    | Teal plate        | `opacity 0 to 1`, `translateY 12px to 0` | 320ms | 400ms    | same                       |
| 5    | Brass plate       | same                                     | 380ms | 400ms    | same                       |
| 6    | Dotted connector  | `opacity 0 to 1` only                    | 700ms | 60ms     | linear                     |

Total 760ms. Transform and opacity only, so nothing lays out twice and CLS is
unaffected: every element occupies its final box from first paint, and only
`opacity` and `transform` change. No element starts at `display:none`.

### 8b. Interaction

| Trigger                    | What moves            | Properties                                         | Duration   | Easing                     |
| -------------------------- | --------------------- | -------------------------------------------------- | ---------- | -------------------------- |
| Nav anchor hover or focus  | Underline             | `text-decoration-color` transparent to teal        | 120ms      | `ease-out`                 |
| Button hover               | Fill                  | `background-color` 8% darker                       | 140ms      | `ease-out`                 |
| Button active              | Fill                  | `background-color`, no transform                   | 60ms       | `ease-out`                 |
| Card hover or focus-within | Left spine            | `border-left-width 2px to 3px`                     | 120ms      | `ease-out`                 |
| Menu open                  | Sheet                 | `opacity 0 to 1`, `translateY -8px to 0`           | 180ms      | `cubic-bezier(.2,.7,.2,1)` |
| Menu close                 | Sheet                 | reverse                                            | 140ms      | `ease-in`                  |
| Field focus                | Border                | `border-color`, `box-shadow` ring                  | 100ms      | `ease-out`                 |
| Submit pressed             | Button label and rule | label swap, rule `scaleX 0 to 1`                   | 900ms loop | `linear`                   |
| Validation failed          | Message block         | `opacity 0 to 1`, `height 0 to auto` via grid rows | 160ms      | `ease-out`                 |
| Send succeeded             | Form to confirmation  | cross-fade `opacity`                               | 200ms      | `ease-out`                 |
| Anchor click               | Scroll                | `scroll-behavior: smooth`                          | ~420ms     | browser                    |

No card lift, no scale on hover, no shadow transition. The card's hover state
thickens its spine, which is the page's own device rather than the generic lift.

---

## 9. Removed fabricated proof

Ruling 1. Every item below is deleted, not replaced with a placeholder, and no
proof slot is left behind for it. Where this empties a component of its reason
to exist, the component goes too (ruling 2); `content-v1.md` has no section that
any of them serve.

### Attributed testimonials

| File:line                              | Removed                                                      |
| -------------------------------------- | ------------------------------------------------------------ |
| `components/Home/constants.js:74-77`   | "Sarah H.", Head of L&D, Manufacturing Group, and quote      |
| `components/Home/constants.js:82-85`   | "Marcus K.", Quality Manager, Training Provider, and quote   |
| `components/Home/constants.js:90-93`   | "Jamie O.", Data Technician Apprentice, and quote            |
| `components/Home/constants.js:98-101`  | "Alison T.", Corporate L&D Director, NHS Trust, and quote    |
| `components/Home/constants.js:106-109` | "Raj P.", Founder, Digital Marketing Agency, and quote       |
| `components/Home/constants.js:114-117` | "Nikki C.", Programme Director, Training Provider, and quote |
| `components/Home/Testimonials.jsx`     | Whole file. `content-v1.md` has no testimonials section      |

### Figures stated as fact

| File:line                                 | Removed                                              |
| ----------------------------------------- | ---------------------------------------------------- |
| `components/Home/Stats.jsx:2`             | "£3.5B", "Levy unclaimed every year"                 |
| `components/Home/Stats.jsx:4`             | "£0", "Cost to SME via FlowPortal"                   |
| `components/Home/Problem.jsx:8`           | "2,700+"                                             |
| `components/Home/Problem.jsx:13`          | "£3.5B expires unspent"                              |
| `components/Home/Problem.jsx:15`          | "£3.5B"                                              |
| `components/Home/Problem.jsx:22`          | "£45B"                                               |
| `components/Home/FlowPortal.jsx:17`       | "100%", "ESFA compliance"                            |
| `components/Home/FlowPortal.jsx:28`       | "4 AI apprenticeship programmes, 100% online"        |
| `components/Home/FlowPortal.jsx:29`       | "£0 cost to learner, fully levy-funded from day one" |
| `components/Home/FlowPortal.jsx:32`       | "£5M", "Levy to transfer Year 2"                     |
| `components/Home/FlowPortal.jsx:33`       | ">80%", "EPA pass rate"                              |
| `components/Home/Mockups.jsx:48`          | "£142,400"                                           |
| `components/Home/Mockups.jsx:50`          | "£18"                                                |
| `components/Home/Mockups.jsx:77`          | "94%", "OTJ completion"                              |
| `components/Home/Mockups.jsx:209,214,218` | "£8,000", "£8,000", "£0"                             |
| `components/Home/constants.js:14`         | "£142K", "avg levy balance visible"                  |
| `components/Home/constants.js:31`         | "76%", "avg Ofsted score improvement"                |
| `components/Home/constants.js:42`         | "20% statutory OTJ target" claim                     |
| `components/Home/constants.js:49`         | "87%", "EPA gateway completion rate"                 |
| `components/Home/constants.js:62,66`      | "£0 cost to SME learner", "100% levy-funded"         |
| `components/Home/constants.js:230`        | "98%" on-time completion "vs 62% industry average"   |
| `components/Home/constants.js:235`        | "3.2×"                                               |
| `components/Home/constants.js:240`        | "18pts"                                              |
| `components/Home/constants.js:245`        | "£0" cost, "100% levy-funded"                        |
| `components/Home/constants.js:250`        | "48hrs"                                              |
| `components/Home/constants.js:255`        | ">8.5" target NPS, "top 10% benchmark in UK EdTech"  |

### Prices, which `content-v1.md` does not contain

| File:line                          | Removed                                                    |
| ---------------------------------- | ---------------------------------------------------------- |
| `components/Home/constants.js:128` | "£200"                                                     |
| `components/Home/constants.js:145` | "£30"                                                      |
| `components/Home/constants.js:180` | "£80"                                                      |
| `components/Home/Pricing.jsx`      | Whole file. There is no pricing section in `content-v1.md` |

### Components deleted for having no section in `content-v1.md`

`CTA.jsx`, `FlowPortal.jsx`, `Marquee.jsx`, `Mockups.jsx`, `Pricing.jsx`,
`Results.jsx`, `Stats.jsx`, `Testimonials.jsx`, `Why.jsx`, `constants.js`,
`Reveal.jsx` (the scroll-reveal wrapper, which ruling 3 forbids).

`Hero.jsx`, `Nav.jsx`, `Problem.jsx`, `Portals.jsx`, `HowItWorks.jsx` and
`Footer.jsx` are replaced rather than edited: the new copy, structure and tokens
leave nothing of the originals. Git history is the restore point.

**Checked, and the list above is complete.** `Results.jsx` and `Why.jsx` hold no
literals of their own: each is two imports and a render
(`Results.jsx:1-2`, `Why.jsx:1-2`), drawing from `RESULTS` and `WHY` in
`constants.js:228` and `:195`. `WHY` contains no figures. `RESULTS` contains
six, all of which are in the table above; the first pass had caught three of
them, and reading the block rather than grepping it found "3.2×", "18pts" and
"48hrs" as well.

---

## 10. Carried to LAUNCH-CHECKLIST.md

- `[CONTACT EMAIL]` in §9.
- `[REGISTERED COMPANY DETAILS]` in §10.
- `/privacy`, `/terms`, `/accessibility` ship as visible placeholder pages.
- Fonts are provisional pending designer confirmation (section 4).
- Canonical base: **unverified**. `gradlly.co.uk` is not recorded anywhere in
  this repository. It was observed from the Vercel API on 20 October 2026
  (`vercel alias ls`), which is not a file in the repo, and `apps/main` has no
  `.env` file. Per ruling 5 the canonical base is read from
  `NEXT_PUBLIC_SITE_URL` and no domain is hardcoded.
- `content-v1.md`'s own Before launch list, all seven items, two of which bear
  on copy that is already written: whether the Passport-to-Continuo handoff is
  on the roadmap (§7 "Better together" and the last §6 bullet both assert it),
  and whether Continuo really describes skills against recognised occupational
  standards (§4 asserts it).
- Env vars, with no values: `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_EMPLOYER_URL`, `NEXT_PUBLIC_PROVIDER_URL`,
  `NEXT_PUBLIC_APPRENTICE_URL`, `NEXT_PUBLIC_FLOW_URL`,
  `NEXT_PUBLIC_ANALYTICS_ENABLED`, `DEMO_REQUEST_TO_EMAIL`.
