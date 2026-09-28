<script setup>
/* iOS tab bar: translucent material, SF-Symbols-style line icons,
   tint-coloured selected state, home indicator underneath. */
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game.js'

const route = useRoute()
const router = useRouter()
const game = useGameStore()

const tabs = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/collection', label: 'Collection', icon: 'cards' },
  { to: '/squad', label: 'Squad', icon: 'squad' },
  { to: '/garage', label: 'Garage', icon: 'garage' },
  { to: '/battle', label: 'Race', icon: 'race' },
]

const isOn = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <nav class="tab-bar">
    <button v-for="t in tabs" :key="t.to" class="tab" :class="{ on: isOn(t.to) }" @click="router.push(t.to)">
      <span class="icon">
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="t.icon === 'home'">
            <path d="M4 11.5 14 4l10 7.5V23a1 1 0 0 1-1 1h-5v-7h-8v7H5a1 1 0 0 1-1-1V11.5Z" />
          </template>
          <template v-else-if="t.icon === 'cards'">
            <rect x="3.5" y="7" width="12" height="16" rx="2.5" />
            <path d="M12.5 5h8A2.5 2.5 0 0 1 23 7.5v13" />
          </template>
          <template v-else-if="t.icon === 'squad'">
            <circle cx="14" cy="8.5" r="3.8" />
            <path d="M5.5 23c0-4 3.8-6.8 8.5-6.8S22.5 19 22.5 23" />
          </template>
          <template v-else-if="t.icon === 'garage'">
            <!-- garage building: pitched roof over a roller door -->
            <path d="M3 11.8 14 4.5l11 7.3" />
            <path d="M5.2 11.2V24h17.6V11.2" />
            <path d="M8.8 24v-8.2h10.4V24" />
            <path d="M8.8 18.6h10.4M8.8 21.3h10.4" />
          </template>
          <template v-else>
            <path d="M3.5 17.5h4l2.5-5h8l2.5 5h4" />
            <path d="M4 21.5h20" />
            <circle cx="9" cy="21.5" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="19" cy="21.5" r="2.2" fill="currentColor" stroke="none" />
            <path d="M11 8.5h6l1.5 4h-9l1.5-4Z" />
          </template>
        </svg>
        <span v-if="t.to === '/collection' && game.packs > 0" class="dot">{{ game.packs }}</span>
      </span>
      <span class="label">{{ t.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  height: var(--ios-tab-h);
  display: flex;
  align-items: flex-start;
  padding: 7px 4px 0;
  background: var(--material-bar);
  backdrop-filter: var(--blur-bar);
  -webkit-backdrop-filter: var(--blur-bar);
  border-top: 0.5px solid var(--hairline);
}

.tab {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: var(--text-mid);
  padding: 0 2px;
}

.tab.on {
  color: var(--neon-cyan);
  filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.55));
}

/* lit bar above the active tab */
.tab.on::before {
  content: '';
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 2px;
  background: var(--grad-primary);
  box-shadow: var(--glow-cyan);
}

.tab:active {
  opacity: 0.6;
}

.icon {
  position: relative;
  width: 27px;
  height: 27px;
}

.icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.dot {
  position: absolute;
  top: -3px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: var(--ios-red);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
}

.label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
</style>
