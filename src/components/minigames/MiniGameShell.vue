<script setup>
/* Common chrome for every phase minigame: what it is, what squad stat
   makes it easier, and a result banner. Keeps the four games visually
   consistent so a viewer reads them as one system. */
defineProps({
  name: { type: String, required: true },
  phaseLabel: { type: String, required: true },
  how: { type: String, default: '' },
  statLine: { type: String, default: '' },
  result: { type: String, default: '' }, // perfect | good | ok | miss | jumpstart
  resultText: { type: String, default: '' },
})
</script>

<template>
  <div class="mg">
    <p class="eyebrow">{{ phaseLabel }} · Minigame</p>
    <h1 class="ios-large-title">{{ name }}</h1>
    <p v-if="how" class="helper how">{{ how }}</p>
    <p v-if="statLine" class="stat-line">{{ statLine }}</p>

    <div class="stage">
      <slot />
    </div>

    <Transition name="pop">
      <p v-if="result" class="result" :class="`r-${result}`">{{ resultText }}</p>
    </Transition>

    <div class="foot">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.mg {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.how {
  margin: 6px 0 0;
}

.stat-line {
  margin: 10px 0 0;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--tint);
  letter-spacing: -0.01em;
}

.stage {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18px 0;
}

.result {
  margin: 0 0 6px;
  text-align: center;
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 900;
  text-transform: uppercase;
}

.r-perfect {
  color: var(--ios-green);
}

.r-good {
  color: var(--ios-yellow);
}

.r-ok {
  color: var(--text-mid);
}

.r-miss,
.r-jumpstart {
  color: var(--ios-red);
}

.foot {
  flex-shrink: 0;
}

.pop-enter-active {
  transition: transform 0.3s var(--spring), opacity 0.3s ease;
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.7);
}
</style>
