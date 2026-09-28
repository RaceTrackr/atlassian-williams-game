# Card art brief — rules for generating the 48 card images

A ruleset to hand to ChatGPT so every card in `public/assets/cards/` looks like it came from the
same deck. Read §1–§3 once, then work through §6 card by card.

The card ids and names are listed in [`public/assets/cards/README.txt`](../public/assets/cards/README.txt).
Filename = card id, e.g. `drv-senna.png`.

---

## 1. The single most important step: lock the style with a reference image

Text prompts alone will drift — card 30 will not match card 3. So:

1. Generate **one hero card first** (use `car-fw14b`, it has the most defined subject).
2. Iterate on that one until it looks right. This is your style anchor.
3. For **every** card after that, attach the anchor image to the prompt and open with:

   > Match the art style, palette, lighting, line weight and framing of the attached reference
   > image exactly. Same illustration technique, same background treatment. Only the subject
   > changes.

4. Every ~10 cards, put the newest card next to the anchor and check they still belong together.
   If they've drifted, go back to the anchor — not the most recent card.

Work in **one continuous chat** so the model keeps the style in context. Starting a new chat means
starting the drift again.

---

## 2. Technical specs (non-negotiable)

| Spec | Value |
|---|---|
| Aspect ratio | **3:4 portrait** |
| Size | 1024×1365 (or the closest portrait size available) |
| Format | PNG |
| Text in image | **None.** No names, no numbers, no words. The app draws all text |
| Logos / sponsors | **None.** No real sponsor marks, team logos or trademarks |
| Background | Fully filled to the edges — no transparency, no white border, no drop shadow |
| Framing | No card frame, border, rounded corners or badge — the app draws the frame |

That last one matters: the app already puts a rarity border, a rating badge and a name plate on
top. Art that includes its own frame will look like a card inside a card.

---

## 3. The safe zone (this is why compositions fail)

The same image is displayed at **three different crops**, all centre-cropped:

- 3:4 portrait in the collection grid
- 1:1 square in squad slots
- 16:10 landscape in the card detail view

So anything outside the **central horizontal band (middle ~47% of the height)** can be cut off.

```
┌─────────────────────┐
│  atmosphere only    │  ← cropped away in the detail view
├─────────────────────┤
│                     │
│   SUBJECT LIVES     │  ← the central band: keep the subject, face,
│      HERE           │     helmet, car body entirely inside this
│                     │
├─────────────────────┤
│  darker, low detail │  ← the frosted name plate sits over this
└─────────────────────┘
```

Two rules follow:

1. **Keep the whole subject inside the central band.** Top and bottom are for atmosphere —
   sky, track surface, gradient, motion blur.
2. **The bottom ~22% must be visually quiet and darker** — no faces, no key detail, no bright
   highlights. A translucent name plate blurs over it, and busy art makes the name unreadable.

---

## 4. Locked style block

Paste this at the end of **every** card prompt, unchanged:

> Style: flat geometric vector illustration, bold and graphic. Limited palette of 4–6 flat colour
> areas with hard edges. Simple 2–3 tone shading, no photorealism, no textures, no lens flare, no
> 3D render look. One subtle background gradient wash only. Confident thick outlines. Strong
> silhouette readable at 100px wide. Colour palette: deep racing blue #0072CE, near-black #0A0A0A,
> clean white #FFFFFF, with #C8102E red used sparingly as a single accent. Dark background,
> subject lit from the upper left. Centred composition, generous margins, no text anywhere, no
> logos, no card frame or border.

**Why flat:** the app is flat design, and flat art survives being shrunk to a 79px squad slot.
Photoreal art turns to mush at that size.

---

## 5. Depicting real people — read before the driver cards

The drivers, team principals and chassis in this project are **real, historical people and cars**.
Image models will refuse, or produce unflattering wrong-looking faces, if you ask for a named real
person's likeness. Both outcomes are bad — the second is worse.

**Rule: never ask for a named person's face.** Ask for the *role* instead, using these substitutions:

| Card type | Depict this | Never |
|---|---|---|
| Driver | A racing helmet, visor down, in profile or three-quarter — no visible face. Or a driver seated in the cockpit from the front, helmet on, visor reflecting the track | The person's face, or their name in the prompt |
| Team Principal | A figure on the pit wall from behind or in silhouette, headphones on, monitors glowing. Anonymous, backlit | A recognisable face |
| Fictional staff | Faces are fine — these people are invented. Stylised flat portraits, three-quarter view | Photorealism |

Describe helmets by **colour and pattern only**, never by whose they are. Example: "a white racing
helmet with a bold yellow band and green chevrons over the crown" — not the driver's name.

Same for liveries: describe era-appropriate **colour blocking** ("navy, white and yellow blocks
with a red keyline") and never name or depict a sponsor.

---

## 6. Prompt templates by card type

Replace the `[bracketed]` parts. Always append the §4 style block and attach the anchor image.

### Driver cards (11)

> A racing helmet in sharp three-quarter view, visor down and reflecting a blurred track. The
> helmet is [colour/pattern description]. Behind it, an abstract [era] racing backdrop of angled
> speed lines. Helmet centred and filling the middle of the frame, bottom of the image fading to
> dark. No face visible, no text.

Helmet cues by era: 1980s cards get warmer, simpler two-tone patterns; 1990s cards get sharper
geometric splits; 2000s cards get more complex multi-panel designs.

### Car cards (6)

> A [era] Formula 1 car in [view], rendered as a flat side-profile illustration. [Silhouette
> description]. Plain colour-blocked livery in [colours] with no sponsor logos or numbers. Set
> against an abstract dark backdrop with a single sweeping motion arc behind the car.

Era silhouette cues — get these right and the cards teach the history:

| Card | Era cue |
|---|---|
| `car-fw07b` | 1980 ground-effect: slim cigar body, tall airbox-free profile, huge sidepod skirts, exposed suspension |
| `car-fw08` | 1982: short, stubby, high nose, wide low sidepods |
| `car-fw11b` | 1987 turbo era: low flat nose, large turbo intakes, chunky rear wing |
| `car-fw14b` | 1992: raised nose cone, sleek slim body, high rear wing, refined and modern for its time |
| `car-fw18` | 1996: raised nose, grooveless slicks, tall airbox above the driver, compact |
| `car-fw26` | 2004: distinctive twin-tusk "walrus" nose, tall narrow body, complex winglets |

### Part cards (10)

> An isolated Formula 1 [part name] component floating centred against a dark technical backdrop
> with faint blueprint grid lines. Three-quarter view, clean industrial form, carbon-dark surface
> with a single [blue/red] accent edge. Studio-lit, no background clutter, no text.

Keep all ten parts at the **same camera angle and scale** so they read as a matched set.

### Staff cards — fictional (17)

> A stylised flat portrait of a [role] at a Formula 1 team, three-quarter view, head and shoulders
> centred. Wearing dark team kit with a [department colour] accent. Background is a simple flat
> [department colour] field with a subtle geometric shape behind the head. Calm, confident
> expression. No text, no logos.

Department accent colours — this is how a player reads the department at a glance:

| Department | Accent |
|---|---|
| Engineering | `#0072CE` blue |
| Pit Crew | `#FF8A00` orange |
| Media | `#9B5DE5` purple |
| Performance | `#00C48C` green |

Vary the invented people meaningfully across age, gender and ethnicity — this set is meant to show
that a motorsport team is more than drivers.

### Staff cards — Team Principal (4, real people)

> A silhouetted figure on a Formula 1 pit wall seen from behind, wearing headphones, facing a bank
> of glowing timing screens. Backlit, anonymous, no face visible. Deep red `#C8102E` accent
> lighting. Quiet and authoritative.

---

## 7. Rarity

**Do not** encode rarity in the artwork — the app draws the rarity border, badge and the gold
Legend glow. Art that bakes in its own gold frame will clash with it.

One permitted nudge: Legend cards may have a slightly more dramatic backdrop (stronger rim light,
deeper contrast). Keep the palette and technique identical.

---

## 8. QA checklist before saving each file

- [ ] Subject fully inside the central band — survives a square and a 16:10 centre crop
- [ ] Bottom 22% is dark and quiet
- [ ] No text, numbers, logos or sponsor marks anywhere
- [ ] No card frame, border or drop shadow
- [ ] No recognisable real person's face
- [ ] Reads clearly when shrunk to ~100px wide (zoom out to check — this catches most failures)
- [ ] Sits beside the anchor image without looking like a different deck
- [ ] Saved as `<card-id>.png` exactly as listed in `README.txt`

---

## 9. Other assets

Same style block applies.

| File | Brief |
|---|---|
| `backgrounds/a1-main.png` | Calm, near-abstract. Dark blue-to-black gradient, faint track geometry. Very low contrast — UI sits on top of it. 390×844 portrait |
| `backgrounds/a2-battle.png` | High energy. Red and black, strong diagonal speed streaks. Still low-contrast enough for white text. 390×844 |
| `components/b1-logo.png` | Abstract geometric mark, square, transparent background. Not a real team logo |
| `components/b4-car-illustration.png` | Generic flat side-profile F1 car, transparent background |
| `components/b5-driver-silhouette.png` | Anonymous helmet-and-shoulders silhouette, transparent background |
| `components/b8-pack-closed.png` | Closed foil card pack, portrait 3:4, blue with a red keyline |
| `components/b8-pack-burst.png` | Same pack mid-burst, light exploding outward |

Anything missing falls back to a coloured placeholder, so you can drop files in one at a time and
watch the app fill in.
