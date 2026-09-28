<script setup>
/* OPENING STINT — "Late Braking".
   You arrive at the corner with a run on the car ahead. Hit the brakes
   as late as you dare: too early and the door shuts, past the limit and
   you lock up and run wide. A stronger overtaker can commit from
   further back, which widens the ideal window. */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MiniGameShell from './MiniGameShell.vue'
import { MINIGAMES, brakingWindow } from '@/game/engine.js'

const props = defineProps({
  overtaking: { type: Number, default: 50 },
})
const emit = defineEmits(['done'])

const RUN_MS = 1900 // time from the board to the corner
const BOARDS = [200, 150, 100, 50] // distance marker boards

const pos = ref(0) // 0 = braking boards, 100 = the corner itself
const running = ref(true)
const quality = ref('')
const brakedAt = ref(null)

/* The window ends at 100 — the limit of adhesion. */
const brakeWindow = computed(() => brakingWindow(props.overtaking))
const idealStart = computed(() => 100 - brakeWindow.value)

/* Run 0–100 occupies the left 86% of the track; the corner itself fills
   the remaining 14% on the right, so "past the limit" is visible. */
const RUN_SPAN = 0.86
const x = (p) => p * RUN_SPAN

/* Speed readout: full speed until you brake, then scrubbing off. */
const speed = computed(() => {
  if (brakedAt.value === null) return 312
  const shed = (pos.value - brakedAt.value) * 6.2
  return Math.max(84, Math.round(312 - shed))
})

let rafId = null
let doneTimer = null

onMounted(() => {
  const startedAt = performance.now()
  const step = (now) => {
    pos.value = Math.min(100, ((now - startedAt) / RUN_MS) * 100)
    if (pos.value >= 100) return finish(null)
    rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
})

function brake() {
  if (!running.value) return
  finish(pos.value)
}

function finish(at) {
  running.value = false
  cancelAnimationFrame(rafId)
  brakedAt.value = at
  const w = brakeWindow.value

  if (at === null) {
    quality.value = 'miss' // never braked — straight on at the corner
  } else if (at >= idealStart.value) {
    quality.value = 'perfect' // on the limit
  } else if (at >= idealStart.value - w * 0.5) {
    quality.value = 'good'
  } else if (at >= idealStart.value - w * 1.4) {
    quality.value = 'ok'
  } else {
    quality.value = 'miss'
  }

  doneTimer = setTimeout(() => emit('done', { quality: quality.value, detail: label.value }), 1300)
}

const label = computed(() => {
  if (!quality.value) return ''
  if (brakedAt.value === null) return 'Never braked — straight on at the corner'
  const metres = Math.round((100 - brakedAt.value) * 2)
  const map = {
    perfect: `Braked on the limit at ${metres}m — move complete`,
    good: `Good stop at ${metres}m — alongside at the apex`,
    ok: `Braked early at ${metres}m — door shut`,
    miss: `Way too early at ${metres}m — lost all momentum`,
  }
  return map[quality.value]
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  clearTimeout(doneTimer)
})
</script>

<template>
  <MiniGameShell
    :name="MINIGAMES.openingStint.name"
    phase-label="Opening Stint"
    :how="MINIGAMES.openingStint.how"
    :stat-line="`Overtaking ${overtaking} → ${brakeWindow}% braking window`"
    :result="quality"
    :result-text="label"
  >
    <div class="corner-view">
      <!-- distance marker boards -->
      <div class="boards">
        <span v-for="(b, i) in BOARDS" :key="b" class="board" :style="{ left: x(i * 25 + 6) + '%' }">
          {{ b }}
        </span>
      </div>

      <div class="track">
        <!-- ideal window, hard limit, then the corner -->
        <div class="zone ideal" :style="{ left: x(idealStart) + '%', width: x(brakeWindow) + '%' }"></div>
        <div class="apex"></div>
        <div class="kerb"></div>

        <!-- the car, and the braking trail once you commit -->
        <div
          v-if="brakedAt !== null"
          class="trail"
          :style="{ left: x(brakedAt) + '%', width: x(Math.max(0, pos - brakedAt)) + '%' }"
        ></div>
        <div class="car" :class="{ braking: brakedAt !== null }" :style="{ left: x(pos) + '%' }">🏎</div>
      </div>

      <div class="hud">
        <div class="speed">
          <span class="num">{{ speed }}</span><span class="unit">km/h</span>
        </div>
        <div class="legend">
          <span><i class="sw ideal"></i> Latest safe braking</span>
          <span><i class="sw corner"></i> Corner — too late</span>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn btn--red brake" :disabled="!running" @click="brake">
        {{ running ? 'BRAKE' : 'Committed' }}
      </button>
    </template>
  </MiniGameShell>
</template>

<style scoped>
.corner-view {
  padding: 4px 0;
}

.boards {
  position: relative;
  height: 20px;
  margin-bottom: 6px;
}

.board {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  padding: 2px 5px;
  border-radius: 3px;
  background: var(--surface-3);
  color: var(--text-mid);
  font-family: var(--font-heading);
  font-size: 10px;
  font-weight: 800;
}

.track {
  position: relative;
  height: 96px;
  border-radius: var(--radius-ios);
  overflow: hidden;
  background: repeating-linear-gradient(90deg, #1c1c1e 0 46px, #202023 46px 92px);
}

/* the window you want to brake in — right up against the corner */
.zone.ideal {
  position: absolute;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(48, 209, 88, 0.18), rgba(48, 209, 88, 0.62));
}

/* the corner itself: past here you are a passenger */
.apex {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 86%;
  right: 0;
  background: repeating-linear-gradient(
    45deg,
    rgba(255, 69, 58, 0.55) 0 8px,
    rgba(255, 255, 255, 0.35) 8px 16px
  );
}

.kerb {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: repeating-linear-gradient(90deg, #c8102e 0 14px, #fff 14px 28px);
}

.car {
  position: absolute;
  top: 50%;
  margin-left: -16px;
  transform: translateY(-50%);
  font-size: 32px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6));
}

.car.braking {
  animation: shudder 0.12s infinite alternate;
}

@keyframes shudder {
  to {
    transform: translateY(-52%);
  }
}

/* lock-up smoke trail from the braking point */
.trail {
  position: absolute;
  top: 50%;
  height: 7px;
  margin-top: -3px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5));
}

.hud {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
}

.speed .num {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 34px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.speed .unit {
  margin-left: 4px;
  font-size: 11px;
  color: var(--text-mid);
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
  color: var(--text-mid);
  text-align: right;
}

.sw {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  margin-right: 5px;
}

.sw.ideal {
  background: rgba(48, 209, 88, 0.7);
}

.sw.corner {
  background: rgba(255, 69, 58, 0.7);
}

.brake {
  font-family: var(--font-heading);
  font-weight: 900;
  letter-spacing: 0.06em;
}
</style>
