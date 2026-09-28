<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  max: { type: Number, default: 100 },
  color: { type: String, default: 'var(--color-primary-blue)' },
  suffix: { type: String, default: '' },
})
</script>

<template>
  <div class="row">
    <span class="lbl">{{ label }}</span>
    <div class="track">
      <div
        class="fill"
        :style="{ width: Math.min(100, (value / max) * 100) + '%', background: color }"
      ></div>
    </div>
    <span class="val">{{ value }}{{ suffix }}</span>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 74px 1fr 34px;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
}

.lbl {
  font-size: 10px;
  color: var(--text-mid);
  text-transform: capitalize;
}

.track {
  height: 6px;
  border-radius: 3px;
  background: var(--surface-3);
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.35s ease;
}

.val {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 11px;
  text-align: right;
}
</style>
