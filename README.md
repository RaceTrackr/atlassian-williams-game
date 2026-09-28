# Williams Ultimate Team — concept demo

A clickable Vue 3 demo of the core loop for a Formula 1 trading card game tied to the
Atlassian Williams F1 Team. School project: the point is that the whole loop works end to end
and that the squad-building maths are visible on screen, not that it is a balanced game.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Deploying to GitHub Pages

Push to `main` and [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and
publishes automatically. One-time setup:

1. Create the repo on GitHub and push this folder to it.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The Actions tab shows the build; the URL appears there when it finishes.

Three things are already configured for Pages, all of which break a default Vite build there:

- **`base: './'`** in [vite.config.js](vite.config.js) — project sites serve from
  `username.github.io/<repo>/`, not `/`, so absolute asset paths 404. Relative paths work at any
  URL, whatever the repo is called.
- **Hash routing** in [src/router/index.js](src/router/index.js) — Pages has no SPA rewrite, so
  with real paths any refresh or shared deep link 404s. URLs look like `…/#/collection`.
- **`public/.nojekyll`** — stops GitHub running the files through Jekyll.

Asset URLs are built from `import.meta.env.BASE_URL` in
[src/game/visuals.js](src/game/visuals.js), so don't hardcode a leading `/` on new asset paths.

## The loop

Home → **Live Drop** (watch 10s → earn pack → open → unlock card) → **Collection** →
**Squad Builder** → **Garage** (fit parts, see synergy) → **Battle** (4 phases + pit-stop QTE) →
**Result** (a win pays out another pack) → back to the top.

## Viewport & iOS chrome

Everything renders inside a fixed **390×844** screen ([App.vue](src/App.vue)), wrapped in a
CSS-drawn iPhone shell — bezel, titanium rail, side buttons, Dynamic Island, home indicator. No
device image needed; to swap in real artwork, drop a transparent PNG at
`/assets/components/b9-device-frame.png` and match the `BEZEL` inset in `App.vue`.

It is the same fixed rectangle on any monitor — not a responsive layout. If the browser window is
shorter than the device, the whole thing scales down uniformly rather than being clipped. Tall
content scrolls inside the screen; nothing scrolls horizontally, and nothing is selectable or
draggable, as in a native app.

The UI follows iOS conventions rather than generic web styling:

- Apple's **dark-mode system greys** and label colours, SF system font for UI, Archivo kept for
  brand display type (screen titles, big numbers).
- **Translucent blurred bars** — status bar, nav bars, tab bar, toolbars.
- **Large titles that collapse** into the nav bar on scroll (`useScrolled.js`).
- **Grouped inset lists** with hairline separators and chevrons, segmented controls, sheets at the
  large detent with a grabber.
- **Native transition semantics:** tab ↔ tab crossfades instantly (iOS tab bars don't slide),
  pushes slide in from the right while the outgoing screen parallaxes at 30% and dims, modals cover
  from the bottom and dismiss downward. Enter and leave run *simultaneously* on one curve
  (`cubic-bezier(0.32, 0.72, 0, 1)`, 350ms) — the `out-in` mode Vue defaults to is what makes web
  transitions read as two separate animations.

## Content rules

- **Real Williams history:** drivers, team principals and chassis. These carry factual `legacy`
  notes only — no quotes, advice or biography is invented for a real person.
- **Fictional placeholders:** every engineering, pit crew, media and performance staff card
  (`fictional: true`). These carry the invented bio fields — education, advice for students,
  top quote, secret skill — which is the "getting to know the staff" payoff in the Collection.

## Dropping in art

No code changes needed. Save files at these exact paths and they appear; anything missing falls
back to a flat coloured placeholder with the card name on it (see `SmartImage.vue`).

```
public/assets/backgrounds/a1-main.png       calm background (Home)
public/assets/backgrounds/a2-battle.png     high-energy background (Battle, Live Drop)
public/assets/components/b1-logo.png
public/assets/components/b2-department-icons.png
public/assets/components/b4-car-illustration.png
public/assets/components/b5-driver-silhouette.png
public/assets/components/b8-pack-closed.png
public/assets/components/b8-pack-burst.png
public/assets/cards/<cardId>.png            one per card — see public/assets/cards/README.txt
```

**Generating the art:** [docs/card-art-prompts.md](docs/card-art-prompts.md) has copy-paste ChatGPT
prompts. They generate **grids** of cards rather than one card at a time — ChatGPT has no seed
control, so separate generations always drift, but everything inside a single image is consistent
with itself. 48 cards come out of 9 generations. Open
[tools/slice-grid.html](tools/slice-grid.html) in a browser and drop a grid in to cut it into
correctly-named card files.
[docs/card-art-brief.md](docs/card-art-brief.md) is the reasoning behind them: the style contract,
the safe zone the three different crops demand, and how the real drivers and principals are handled
without asking a model for a real person's face.

## Squad structure

| Department | Slots | Stat | Affects |
|---|---|---|---|
| Team Principal | 1 | Leadership | +0.5% per point on **final** squad power |
| Engineering | 6 (5 + Lead) | Aero IQ | Synergy on nose, rear wing, diffuser |
| Pit Crew | 4 (3 + Lead) | Pit Rhythm | Synergy on undertray + sidepods, and QTE perfect-zone width |
| Media | 1 | Fan Hype | Fill rate of the in-battle Fan Hype meter |
| Performance | 1 | Recovery Boost | Driver conditioning decay/recovery |

Driver + car + 13 department slots = **15 slots**. (The brief said "14 staff slots… 16 total",
but 1 + 6 + 4 + 1 + 1 = 13. The per-department counts were kept exactly as specified since the
completion maths depend on them; the total is derived from the data in `engine.js`
(`TOTAL_SQUAD_SLOTS`), so adding a 14th staff slot anywhere updates every screen.)

## Maths (all in `src/game/engine.js`)

```
effectiveDepartmentStat = averageStat × (1 + leadBonus) × (filled / totalSlots)
   averageStat  — Lead card counted double; chemistry cards +5%
   leadBonus    — 0.20 when the Lead slot is filled
   capped at 100 so the +50% synergy ceiling below stays true

synergyMultiplier = 1 + (relevantDeptStat / 100) × 0.5      // up to ×1.5
effectiveBonus    = part baseBonus × synergyMultiplier       // shown broken down in the Garage

squadPower = driverStats + carBaseStats + Σ effectiveBonus + Media + Performance
squadPower = squadPower × (1 + teamPrincipalMultiplier)      // applied last
```

**Badges:** 0 filled → none · partial → "X/Y staffed" · full → "Full Roster" ·
full **with** Lead → "Full Synergy" (gold glow).

**Chemistry:** a staff card whose era tag matches the equipped driver's era contributes +5% and
shows a ⚡ on its tile.

**In-use markers:** any card already equipped somewhere shows a blue ✓ and its location ("In use ·
Engineering — Lead") in every picker and in the Collection, so you can't swap out a card you're
relying on by accident. Comes from the `squadUsage` getter in the store.

## Battle — four phases, four minigames

Each phase runs its own minigame, then compares a phase-specific subset of squad power against
the rival's fixed rating with an animated bar.

| Phase | Minigame | What you do | Squad stat sets difficulty |
|---|---|---|---|
| Start | **Lights Out** | Five lights go out — tap the instant they do | Racecraft widens the perfect window (`130 + racecraft × 1.3` ms). Tapping early is a **jump start**: −8% |
| Opening Stint | **Late Braking** | Brake as late as you dare into the corner | Overtaking widens the ideal window (`4 + overtaking × 0.09` %, max 14). Past the limit, or no brake at all, runs you wide |
| Pit Window | **Pit Stop** | Stop the sweeping marker in the green zone | Pit Crew widens the zone (`3 + pitCrewStat × 0.14` %, max 18) |
| Closing Stint | **Tyre Management** | Hold to push, release to cool, stay in the window | Performance widens the band (`8 + perfStat × 0.16` %, max 26) |

These are tuned to be genuinely hard. In real timing budgets:

| Squad stat | Lights Out (perfect) | Late Braking | Pit Stop | Tyre band |
|---|---|---|---|---|
| Weak (45) | <189ms | 152ms to commit | 101ms to tap | 15% of gauge |
| Starter (65) | <215ms | 190ms | 132ms | 18% |
| Good (82) | <237ms | 209ms | 158ms | 21% |
| Maxed (97) | <256ms | 247ms | 180ms | 24% |

Human reaction time is ~200–250ms, so a perfect launch is out of reach with a weak driver and
earned with a great one. Tyre Management needs 80% of 7 seconds inside the band, against a
two-wave drift that never settles into a rhythm.

Speed constants live at the top of each component if you want to re-tune: `RUN_MS` (Late Braking),
`SPEED` (Pit Stop), `DURATION`/`HEAT_RATE`/`COOL_RATE` (Tyre Management).

The design rule: **squad stats set the difficulty, not the payout.** The payout is a flat
percentage of that phase's rating — perfect +12%, good +7%, ok +3.5%, miss 0, jump start −8%. So a
strong squad makes each game easier to nail, but skill alone can't rescue a weak squad.

The rival (`opponentSquad` in `src/data/cards.js`) is tuned against that. Simulated:

- **Starting collection, perfect play in all four games** → wins 2 of 4 phases, loses the race
  1257–1262. Flawless play with a weak squad is *almost* enough.
- **Starting collection, good play** → 0 of 4.
- **Fully unlocked squad** → wins all four comfortably, even playing badly.

That gap is the demo's point: unlocking cards and completing departments is what flips the result.

## Structure

```
src/
  data/cards.js          all mock data — swap for an API later without touching components
  game/engine.js         every calculation + minigame rules (pure functions, no Vue)
  game/visuals.js        asset paths, rarity/department colours
  stores/game.js         Pinia: collection, squad, parts, packs, squadUsage, last battle
  composables/           useScrolled (large-title collapse)
  components/            SmartImage (placeholder fallback), CardTile, CardDetail, BottomSheet,
                         NavBar, TabBar, StatusBar, StatBar
  components/minigames/  MiniGameShell + ReactionStart, LateBraking, PitStopQte, TyreHold
  views/                 Home, Collection, SquadBuilder, Garage, Battle, Result, LiveDrop
```

Each minigame is self-contained: it takes the one squad stat that sets its difficulty as a prop and
emits `done({ quality, detail })`. Adding a fifth phase means adding a component and one entry in
`MINIGAMES`.

State is in-memory and resets on reload, which is fine for a demo.
Squad Builder has an **Auto** button that fills every slot with the best owned card — useful when
demoing under time pressure.
