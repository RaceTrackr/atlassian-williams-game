<script setup>
/* iOS status bar: live clock on the left, cellular/wifi/battery on the
   right, split around the Dynamic Island. Purely decorative chrome. */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const time = ref('')
let timer = null

function tick() {
  const d = new Date()
  let h = d.getHours() % 12
  if (h === 0) h = 12
  time.value = `${h}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 10000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="status-bar">
    <span class="time">{{ time }}</span>
    <div class="island"></div>
    <div class="indicators">
      <!-- cellular -->
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
        <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
        <rect x="4.6" y="5.5" width="3" height="5.5" rx="1" />
        <rect x="9.2" y="3" width="3" height="8" rx="1" />
        <rect x="13.8" y="0" width="3" height="11" rx="1" />
      </svg>
      <!-- wifi -->
      <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden="true">
        <path
          d="M8 10.6 6 8.3a3 3 0 0 1 4 0l-2 2.3ZM8 5.4c-1.3 0-2.6.5-3.6 1.4L3 5.4a7.3 7.3 0 0 1 10 0L11.6 6.8A5.2 5.2 0 0 0 8 5.4ZM8 1.2c-2.4 0-4.7.9-6.5 2.5L0 2.3A11.5 11.5 0 0 1 16 2.3l-1.5 1.4A9.4 9.4 0 0 0 8 1.2Z"
        />
      </svg>
      <!-- battery -->
      <div class="battery"><i></i></div>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--ios-status-h);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 26px 0;
  color: #fff;
  pointer-events: none;
  font-family: var(--font-ios);
}

.time {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
  width: 62px;
  text-align: center;
}

/* Dynamic Island */
.island {
  width: 122px;
  height: 34px;
  border-radius: 20px;
  background: #000;
  margin-top: -3px;
}

.indicators {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 62px;
  justify-content: flex-end;
}

.battery {
  position: relative;
  width: 24px;
  height: 11.5px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 3.5px;
  padding: 1.5px;
}

.battery::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 3.5px;
  width: 1.5px;
  height: 4px;
  border-radius: 0 1px 1px 0;
  background: rgba(255, 255, 255, 0.4);
}

.battery i {
  display: block;
  width: 72%;
  height: 100%;
  border-radius: 1.5px;
  background: #fff;
}
</style>
