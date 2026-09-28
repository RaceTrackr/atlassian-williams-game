<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SmartImage from '@/components/SmartImage.vue'
import NavBar from '@/components/NavBar.vue'
import { useGameStore } from '@/stores/game.js'
import { useScrolled } from '@/composables/useScrolled.js'
import { ASSETS } from '@/game/visuals.js'

const router = useRouter()
const game = useGameStore()
const { scrolled, onScroll } = useScrolled(40)

const tiles = [
  { to: '/collection', label: 'Collection', color: 'var(--color-primary-blue)', icon: '▦' },
  { to: '/squad', label: 'Squad Builder', color: 'var(--color-keyline-red)', icon: '⬢' },
  { to: '/garage', label: 'Garage', color: '#FF8A00', icon: '⚙' },
  { to: '/battle', label: 'Race Battle', color: '#00C48C', icon: '▶' },
]

const power = computed(() => game.summary.squadPower)
const filled = computed(
  () => `${game.summary.filledSlots}/${game.summary.totalSlots} slots filled`
)
</script>

<template>
  <div class="screen">
    <div class="bg">
      <SmartImage :src="ASSETS.backgroundMain" alt="" color="#0A0A0A" />
    </div>

    <NavBar title="Ultimate Team" :scrolled="scrolled" />

    <div class="screen-body" @scroll="onScroll">
      <header class="top">
        <div class="logo">
          <SmartImage :src="ASSETS.logo" alt="Team logo" label="LOGO" color="var(--color-primary-blue)" contain />
        </div>
        <div>
          <p class="eyebrow">Atlassian Williams Racing</p>
          <h1 class="ios-large-title">Ultimate<br />Team</h1>
        </div>
      </header>

      <section class="power panel clip-corner">
        <div class="power-main">
          <p class="eyebrow">Squad Power</p>
          <p class="power-val num-neon">{{ power }}</p>
          <p class="helper">{{ filled }}</p>
        </div>
        <div class="power-side">
          <div class="stat">
            <span class="stat-val">{{ game.packs }}</span>
            <span class="stat-lbl">Packs</span>
          </div>
          <div class="stat">
            <span class="stat-val">{{ game.collectionProgress.owned }}</span>
            <span class="stat-lbl">Cards</span>
          </div>
        </div>
      </section>

      <button class="live-banner" @click="router.push('/live')">
        <span class="dot"></span>
        <span class="live-txt">
          <strong>Watch &amp; Unlock</strong>
          <span class="helper">Watch live coverage to earn a card pack</span>
        </span>
        <span class="chev">›</span>
      </button>

      <nav class="tiles">
        <button
          v-for="t in tiles"
          :key="t.to"
          class="tile"
          :style="{ '--tile': t.color }"
          @click="router.push(t.to)"
        >
          <span class="icon-chip" :style="{ background: t.color }">{{ t.icon }}</span>
          <span class="tile-label">{{ t.label }}</span>
        </button>
      </nav>

    </div>
  </div>
</template>

<style scoped>
.bg {
  position: absolute;
  inset: 0;
  opacity: 0.5;
}

.bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 114, 206, 0.42), rgba(4, 21, 38, 0.92) 58%);
}

.screen-body {
  position: relative;
  z-index: 1;
  padding-top: 6px;
}

.top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 54px;
  height: 54px;
  border-radius: 13px;
  overflow: hidden;
  flex-shrink: 0;
}

.top .eyebrow {
  margin: 0 0 3px;
  font-size: 12px;
}

.power {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  background: rgba(28, 28, 30, 0.72);
  backdrop-filter: var(--blur-bar);
  -webkit-backdrop-filter: var(--blur-bar);
}

.power-main {
  flex: 1;
}

.power-val {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 40px;
  line-height: 1;
  margin: 2px 0 3px;
  color: var(--color-keyline-white);
}

.power-side {
  display: flex;
  gap: 8px;
}

.stat {
  width: 56px;
  padding: 8px 4px;
  text-align: center;
  background: var(--surface-2);
  border-radius: 10px;
}

.stat-val {
  display: block;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 18px;
}

.stat-lbl {
  display: block;
  font-size: 10px;
  color: var(--text-mid);
  margin-top: 2px;
}

.live-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 12px;
  padding: 13px 14px;
  border-radius: 0;
  clip-path: polygon(
    0 0,
    calc(100% - var(--cut)) 0,
    100% var(--cut),
    100% 100%,
    var(--cut) 100%,
    0 calc(100% - var(--cut))
  );
  background: var(--grad-red);
  filter: drop-shadow(0 0 12px rgba(200, 16, 46, 0.5));
  text-align: left;
}

.live-banner .dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #fff;
  flex-shrink: 0;
  animation: pulse 1.4s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

.live-txt {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.live-txt strong {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.live-txt .helper {
  color: rgba(255, 255, 255, 0.85);
  font-size: 12.5px;
}

.chev {
  font-size: 20px;
  opacity: 0.75;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.tile {
  position: relative;
  min-width: 0;
  min-height: 96px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
  background: var(--grad-surface);
  clip-path: polygon(
    0 0,
    calc(100% - var(--cut)) 0,
    100% var(--cut),
    100% 100%,
    var(--cut) 100%,
    0 calc(100% - var(--cut))
  );
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07),
    inset 0 -28px 30px -28px var(--tile);
}

.tile:active {
  transform: scale(0.97);
}

/* rounded-square app-style icon chip */
.icon-chip {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  box-shadow: 0 0 16px -2px var(--tile);
}

.tile-label {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 15px;
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

</style>
