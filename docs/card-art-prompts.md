# ChatGPT prompts — batched grid method

## Why this method

ChatGPT gives you no seed control, and an attached reference image only *biases* the next
generation — it doesn't lock it. Over 48 separate generations the style will drift no matter how
the prompt is worded. That's a limitation of the tool, not the prompt.

But **everything inside a single generated image is perfectly consistent with itself.** So instead
of 48 generations, this is **9 generations** of multi-card grids, which you then slice into
individual files.

Resolution is fine for this app: a 3×2 grid at 1024×1024 gives ~341×455 per card, and the biggest
a card is ever displayed is ~150px wide.

**Workflow:**

1. Paste **Prompt 0** into a new chat.
2. Generate **Batch 1**. Iterate until you like it — this sets the style for everything.
3. For Batches 2–9, attach Batch 1's image and paste the prompt.
4. Slice each grid with `tools/slice-grid.html` (open it in a browser, drop the image in, pick the
   batch — it downloads every card correctly named).
5. Drop the files into `public/assets/cards/`.

If a chat starts producing worse results after a while, start a fresh chat, re-paste Prompt 0 and
re-attach the Batch 1 image.

---

## Prompt 0 — paste first, once

```
I'm generating artwork for a Formula 1 trading card game. I'll ask for GRIDS of multiple card
illustrations in one image, because everything in a single image stays consistent with itself.

For every image in this chat, follow these rules exactly:

GRID: Render the requested cells as a clean grid with NO gaps, NO gutters, NO borders and NO
dividing lines between cells. Each cell is a separate self-contained illustration that will be cut
out and used on its own. All cells must share identical style, palette, lighting direction, line
weight and background treatment.

STYLE (identical in every cell): Flat geometric vector illustration, bold and graphic. Limited
palette of 4-6 flat colour areas with hard edges. Simple 2-3 tone shading. No photorealism, no
texture, no lens flare, no 3D render look. Confident thick outlines. Strong silhouettes that stay
readable when shrunk to 120px wide.

PALETTE: deep racing blue #0072CE, near-black #0A0A0A, clean white #FFFFFF, red #C8102E as a
sparing accent. Dark backgrounds. Every cell lit from the upper left.

COMPOSITION IN EACH CELL: the subject sits centred in the middle of its cell with generous margins,
and must not touch the cell edges. The bottom fifth of every cell must be dark and visually quiet
with no important detail - a translucent name plate is laid over it later.

NEVER: any text, letters, numbers or words anywhere in the image. Any real-world logo, sponsor mark
or team branding. Any card frame, border or badge.

PEOPLE: never depict a recognisable real person. Drivers appear only as helmets with the visor down
and no face visible. Team principals appear only as anonymous backlit silhouettes. Only the
invented support-staff characters have faces.

Confirm you understand, then wait for my first batch.
```

---

## Batch 1 — CARS ← do this one first, it sets the style

**Grid: 3 columns × 2 rows, square image.** Slices to: `car-fw14b`, `car-fw18`, `car-fw07b`,
`car-fw11b`, `car-fw26`, `car-fw08`

```
A square image containing a 3x2 grid of six Formula 1 car illustrations, no gaps or borders between
cells. Every car is shown in flat side profile, facing left, centred in its cell, at the same scale
and the same eye level, on the same dark gradient background with a single sweeping motion arc
behind it. No logos, no numbers, no text.

Top row, left to right:
1. A 1992 car: raised nose cone, sleek slim body, high rear wing, slick tyres. Navy blue and white
   with yellow accent stripes.
2. A 1996 car: raised nose, tall airbox above the cockpit, compact body, slick tyres. Navy blue and
   white with a thin gold keyline.
3. A 1980 ground-effect car: slim cigar-shaped body, low flat nose, deep sidepod skirts along the
   floor, exposed suspension, wide slicks. White with navy and emerald green stripes.

Bottom row, left to right:
4. A 1987 turbo car: low flat nose, large turbo intakes on the sidepods, chunky rear wing, wide
   slicks. White with yellow and blue stripes.
5. A 2004 car: distinctive twin-tusk "walrus" nose with two separated prongs, tall narrow body,
   complex winglets, grooved tyres. White and navy with red accents.
6. A 1982 car: short stubby body, high blunt nose, wide low sidepods, exposed suspension, wide
   slicks. White with navy and green bands.
```

---

## Batch 2 — DRIVERS A

**Grid: 3 × 2, square.** Slices to: `drv-mansell`, `drv-prost`, `drv-senna`, `drv-jones`,
`drv-rosberg`, `drv-piquet`

```
Match the attached reference image's style, palette, line weight and background treatment exactly.

A square image containing a 3x2 grid of six racing helmet illustrations, no gaps or borders between
cells. Every helmet is in the same sharp three-quarter view facing left, visor down and reflecting a
blurred track, centred in its cell at identical scale and eye level, on the same dark background
with angled speed lines. No face visible in any cell. No text, no logos.

Top row, left to right:
1. White shell, bold red stripe front-to-back over the crown, navy trim along the base.
2. White shell, navy and pale-blue chevrons sweeping over the crown, thin red keyline.
3. Yellow shell, green and navy bands arcing over the crown.

Bottom row, left to right:
4. Royal blue shell, one broad white band over the crown, red stripe across the chin bar. Rounder
   1980-era helmet shape.
5. White shell, bold blue lightning flash down each side outlined in yellow. Early-1980s shape.
6. White shell, navy crown panel, three thin red stripes running back from the visor. Late-1980s
   shape.
```

---

## Batch 3 — DRIVERS B

**Grid: 3 × 2, square.** Slices to: `drv-hill`, `drv-villeneuve`, `drv-patrese`, `drv-montoya`,
`drv-boutsen`, *(cell 6 discarded)*

```
Match the attached reference image's style, palette, line weight and background treatment exactly.

A square image containing a 3x2 grid of six racing helmet illustrations, no gaps or borders between
cells. Same three-quarter view facing left, visor down, no face visible, identical scale and eye
level in every cell, same dark background with angled speed lines. No text, no logos.

Top row, left to right:
1. Navy blue shell with eight white blade shapes radiating outward from the top of the crown.
2. Midnight blue shell with angular white and red flashes across the temples. Mid-1990s shape.
3. White shell with a horizontal green, white and red band wrapping around the middle. Late-1980s
   shape.

Bottom row, left to right:
4. White shell with a bold diagonal split of yellow, blue and red across the crown. Angular
   early-2000s shape.
5. White shell with a vertical black, yellow and red band at each temple. Late-1980s shape.
6. Plain matte black helmet, no markings.
```

---

## Batch 4 — PARTS A

**Grid: 3 × 2, square.** Slices to: `prt-nose-blade`, `prt-nose-chisel`, `prt-rw-highdf`,
`prt-rw-lowdrag`, `prt-diff-double`, `prt-diff-stepped`

```
Match the attached reference image's style, palette and line weight exactly.

A square image containing a 3x2 grid of six isolated Formula 1 component illustrations, no gaps or
borders between cells. Every component floats centred in its cell at the same three-quarter viewing
angle, same scale and same lighting, against an identical dark background with faint blueprint grid
lines. Carbon-dark surfaces with a single bright blue accent edge. No text, no logos.

Top row, left to right:
1. A front nose cone, narrow and blade-like with a sharp pointed tip.
2. A front nose cone, blunt and chisel-shaped with a wide flat tip.
3. A rear wing assembly with a tall steeply angled main plane and twin endplates.

Bottom row, left to right:
4. A rear wing assembly with a shallow, flat, skinny main plane.
5. A rear diffuser with a complex double-deck structure of stacked channels and vertical strakes.
6. A rear diffuser with a simple single stepped channel and few strakes.
```

---

## Batch 5 — PARTS B

**Grid: 2 × 2, portrait 3:4.** Slices to: `prt-ut-active`, `prt-ut-plank`, `prt-sp-slim`,
`prt-sp-cooling`

```
Match the attached reference image's style, palette and line weight exactly.

A portrait 3:4 image containing a 2x2 grid of four isolated Formula 1 component illustrations, no
gaps or borders between cells. Same three-quarter viewing angle, scale and lighting in every cell,
same dark blueprint-grid background. Carbon-dark surfaces with a single red accent edge. No text,
no logos.

Top row, left to right:
1. An undertray floor panel, long and flat, with hydraulic actuator cylinders mounted along its
   spine.
2. An undertray floor panel, long and flat and completely plain, with a simple wooden skid plank
   down the centreline.

Bottom row, left to right:
3. A pair of sidepods, extremely slim and tightly undercut with a narrow inlet.
4. A pair of sidepods, bulky and wide with large open cooling inlets and louvred vent panels.
```

---

## Batch 6 — TEAM PRINCIPALS

**Grid: 2 × 2, portrait 3:4.** Slices to: `stf-tp-frank-williams`, `stf-tp-patrick-head`,
`stf-tp-claire-williams`, `stf-tp-james-vowles`

```
Match the attached reference image's style, palette and line weight exactly.

A portrait 3:4 image containing a 2x2 grid of four illustrations, no gaps or borders between cells.
Every cell shows an ANONYMOUS BACKLIT SILHOUETTE of a figure on a Formula 1 pit wall - no faces, no
identifying features, purely dark shapes against glowing screens. Deep red #C8102E accent lighting
in every cell, same dark background fading to black at the bottom. No text, no logos.

Top row, left to right:
1. A seated figure from behind, headphones on, facing a bank of glowing timing screens.
2. A figure leaning over a monitor bank, one hand on the desk, seen from behind at a slight angle.

Bottom row, left to right:
3. A figure standing with arms folded, headphones on, seen from behind against bright garage
   lighting.
4. A seated figure at a modern pit wall station with multiple glowing screens wrapping around them,
   seen from behind.
```

---

## Batch 7 — ENGINEERING STAFF

**Grid: 3 × 2, square.** Slices to: `stf-eng-01`, `stf-eng-02`, `stf-eng-03`, `stf-eng-04`,
`stf-eng-05`, `stf-eng-06`

```
Match the attached reference image's style, palette and line weight exactly.

A square image containing a 3x2 grid of six stylised flat portrait illustrations, no gaps or borders
between cells. Every portrait is head and shoulders, three-quarter view facing left, centred in its
cell at identical scale and eye level. Everyone wears a dark team jacket with a blue #0072CE accent
stripe. Every cell has the same flat deep blue background with a subtle geometric airflow-curve
shape behind the head, fading dark at the bottom. Calm, confident expressions. No text, no logos.

Top row, left to right:
1. A woman in her forties of South Asian descent, hair tied back.
2. A man in his early thirties, Scandinavian, fair hair, glasses.
3. A Black woman in her early thirties with short natural hair.

Bottom row, left to right:
4. A white man in his fifties, greying hair, short beard.
5. A woman in her late twenties, southern European, dark hair tied back.
6. A young South Asian man in his early twenties, slightly eager expression.
```

---

## Batch 8 — REMAINING STAFF (engineering, media, performance)

**Grid: 3 × 2, square.** Slices to: `stf-eng-07`, `stf-med-01`, `stf-med-02`, `stf-perf-01`,
`stf-perf-02`, *(cell 6 discarded)*

```
Match the attached reference image's style, palette, line weight and portrait framing exactly.

A square image containing a 3x2 grid of six stylised flat portrait illustrations, no gaps or borders
between cells. Same head-and-shoulders three-quarter view facing left, identical scale and eye level
in every cell. Background colour differs per cell as specified below, each with a subtle geometric
shape behind the head, fading dark at the bottom. No text, no logos.

Top row, left to right:
1. Flat BLUE #0072CE background. A Black woman in her late thirties with locs tied back, dark team
   jacket with a blue accent stripe.
2. Flat PURPLE #9B5DE5 background with a broadcast-wave shape behind the head. A Black woman in her
   late thirties, dark team polo with a purple accent, small camera over one shoulder, warm
   engaging expression.
3. Flat PURPLE #9B5DE5 background. A white man in his late twenties, Nordic, dark team polo with a
   purple accent, headphones around his neck.

Bottom row, left to right:
4. Flat GREEN #00C48C background with a heart-rate-line shape behind the head. A white woman in her
   forties, dark performance jacket with a green accent, stopwatch on a lanyard, precise analytical
   expression.
5. Flat GREEN #00C48C background. A Black man in his thirties, athletic build, dark team training
   top with a green accent.
6. Flat grey background, a plain featureless mannequin head.
```

---

## Batch 9 — PIT CREW

**Grid: 3 × 2, square.** Slices to: `stf-pit-01`, `stf-pit-02`, `stf-pit-03`, `stf-pit-04`,
`stf-pit-05`, `stf-pit-06`

```
Match the attached reference image's style, palette, line weight and portrait framing exactly.

A square image containing a 3x2 grid of six stylised flat portrait illustrations, no gaps or borders
between cells. Same head-and-shoulders three-quarter view facing left, identical scale and eye level
in every cell. Everyone wears a dark fireproof pit suit with an orange #FF8A00 accent stripe. Every
cell has the same flat orange #FF8A00 background with a subtle geometric wheel-nut shape behind the
head, fading dark at the bottom. No text, no logos.

Top row, left to right:
1. A Black man in his forties, pit helmet pushed back off his forehead, calm focused expression.
2. A Hispanic woman in her late twenties, athletic build, visor up on her pit helmet.
3. A white man in his fifties, Irish, weathered face, holding a wheel gun at his shoulder.

Bottom row, left to right:
4. A young East Asian person in their mid-twenties, tyre blanket draped over one arm.
5. A white woman in her thirties, powerfully built.
6. A young Black man in his early twenties, slight smile.
```

---

## App assets (4 more generations, not grids)

These are different shapes, so they can't be batched. Attach the Batch 1 image to each.

### `backgrounds/a1-main.png` + `backgrounds/a2-battle.png`

```
Match the attached reference's style and palette. Two vertical background images, each 9:19.5 tall
phone proportions, side by side in one image:

LEFT: calm. Deep blue #0072CE fading down into near-black, faint geometric track-layout lines, a
soft glow near the top.
RIGHT: high energy. Red #C8102E and near-black with strong diagonal speed streaks from the upper
left.

Both must be very dark, very low contrast and have no focal point - white interface text will be
laid over them. No text, no logos.
```

Slice this one down the middle by hand.

### `components/b8-pack-closed.png` + `components/b8-pack-burst.png`

```
Match the attached reference's style and palette. One landscape image split into two equal halves,
no border between them, showing the same trading card pack twice:

LEFT: a sealed foil card pack standing upright. Deep blue #0072CE foil, a red #C8102E keyline down
one edge, subtle diagonal sheen. No text or branding on the pack.
RIGHT: the identical pack bursting open - top seam splitting, bright white and gold light exploding
outward and upward, angular light shards radiating out.

Both halves on the same dark background. No text.
```

### `components/b1-logo.png` + `b4-car-illustration.png` + `b5-driver-silhouette.png`

```
Match the attached reference's style and palette. One wide image containing three separate marks
side by side on a plain white background, clearly separated, no borders:

1. An abstract geometric emblem: bold angular shapes suggesting speed and forward motion, in blue
#0072CE and white with a red #C8102E keyline. Completely invented, not based on any real motorsport
logo. No letters.
2. A generic Formula 1 car in flat side profile facing left, navy and white colour blocking, no
logos or numbers.
3. An anonymous racing helmet and shoulders in flat silhouette, three-quarter view, visor down, no
face - a solid dark navy shape with a thin blue rim light along the left edge.
```

Cut these three apart and knock out the white background in any image editor (these three need
transparency; the cards do not).

---

## Fixing problems

| Problem | Say this |
|---|---|
| Cells don't match each other | "The cells aren't consistent with each other. Regenerate with every cell using identical lighting, line weight, background colour and subject scale." |
| Gaps, borders or gutters | "Remove all gaps, borders and dividing lines between cells — the cells must butt directly against each other." |
| Subjects at different sizes | "Redraw with every subject at exactly the same scale and eye level across all cells." |
| Too detailed / photoreal | "Too detailed. Flatter — fewer colour areas, harder edges, no texture or gradients." |
| Text or logos appeared | "Remove all text, numbers and logos. There must be no lettering anywhere in the image." |
| One cell is wrong | Regenerate the whole grid. Fixing one cell usually breaks the others. |

### Re-rolling a single card

If one card is bad but the rest of the grid is good: slice the grid, then upload the **good
neighbouring card** as the reference and ask for that single subject in the same style, at 3:4
portrait. It will be slightly off, but one odd card is less visible than a whole inconsistent set.
