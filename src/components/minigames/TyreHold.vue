<script setup>
/* CLOSING STINT — "Tyre Management".
   Hold to push, release to cool. Keep the tyre in its working window
   while the temperature drifts on its own. The Performance department
   widens the band, which is the same department that governs driver
   conditioning — so the stat that keeps the driver fresh also makes
   this easier to hold. */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MiniGameShell from './MiniGameShell.vue'
import { MINIGAMES, tyreBandWidth } from '@/game/engine.js'

const props = defineProps({
  performanceStat: { type: Number, default: 0 },
})
const emit = defineEmits(['done'])

const DURATION = 7000
const HEAT_RATE = 62 // units/sec while holding
const COOL_RATE = 48 // units/sec while released

const temp = ref(50)
const holding = ref(false)
const remaining = ref(DURATION)
const quality = ref('')
const inBandMs = ref(0)

const band = computed(() => tyreBandWidth(props.performanceStat))
const bandLow = computed(() => 50 - band.value / 2)
const bandHigh = computed(() => 50 + band.value / 2)
const inBand = computed(() => temp.value >= bandLow.value && temp.value <= bandHigh.value)

let rafId = null
let doneTimer = null
let startedAt = 0

onMounted(() => {
  startedAt = performance.now()
  let last = startedAt
  const step = (now) => {
    const dt = (now - last) / 1000
    last = now
    /* Natural drift keeps it from being a set-and-forget hold. Two
       out-of-phase waves so the wander never settles into a rhythm. */
    const t = now - startedAt
    const drift = (Math.sin(t / 380) * 15 + Math.sin(t / 137) * 7) * dt
    temp.value = Math.max(
      0,
      Math.min(100, temp.value + (holding.value ? HEAT_RATE : -COOL_RATE) * dt + drift)
    )
    if (inBand.value) inBandMs.value += dt * 1000
    remaining.value = Math.max(0, DURATION - (now - startedAt))
    if (remaining.value <= 0) return finish()
    rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
})

function finish() {
  cancelAnimationFrame(rafId)
  const pct = inBandMs.value / DURATION
  quality.value = pct >= 0.8 ? 'perfect' : pct >= 0.6 ? 'good' : pct >= 0.35 ? 'ok' : 'miss'
  doneTimer = setTimeout(() => emit('done', { quality: quality.value, detail: label.value }), 1200)
}

const pctInBand = computed(() => Math.round((inBandMs.value / DURATION) * 100))

const label = computed(() => {
  if (!quality.value) return ''
  const map = {
    perfect: 'Tyres held perfectly',
    good: 'Tyres in decent shape',
    ok: 'Graining in the final laps',
    miss: 'Tyres gone — hanging on',
  }
  return `${map[quality.value]} (${pctInBand.value}% in window)`
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  clearTimeout(doneTimer)
})
</script>

<template>
  <MiniGameShell
    :name="MINIGAMES.closingStint.name"
    phase-label="Closing Stint"
    :how="MINIGAMES.closingStint.how"
    :stat-line="`Recovery Boost ${performanceStat} → ${band}% working window`"
    :result="quality"
    :result-text="label"
  >
    <div class="gauge-row">
      <div class="gauge">
        <div class="band" :style="{ bottom: bandLow + '%', height: band + '%' }"></div>
        <div class="needle" :class="{ ok: inBand }" :style="{ bottom: temp + '%' }"></div>
        <span class="tick hot">Overheating</span>
        <span class="tick cold">Cold</span>
      </div>
      <div class="readout">
        <p class="eyebrow">Tyre temp</p>
        <p class="temp" :class="{ ok: inBand }">{{ Math.round(temp) }}</p>
        <p class="footnote">{{ pctInBand }}% of the stint in the window</p>
        <div class="timer">
          <div class="timer-fill" :style="{ width: (remaining / DURATION) * 100 + '%' }"></div>
        </div>
      </div>
    </div>

    <template #footer>
      <button
        class="btn hold"
        :class="{ down: holding }"
        :disabled="!!quality"
        @pointerdown="holding = true"
        @pointerup="holding = false"
        @pointerleave="holding = false"
        @pointercancel="holding = false"
      >
        {{ quality ? 'Flag' : holding ? 'Pushing…' : 'Hold to push' }}
      </button>
    </template>
  </MiniGameShell>
</template>

<style scoped>
.gauge-row {
  display: flex;
  gap: 18px;
  align-items: stretch;
}

.gauge {
  position: relative;
  width: 62px;
  height: 210px;
  flex-shrink: 0;
  border-radius: var(--radius-ios);
  background: linear-gradient(180deg, rgba(255, 69, 58, 0.25), rgba(10, 132, 255, 0.25));
  overflow: hidden;
}

.band {
  position: absolute;
  left: 0;
  right: 0;
  background: rgba(48, 209, 88, 0.4);
  border-top: 1px solid rgba(48, 209, 88, 0.8);
  border-bottom: 1px solid rgba(48, 209, 88, 0.8);
}

.needle {
  position: absolute;
  left: -3px;
  right: -3px;
  height: 4px;
  margin-bottom: -2px;
  background: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  transition: background 0.15s ease;
}

.needle.ok {
  background: var(--ios-green);
  box-shadow: 0 0 12px rgba(48, 209, 88, 0.9);
}

.tick {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 8.5px;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.55);
}

.tick.hot {
  top: 5px;
}

.tick.cold {
  bottom: 5px;
}

.readout {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.temp {
  margin: 4px 0 2px;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 44px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.temp.ok {
  color: var(--ios-green);
}

.timer {
  height: 5px;
  border-radius: 3px;
  background: var(--surface-2);
  overflow: hidden;
  margin-top: 12px;
}

.timer-fill {
  height: 100%;
  background: var(--ios-red);
}

.hold.down {
  background: var(--ios-green);
  transform: scale(0.98);
}
</style>
