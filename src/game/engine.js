/* ------------------------------------------------------------------
   GAME ENGINE — pure functions, no Vue, no store.
   Every number shown anywhere in the UI comes from here so the demo
   stays consistent (and so the maths can be unit-tested later).
------------------------------------------------------------------- */

import { DEPARTMENTS, PART_SLOTS, cardsById } from '@/data/cards.js'

export const CHEMISTRY_BONUS = 0.05 // +5% contribution when era matches driver
export const TP_MULTIPLIER_PER_POINT = 0.005 // +0.5% squad power per Leadership point
export const SYNERGY_MAX = 0.5 // department synergy caps at +50%

/* Driver + car + every department slot. Derived, not hardcoded, so
   changing a department's slot count in the data updates the UI too. */
export const STAFF_SLOT_TOTAL = Object.values(DEPARTMENTS).reduce((a, d) => a + d.slots, 0)
export const TOTAL_SQUAD_SLOTS = STAFF_SLOT_TOTAL + 2

const round1 = (n) => Math.round(n * 10) / 10

export function getCard(id) {
  return id ? cardsById[id] || null : null
}

/* ---------------------------------------------------------------
   DEPARTMENT STAT
   filledCount        = slots filled (Lead included)
   averageStat        = average across filled cards, Lead counted twice
   leadBonus          = +20% when the Lead slot is filled
   completionMultiplier = filledCount / totalSlots
   effective = averageStat * (1 + leadBonus) * completionMultiplier
---------------------------------------------------------------- */
export function computeDepartment(deptKey, deptSlots, driverEra) {
  const meta = DEPARTMENTS[deptKey]
  const totalSlots = meta.slots
  const leadId = meta.hasLead ? deptSlots.lead : null
  const regularIds = deptSlots.regular || []

  const entries = []
  let weightedSum = 0
  let weightCount = 0
  let filledCount = 0

  const push = (id, isLead) => {
    const card = getCard(id)
    if (!card) return
    filledCount += 1
    const chemistry = !!driverEra && card.era === driverEra
    // Chemistry is flavour: it lifts this card's contribution by 5%.
    const contribution = card.primaryStat.value * (chemistry ? 1 + CHEMISTRY_BONUS : 1)
    const weight = isLead ? 2 : 1 // Lead cards count double toward the average
    weightedSum += contribution * weight
    weightCount += weight
    entries.push({ card, isLead, chemistry, contribution: round1(contribution) })
  }

  if (meta.hasLead) push(leadId, true)
  regularIds.forEach((id) => push(id, false))

  const averageStat = weightCount ? weightedSum / weightCount : 0
  const leadBonus = meta.hasLead && getCard(leadId) ? 0.2 : 0
  const completionMultiplier = filledCount / totalSlots
  /* Capped at 100 so the "up to +50% synergy" ceiling stays honest —
     the Lead bonus and chemistry can otherwise push a department past it. */
  const effective = Math.min(100, averageStat * (1 + leadBonus) * completionMultiplier)

  return {
    key: deptKey,
    label: meta.label,
    color: meta.color,
    statLabel: meta.statLabel,
    affects: meta.affects,
    hasLead: meta.hasLead,
    totalSlots,
    filledCount,
    leadFilled: leadBonus > 0,
    averageStat: round1(averageStat),
    leadBonus,
    completionMultiplier: round1(completionMultiplier * 100) / 100,
    effective: round1(effective),
    entries,
    badge: completionBadge(filledCount, totalSlots, leadBonus > 0, meta.hasLead),
  }
}

function completionBadge(filled, total, leadFilled, hasLead) {
  if (filled === 0) return null // 0% filled: no badge at all
  if (filled < total) return { tier: 'partial', label: `${filled}/${total} staffed` }
  // 100% filled from here: with a Lead in place it is the top tier.
  if (hasLead && leadFilled) return { tier: 'full-synergy', label: 'Full Synergy' }
  return { tier: 'full-roster', label: 'Full Roster' }
}

/* ---------------------------------------------------------------
   CAR PARTS
   synergyMultiplier = 1 + (relevantDeptStat / 100) * 0.5
   effectiveBonus    = baseBonus * synergyMultiplier
---------------------------------------------------------------- */
export function computePart(slotKey, partId, departments) {
  const slot = PART_SLOTS[slotKey]
  const card = getCard(partId)
  const dept = departments[slot.dept]
  const deptStat = dept ? dept.effective : 0
  const synergyMultiplier = 1 + (deptStat / 100) * SYNERGY_MAX

  if (!card) {
    return {
      slotKey,
      slotLabel: slot.label,
      deptKey: slot.dept,
      deptLabel: DEPARTMENTS[slot.dept].label,
      card: null,
      baseBonus: 0,
      synergyMultiplier: round1(synergyMultiplier * 100) / 100,
      effectiveBonus: 0,
      statKey: null,
    }
  }

  const baseBonus = card.statBonus.value
  const effectiveBonus = baseBonus * synergyMultiplier

  return {
    slotKey,
    slotLabel: slot.label,
    deptKey: slot.dept,
    deptLabel: DEPARTMENTS[slot.dept].label,
    card,
    baseBonus,
    statKey: card.statBonus.stat,
    synergyMultiplier: Math.round(synergyMultiplier * 100) / 100,
    effectiveBonus: round1(effectiveBonus),
  }
}

/* ---------------------------------------------------------------
   FULL SQUAD SUMMARY
   squadPower = driverStats + carBaseStats + Σ part effectiveBonus
              + Media effective + Performance effective
   then × (1 + teamPrincipalMultiplier)   ← applied last
---------------------------------------------------------------- */
export function computeSquad(squad, equippedParts) {
  const driver = getCard(squad.driver)
  const car = getCard(squad.car)
  const driverEra = driver ? driver.era : null

  const departments = {}
  Object.keys(DEPARTMENTS).forEach((key) => {
    departments[key] = computeDepartment(key, squad.departments[key], driverEra)
  })

  const driverStatsTotal = driver
    ? Object.values(driver.stats).reduce((a, b) => a + b, 0)
    : 0
  const carBaseStatsTotal = car ? Object.values(car.stats).reduce((a, b) => a + b, 0) : 0

  const partResults = Object.keys(PART_SLOTS).map((slotKey) =>
    computePart(slotKey, equippedParts ? equippedParts[slotKey] : null, departments)
  )
  const partsTotal = partResults.reduce((a, p) => a + p.effectiveBonus, 0)

  const mediaStat = departments.media.effective
  const performanceStat = departments.performance.effective
  const tpStat = departments.teamPrincipal.effective
  const teamPrincipalMultiplier = tpStat * TP_MULTIPLIER_PER_POINT

  const subtotal =
    driverStatsTotal + carBaseStatsTotal + partsTotal + mediaStat + performanceStat
  const squadPower = subtotal * (1 + teamPrincipalMultiplier)

  /* Driver conditioning is modified by the Performance department: a
     strong Performance card slows conditioning decay over a race. */
  const conditioningBase = driver ? driver.stats.conditioning : 0
  const effectiveConditioning = conditioningBase * (1 + performanceStat / 200)

  const filledSlots =
    (driver ? 1 : 0) +
    (car ? 1 : 0) +
    Object.values(departments).reduce((a, d) => a + d.filledCount, 0)

  return {
    driver,
    car,
    driverEra,
    departments,
    partResults,
    driverStatsTotal: round1(driverStatsTotal),
    carBaseStatsTotal: round1(carBaseStatsTotal),
    partsTotal: round1(partsTotal),
    mediaStat,
    performanceStat,
    tpStat,
    teamPrincipalMultiplier: Math.round(teamPrincipalMultiplier * 1000) / 1000,
    subtotal: round1(subtotal),
    squadPower: Math.round(squadPower),
    effectiveConditioning: round1(effectiveConditioning),
    filledSlots,
    totalSlots: TOTAL_SQUAD_SLOTS,
    chemistryCount: Object.values(departments).reduce(
      (a, d) => a + d.entries.filter((e) => e.chemistry).length,
      0
    ),
  }
}

/* ---------------------------------------------------------------
   BATTLE
   Each phase compares a phase-specific subset of the same squad
   numbers against the opponent's fixed phase rating.
---------------------------------------------------------------- */

export const PHASES = [
  {
    key: 'start',
    label: 'Start',
    blurb: 'Reaction, launch and the run to turn one.',
    tip: 'Driver racecraft + car speed, lifted by the Team Principal multiplier.',
  },
  {
    key: 'openingStint',
    label: 'Opening Stint',
    blurb: 'Clean air, overtaking and aero efficiency.',
    tip: 'Driver overtaking + car aero + Engineering-boosted aero parts.',
  },
  {
    key: 'pitWindow',
    label: 'Pit Window',
    blurb: 'The stop itself — this is where you can intervene.',
    tip: 'Pit Crew department + undertray/sidepods + your QTE bonus.',
  },
  {
    key: 'closingStint',
    label: 'Closing Stint',
    blurb: 'Tyre management and holding it together to the flag.',
    tip: 'Conditioning (boosted by Performance) + consistency + reliability.',
  },
]

export function phaseRating(phaseKey, s) {
  const tpMul = 1 + s.teamPrincipalMultiplier
  const driver = s.driver
  const car = s.car
  const partBy = (slot) => s.partResults.find((p) => p.slotKey === slot)?.effectiveBonus || 0

  switch (phaseKey) {
    case 'start': {
      const base =
        (driver ? driver.stats.racecraft : 0) + (car ? car.stats.speed : 0) * 0.5
      return base * tpMul
    }
    case 'openingStint': {
      const base =
        (driver ? driver.stats.overtaking : 0) +
        (car ? car.stats.aero : 0) +
        partBy('nose') +
        partBy('rearWing') +
        partBy('diffuser') +
        s.mediaStat * 0.5
      return base * tpMul
    }
    case 'pitWindow': {
      const base =
        s.departments.pitCrew.effective * 1.5 +
        partBy('undertray') +
        partBy('sidepods') +
        (car ? car.stats.reliability : 0) * 0.5
      return base * tpMul
    }
    case 'closingStint': {
      const base =
        s.effectiveConditioning +
        (driver ? driver.stats.consistency : 0) +
        (car ? car.stats.reliability : 0) * 0.6 +
        s.performanceStat
      return base * tpMul
    }
    default:
      return 0
  }
}

/* ---------------------------------------------------------------
   MINIGAMES — one per phase.

   Design rule: a squad's stats set the DIFFICULTY (how forgiving the
   game is), while the payout is a flat percentage of that phase's
   rating. So a strong squad makes the game easier to nail, but player
   skill never swamps squad building — a perfect result is +12%, which
   swings a close phase and cannot rescue a hopeless one.
---------------------------------------------------------------- */

export const MINIGAME_GAIN = {
  perfect: 0.12,
  good: 0.07,
  ok: 0.035,
  miss: 0,
  jumpstart: -0.08, // false start — a real penalty
}

export const MINIGAMES = {
  start: {
    key: 'start',
    component: 'ReactionStart',
    name: 'Lights Out',
    stat: 'Driver racecraft',
    how: 'Five lights go out — tap the moment they do. A sharper driver gets a wider "perfect" window; going early is a jump start.',
  },
  openingStint: {
    key: 'openingStint',
    component: 'LateBraking',
    name: 'Late Braking',
    stat: 'Driver overtaking',
    how: 'Brake as late as you dare to make the move stick. Too early and the door shuts; too late and you lock up and run wide. A better overtaker can carry the move from further back.',
  },
  pitWindow: {
    key: 'pitWindow',
    component: 'PitStopQte',
    name: 'Pit Stop',
    stat: 'Pit Crew department',
    how: 'Stop the marker in the green zone. A stronger Pit Crew widens the zone.',
  },
  closingStint: {
    key: 'closingStint',
    component: 'TyreHold',
    name: 'Tyre Management',
    stat: 'Performance department',
    how: 'Hold to push, release to cool. Keep tyre temperature inside the band. A stronger Performance department widens the band.',
  },
}

export function minigameBonus(quality, phaseRatingValue) {
  return Math.round((phaseRatingValue || 0) * (MINIGAME_GAIN[quality] || 0))
}

/* -- per-game difficulty, driven by the relevant squad stat -- */

/* Pit Stop: perfect zone width as a % of the bar. Paired with a faster
   marker in the component, this is a ~170ms window at a top-tier crew. */
export function perfectZoneWidth(pitCrewStat) {
  return Math.round(Math.min(18, 3 + pitCrewStat * 0.14) * 10) / 10
}

/* Lights Out: reaction thresholds in ms. Human reaction is ~200ms, so
   only a strong driver makes "perfect" realistically reachable. */
export function reactionWindow(racecraft) {
  const perfect = Math.round(130 + racecraft * 1.3)
  return { perfect, good: perfect + 120 }
}

/* Late Braking: width of the ideal braking window, as a % of the run to
   the corner. It ends at the limit — brake past it and you lock up. */
export function brakingWindow(overtaking) {
  return Math.round(Math.min(14, 4 + overtaking * 0.09))
}

/* Tyre Management: width of the temperature band, as a % of the gauge. */
export function tyreBandWidth(performanceStat) {
  return Math.round(Math.min(26, 8 + performanceStat * 0.16))
}
