<script setup>
import { computed } from 'vue'
import SmartImage from './SmartImage.vue'
import { cardArt, placeholderFill, rarityFill, rarityLabel } from '@/game/visuals.js'
import { DEPARTMENTS, PART_SLOTS } from '@/data/cards.js'

const props = defineProps({
  card: { type: Object, required: true },
  locked: { type: Boolean, default: false },
  chemistry: { type: Boolean, default: false },
  lead: { type: Boolean, default: false },
  /* Where this card is already equipped, e.g. "Engineering — Lead".
     Empty string = not in the squad. */
  inUse: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md
})

const rating = computed(() => {
  const c = props.card
  if (c.type === 'driver') {
    const v = Object.values(c.stats)
    return Math.round(v.reduce((a, b) => a + b, 0) / v.length)
  }
  if (c.type === 'car') {
    const v = Object.values(c.stats)
    return Math.round(v.reduce((a, b) => a + b, 0) / v.length)
  }
  if (c.type === 'staff') return c.primaryStat.value
  if (c.type === 'part') return `+${c.statBonus.value}`
  return ''
})

const subtitle = computed(() => {
  const c = props.card
  if (c.type === 'staff') return c.role
  if (c.type === 'part') return PART_SLOTS[c.slot].label
  if (c.type === 'car') return c.years
  if (c.type === 'driver') return c.years
  return ''
})

const accent = computed(() =>
  props.card.type === 'staff' ? DEPARTMENTS[props.card.department].color : rarityFill(props.card.rarity)
)

/* People and helmets sit in the upper half of their artwork, so anchor
   the crop high — a centred crop decapitates them in a square slot. */
const focus = computed(() =>
  props.card.type === 'staff' || props.card.type === 'driver' ? '50% 30%' : '50% 50%'
)
</script>

<template>
  <div
    class="tile"
    :class="[`tile--${size}`, { 'is-locked': locked, 'is-legend': card.rarity === 'legend' }]"
    :style="{ '--accent': accent, '--rarity': rarityFill(card.rarity) }"
  >
    <div class="art">
      <SmartImage
        :src="cardArt(card.id)"
        :alt="card.name"
        :color="placeholderFill(card)"
        :gradient="card.rarity === 'legend' ? rarityFill('legend') : ''"
        :focus="focus"
      />
      <span class="rating">{{ rating }}</span>
      <span v-if="lead" class="flag flag--lead">LEAD</span>
      <span
        v-if="chemistry"
        class="flag flag--chem"
        :class="{ 'flag--chem-stacked': lead }"
        title="Era chemistry with your driver"
        >⚡</span
      >
      <span v-if="inUse" class="in-use" :title="`Already in your squad: ${inUse}`">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3.2 8.4 6.4 11.6 12.8 4.8" />
        </svg>
      </span>
      <div v-if="locked" class="lock"><span>🔒</span></div>

      <!-- frosted name plate, floating over the artwork -->
      <div class="meta" :class="{ 'meta--in-use': inUse }" :title="rarityLabel(card.rarity)">
        <p class="name">{{ card.name }}</p>
        <p v-if="inUse" class="sub sub--in-use">In use · {{ inUse }}</p>
        <p v-else class="sub">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  /* min-width:0 stops the nowrap name below from forcing a grid track
     wider than its container (1fr = minmax(auto,1fr) by default). */
  min-width: 0;
  max-width: 100%;
  background: var(--surface-2);
  border: 1.5px solid var(--accent);
  border-radius: var(--radius-card);
  overflow: hidden;
  text-align: left;
  width: 100%;
  /* rarity reads as emitted light, not just a border colour */
  box-shadow: 0 0 14px -2px var(--accent), 0 4px 14px rgba(0, 0, 0, 0.5);
}

.tile.is-legend {
  border-color: #ffd700;
  box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.4), 0 0 22px rgba(255, 215, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.55);
}

/* A slow diagonal sheen travelling across Legend cards — the one piece
   of motion that marks the top tier. */
.tile.is-legend .art::after {
  content: '';
  position: absolute;
  inset: -40%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 42%,
    rgba(255, 255, 255, 0.42) 50%,
    transparent 58%
  );
  transform: translateX(-60%);
  animation: sheen 4.5s ease-in-out infinite;
}

@keyframes sheen {
  0%,
  62% {
    transform: translateX(-60%);
  }
  100% {
    transform: translateX(60%);
  }
}

.tile.is-locked {
  filter: grayscale(1) brightness(0.55);
}

/* The art is the whole card now — the name plate floats on top of it
   rather than sitting in a slab underneath. */
.art {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: var(--surface-3);
  /* A backdrop-filter child (the name plate) is composited, and a
     composited layer ignores an ancestor's border-radius clip — so the
     rounding has to be repeated here and on the plate itself. */
  border-radius: calc(var(--radius-card) - 2px);
  overflow: hidden;
}

.tile--sm .art {
  aspect-ratio: 1 / 1;
}

.rating {
  position: absolute;
  top: 5px;
  left: 5px;
  min-width: 22px;
  padding: 3px 5px;
  text-align: center;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 12px;
  line-height: 1.05;
  color: var(--color-black);
  background: var(--rarity);
  border-radius: 0;
  /* clipped corner, matching the buttons */
  clip-path: polygon(0 0, 100% 0, 100% 62%, 76% 100%, 0 100%);
  padding-right: 7px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
}

.flag {
  position: absolute;
  font-family: var(--font-heading);
  font-size: 8px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.08em;
  padding: 3px 4px;
  border-radius: 4px;
}

.flag--lead {
  top: 5px;
  right: 5px;
  background: var(--color-keyline-white);
  color: var(--color-black);
}

.flag--chem {
  top: 5px;
  right: 5px;
  font-size: 11px;
  background: rgba(10, 10, 10, 0.75);
  color: #ffd700;
}

/* drops below the LEAD flag when a card is both */
.flag--chem-stacked {
  top: 25px;
}

/* "already equipped" marker — iOS-style filled check, sitting on the
   frosted name plate so it never covers the artwork */
.in-use {
  position: absolute;
  bottom: 8px;
  right: 6px;
  z-index: 2;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--tint);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.45);
}

.in-use svg {
  width: 11px;
  height: 11px;
}

.sub--in-use {
  color: var(--tint);
  font-weight: 600;
}

.lock {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 10, 0.45);
  font-size: 20px;
}

/* Frosted material plate: blurs whatever art sits behind it, with a
   rarity keyline along its top edge. */
.meta {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 0;
  overflow: hidden;
  padding: 6px 7px 7px;
  background: rgba(10, 10, 12, 0.42);
  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
  border-top: 2px solid var(--rarity);
  border-bottom-left-radius: calc(var(--radius-card) - 2px);
  border-bottom-right-radius: calc(var(--radius-card) - 2px);
}

.name {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 12px;
  line-height: 1.15;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub {
  margin: 1px 0 0;
  font-size: 9.5px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.72);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tile--sm .sub {
  display: none; /* too tight to read at slot size */
}

/* keep the name clear of the in-use check */
.meta--in-use {
  padding-right: 26px;
}
</style>
