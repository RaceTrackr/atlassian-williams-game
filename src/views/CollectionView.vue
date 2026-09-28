<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import CardTile from '@/components/CardTile.vue'
import BottomSheet from '@/components/BottomSheet.vue'
import CardDetail from '@/components/CardDetail.vue'
import { useGameStore } from '@/stores/game.js'
import { useScrolled } from '@/composables/useScrolled.js'

const game = useGameStore()
const router = useRouter()
const { scrolled, onScroll } = useScrolled(40)

const filters = [
  { key: 'all', label: 'All' },
  { key: 'driver', label: 'Drivers' },
  { key: 'car', label: 'Cars' },
  { key: 'staff', label: 'Staff' },
  { key: 'part', label: 'Parts' },
]
const active = ref('all')
const selected = ref(null)

const groups = computed(() => game.collectionByType)

const visible = computed(() => {
  const g = groups.value
  const list = active.value === 'all' ? [...g.driver, ...g.car, ...g.staff, ...g.part] : g[active.value]
  // Owned first, then locked — locked cards stay visible as collection goals.
  return [...list].sort((a, b) => Number(b.owned) - Number(a.owned))
})

const progress = computed(() => game.collectionProgress)
</script>

<template>
  <div class="screen">
    <NavBar title="Collection" :scrolled="scrolled" />

    <div class="screen-body" @scroll="onScroll">
      <h1 class="ios-large-title">Collection</h1>
      <p class="helper sub">
        {{ progress.owned }} of {{ progress.total }} cards unlocked — locked cards are greyed out.
      </p>

      <!-- unopened packs sit at the top, where you'd look for them -->
      <button v-if="game.packs > 0" class="packs" @click="router.push('/live?open=1')">
        <span class="pack-icon">🎁</span>
        <span class="pack-txt">
          <strong>{{ game.packs }} pack{{ game.packs === 1 ? '' : 's' }} to open</strong>
          <span>Unlock new cards</span>
        </span>
        <span class="pack-go">Open</span>
      </button>

      <div class="bar">
        <div class="track"><div class="fill" :style="{ width: progress.pct + '%' }"></div></div>
        <span class="pct">{{ progress.pct }}%</span>
      </div>

      <div class="ios-segmented">
        <button
          v-for="f in filters"
          :key="f.key"
          :class="{ on: active === f.key }"
          @click="active = f.key"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="grid">
        <button v-for="c in visible" :key="c.id" class="cell" @click="selected = c">
          <CardTile
            :card="c"
            :locked="!c.owned"
            :lead="!!c.isLead"
            :in-use="game.squadUsage[c.id] || ''"
          />
        </button>
      </div>
      <p class="helper hint">
        Tap any card for its detail. Staff cards open their bio — education, advice for students,
        top quote and secret skill.
      </p>
    </div>

    <BottomSheet
      :open="!!selected"
      :title="selected ? selected.name : ''"
      :subtitle="selected && !selected.owned ? 'Locked — unlock this from a pack' : ''"
      @close="selected = null"
    >
      <CardDetail v-if="selected" :card="selected" />
    </BottomSheet>
  </div>
</template>

<style scoped>
.sub {
  margin: 5px 0 0;
}

.packs {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  margin-top: 14px;
  padding: 12px 14px;
  text-align: left;
  background: var(--grad-gold);
  color: var(--color-black);
  clip-path: polygon(
    0 0,
    calc(100% - var(--cut)) 0,
    100% var(--cut),
    100% 100%,
    var(--cut) 100%,
    0 calc(100% - var(--cut))
  );
  filter: drop-shadow(0 0 14px rgba(255, 215, 0, 0.45));
  animation: packs-pulse 2.4s ease-in-out infinite;
}

@keyframes packs-pulse {
  50% {
    filter: drop-shadow(0 0 24px rgba(255, 215, 0, 0.7));
  }
}

.pack-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.pack-txt {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.pack-txt strong {
  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.pack-txt span {
  font-size: 12px;
  opacity: 0.72;
}

.pack-go {
  flex-shrink: 0;
  font-family: var(--font-heading);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 7px 11px;
  background: var(--color-black);
  color: #fff;
  border-radius: 6px;
}

.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0 14px;
}

.track {
  flex: 1;
  height: 5px;
  border-radius: 3px;
  background: var(--surface-2);
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--color-primary-blue);
  transition: width 0.3s ease;
}

.pct {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-mid);
  font-variant-numeric: tabular-nums;
}

.grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.cell {
  padding: 0;
  display: block;
  min-width: 0;
  overflow: hidden;
}

.hint {
  margin-top: 14px;
}
</style>
