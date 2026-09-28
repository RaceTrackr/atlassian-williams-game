<script setup>
/* PIT WINDOW — "Pit Stop".
   A marker sweeps the bar; stop it in the green zone. The perfect
   zone's width comes straight from the Pit Crew department stat, so
   completing that department (and its Lead) is what makes this
   forgiving. */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MiniGameShell from './MiniGameShell.vue'
import { MINIGAMES, perfectZoneWidth } from '@/game/engine.js'

const props = defineProps({
  pitCrewStat: { type: Number, default: 0 },
})
const emit = defineEmits(['done'])

const SPEED = 92 // % of the bar per second

const pos = ref(0)
const running = ref(true)
const quality = ref('')

const zoneWidth = computed(() => perfectZoneWidth(props.pitCrewStat))
const zoneStart = computed(() => 50 - zoneWidth.value / 2)

let rafId = null
let doneTimer = null
let dir = 1

onMounted(() => {
  let last = performance.now()
  const step = (now) => {
    if (!running.value) return
    const dt = (now - last) / 1000
    last = now
    pos.value += dir * SPEED * dt
    if (pos.value >= 100) {
      pos.value = 100
      dir = -1
    }
    if (pos.value <= 0) {
      pos.value = 0
      dir = 1
    }
    rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
})

function stop() {
  if (!running.value) return
  running.value = false
  cancelAnimationFrame(rafId)
  const dist = Math.abs(pos.value - 50)
  quality.value =
    dist <= zoneWidth.value / 2
      ? 'perfect'
      : dist <= zoneWidth.value
        ? 'good'
        : dist <= zoneWidth.value * 1.8
          ? 'ok'
          : 'miss'
  doneTimer = setTimeout(() => emit('done', { quality: quality.value, detail: label.value }), 1200)
}

const label = computed(() => {
  const map = {
    perfect: 'Perfect stop — 2.1s',
    good: 'Solid stop — 2.8s',
    ok: 'Slow release — 3.7s',
    miss: 'Fumbled wheel gun — 4.6s',
  }
  return map[quality.value] || ''
})

onBeforeUnmount(() => {
  running.value = false
  cancelAnimationFrame(rafId)
  clearTimeout(doneTimer)
})
</script>

<template>
  <MiniGameShell
    :name="MINIGAMES.pitWindow.name"
    phase-label="Pit Window"
    :how="MINIGAMES.pitWindow.how"
    :stat-line="`Pit Rhythm ${pitCrewStat} → ${zoneWidth}% perfect zone`"
    :result="quality"
    :result-text="label"
  >
    <div class="bar">
      <div class="zone good" :style="{ left: 50 - zoneWidth + '%', width: zoneWidth * 2 + '%' }"></div>
      <div class="zone perfect" :style="{ left: zoneStart + '%', width: zoneWidth + '%' }"></div>
      <div class="marker" :style="{ left: pos + '%' }"></div>
    </div>
    <div class="legend">
      <span><i class="sw perfect"></i> Perfect</span>
      <span><i class="sw good"></i> Good</span>
    </div>

    <template #footer>
      <button class="btn" :disabled="!running" @click="stop">
        {{ running ? 'Stop' : 'Released' }}
      </button>
    </template>
  </MiniGameShell>
</template>

<style scoped>
.bar {
  position: relative;
  height: 62px;
  border-radius: var(--radius-ios);
  background: var(--surface-2);
  overflow: hidden;
}

.zone {
  position: absolute;
  top: 0;
  bottom: 0;
}

.zone.good {
  background: rgba(48, 209, 88, 0.18);
}

.zone.perfect {
  background: rgba(48, 209, 88, 0.55);
}

.marker {
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 4px;
  margin-left: -2px;
  background: #fff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.9);
}

.legend {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-mid);
}

.sw {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  margin-right: 4px;
}

.sw.perfect {
  background: rgba(48, 209, 88, 0.9);
}

.sw.good {
  background: rgba(48, 209, 88, 0.25);
}
</style>
