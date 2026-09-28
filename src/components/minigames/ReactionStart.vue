<script setup>
/* START PHASE — "Lights Out".
   Five red lights illuminate one by one, hold for a random delay, then
   go out. Tap the instant they do. Going before lights out is a jump
   start and costs you. The driver's racecraft widens the perfect
   window, so a sharper driver is more forgiving to play. */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MiniGameShell from './MiniGameShell.vue'
import { MINIGAMES, reactionWindow } from '@/game/engine.js'

const props = defineProps({
  racecraft: { type: Number, default: 50 },
})
const emit = defineEmits(['done'])

const lights = ref(0)
const stage = ref('arming') // arming → go → result
const reaction = ref(0)
const quality = ref('')

const windows = computed(() => reactionWindow(props.racecraft))

let t0 = 0
let lightTimer = null
let outTimer = null
let doneTimer = null

onMounted(() => {
  lightTimer = setInterval(() => {
    lights.value += 1
    if (lights.value >= 5) {
      clearInterval(lightTimer)
      // Random hold, exactly like a real start — you cannot time it.
      outTimer = setTimeout(() => {
        lights.value = 0
        stage.value = 'go'
        t0 = performance.now()
      }, 900 + Math.random() * 2600)
    }
  }, 620)
})

function tap() {
  if (stage.value === 'arming') return finish('jumpstart', 0)
  if (stage.value !== 'go') return
  const ms = Math.round(performance.now() - t0)
  const w = windows.value
  finish(ms <= w.perfect ? 'perfect' : ms <= w.good ? 'good' : ms <= w.good + 180 ? 'ok' : 'miss', ms)
}

function finish(q, ms) {
  clearInterval(lightTimer)
  clearTimeout(outTimer)
  quality.value = q
  reaction.value = ms
  stage.value = 'result'
  doneTimer = setTimeout(() => emit('done', { quality: q, detail: label.value }), 1200)
}

const label = computed(() => {
  if (quality.value === 'jumpstart') return 'Jump start!'
  if (!quality.value) return ''
  const q = quality.value === 'perfect' ? 'Perfect launch' : quality.value === 'good' ? 'Good launch' : quality.value === 'ok' ? 'Slow away' : 'Bogged down'
  return `${q} — ${reaction.value}ms`
})

onBeforeUnmount(() => {
  clearInterval(lightTimer)
  clearTimeout(outTimer)
  clearTimeout(doneTimer)
})
</script>

<template>
  <MiniGameShell
    :name="MINIGAMES.start.name"
    phase-label="Start"
    :how="MINIGAMES.start.how"
    :stat-line="`Racecraft ${racecraft} → perfect under ${windows.perfect}ms`"
    :result="quality"
    :result-text="label"
  >
    <div class="gantry">
      <div v-for="i in 5" :key="i" class="pod">
        <span class="bulb" :class="{ lit: lights >= i }"></span>
        <span class="bulb" :class="{ lit: lights >= i }"></span>
      </div>
    </div>
    <p class="cue" :class="{ go: stage === 'go' }">
      {{ stage === 'arming' ? 'Wait for lights out…' : stage === 'go' ? 'GO!' : '' }}
    </p>

    <template #footer>
      <button class="btn btn--red" :disabled="stage === 'result'" @click="tap">
        {{ stage === 'result' ? 'Away' : 'Launch' }}
      </button>
    </template>
  </MiniGameShell>
</template>

<style scoped>
.gantry {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 18px 10px;
  background: #0d0d0f;
  border-radius: var(--radius-ios);
}

.pod {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 8px 7px;
  background: #18181b;
  border-radius: 8px;
}

.bulb {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2a0d10;
  transition: background 0.08s linear, box-shadow 0.08s linear;
}

.bulb.lit {
  background: #ff2e2e;
  box-shadow: 0 0 16px rgba(255, 46, 46, 0.85);
}

.cue {
  margin: 20px 0 0;
  text-align: center;
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--text-lo);
}

.cue.go {
  color: var(--ios-green);
  font-size: 34px;
  animation: flash 0.25s steps(2) infinite;
}

@keyframes flash {
  50% {
    opacity: 0.55;
  }
}
</style>
