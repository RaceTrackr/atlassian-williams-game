<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useScrolled } from '@/composables/useScrolled.js'
import BottomSheet from '@/components/BottomSheet.vue'
import CardTile from '@/components/CardTile.vue'
import SmartImage from '@/components/SmartImage.vue'
import StatBar from '@/components/StatBar.vue'
import { useGameStore } from '@/stores/game.js'
import { ASSETS, cardArt, placeholderFill, rarityFill } from '@/game/visuals.js'

const router = useRouter()
const game = useGameStore()
const { scrolled, onScroll } = useScrolled(40)

const summary = computed(() => game.summary)
const car = computed(() => summary.value.car)
const parts = computed(() => summary.value.partResults)

const carPicker = ref(false)
const partPicker = ref(null) // slotKey

const ownedCars = computed(() => game.ownedCards.filter((c) => c.type === 'car'))
const partOptions = computed(() =>
  partPicker.value
    ? game.ownedCards.filter((c) => c.type === 'part' && c.slot === partPicker.value)
    : []
)

/* Live car stats = base + every equipped part's effective bonus. */
const liveStats = computed(() => {
  if (!car.value) return null
  const out = { ...car.value.stats }
  parts.value.forEach((p) => {
    if (p.card) out[p.statKey] = Math.round((out[p.statKey] + p.effectiveBonus) * 10) / 10
  })
  return out
})

function pickCar(c) {
  game.setCar(c.id)
  carPicker.value = false
}

function pickPart(p) {
  game.setPart(partPicker.value, p.id)
  partPicker.value = null
}
</script>

<template>
  <div class="screen">
    <NavBar title="Garage" :scrolled="scrolled" />

    <div class="screen-body" @scroll="onScroll">
      <h1 class="ios-large-title">Garage</h1>

      <!-- car -->
      <button class="car-card" @click="carPicker = true">
        <div class="car-art" :style="{ borderColor: car ? rarityFill(car.rarity) : 'var(--hairline)' }">
          <SmartImage
            :src="car ? cardArt(car.id) : ASSETS.car"
            :label="car ? car.name : 'No car equipped'"
            :color="car ? placeholderFill(car) : '#26282E'"
            :gradient="car && car.rarity === 'legend' ? rarityFill('legend') : ''"
          />
        </div>
        <div class="car-meta">
          <p class="eyebrow">Chassis</p>
          <h2>{{ car ? car.name : 'Tap to choose' }}</h2>
          <p class="helper">{{ car ? car.legacy : 'Pick a chassis from your collection' }}</p>
        </div>
      </button>

      <div v-if="car" class="panel stats">
        <p class="eyebrow">Car stats</p>
        <StatBar
          v-for="(v, k) in liveStats"
          :key="k"
          :label="k"
          :value="v"
          :max="130"
          :color="rarityFill(car.rarity)"
        />
      </div>

      <!-- part slots -->
      <p class="ios-section-header section">Part slots</p>
      <div class="ios-group">
        <button v-for="p in parts" :key="p.slotKey" class="ios-row slot-main" @click="partPicker = p.slotKey">
          <div class="thumb" :style="{ borderColor: p.card ? rarityFill(p.card.rarity) : 'var(--hairline)' }">
            <SmartImage
              v-if="p.card"
              :src="cardArt(p.card.id)"
              :label="p.card.name"
              :color="placeholderFill(p.card)"
              :gradient="p.card.rarity === 'legend' ? rarityFill('legend') : ''"
            />
            <span v-else class="plus">+</span>
          </div>
          <div class="slot-txt">
            <div class="slot-top">
              <span class="slot-name">{{ p.slotLabel }}</span>
              <span class="dept-tag" :style="{ color: p.deptKey === 'engineering' ? '#0072CE' : '#FF8A00' }">
                {{ p.deptLabel }}
              </span>
            </div>
            <p class="part-name">{{ p.card ? p.card.name : 'Empty slot' }}</p>
            <p v-if="p.card" class="calc">
              <strong>+{{ p.effectiveBonus }} {{ p.statKey }}</strong>
            </p>
          </div>
          <span class="ios-chevron">›</span>
        </button>
      </div>

    </div>

    <div class="screen-footer">
      <div class="totals">
        <span>Parts <strong>+{{ summary.partsTotal }}</strong></span>
        <span>Squad power <strong>{{ summary.squadPower }}</strong></span>
      </div>
      <div class="actions">
        <button class="btn btn--ghost" @click="router.push('/squad')">Squad</button>
        <button class="btn" :disabled="!game.squadComplete" @click="router.push('/battle')">Battle</button>
      </div>
    </div>

    <BottomSheet :open="carPicker" title="Pick a chassis" subtitle="Parts are remembered per car" @close="carPicker = false">
      <div class="grid">
        <button v-for="c in ownedCars" :key="c.id" class="cell" @click="pickCar(c)">
          <CardTile :card="c" :in-use="game.squadUsage[c.id] || ''" />
        </button>
      </div>
    </BottomSheet>

    <BottomSheet
      :open="!!partPicker"
      :title="partPicker ? `Fit ${parts.find((p) => p.slotKey === partPicker).slotLabel}` : ''"
      subtitle="Tap the fitted part again to remove it"
      @close="partPicker = null"
    >
      <div v-if="partOptions.length" class="grid">
        <button v-for="p in partOptions" :key="p.id" class="cell" @click="pickPart(p)">
          <CardTile :card="p" :in-use="game.squadUsage[p.id] || ''" />
        </button>
      </div>
      <p v-else class="helper">No owned parts for this slot yet.</p>
    </BottomSheet>
  </div>
</template>

<style scoped>
.sub {
  margin: 5px 0 16px;
}

.car-card {
  display: flex;
  gap: 10px;
  width: 100%;
  text-align: left;
  background: var(--surface-1);
  border-radius: var(--radius-ios);
  padding: 12px;
}

.car-art {
  width: 108px;
  flex-shrink: 0;
  aspect-ratio: 4 / 3;
  border: 1.5px solid;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface-3);
}

.car-meta h2 {
  font-size: 20px;
  text-transform: uppercase;
  line-height: 1;
  margin: 2px 0 4px;
}

.stats {
  margin-top: 10px;
}

.stats .eyebrow {
  margin-bottom: 6px;
}

.section {
  display: block;
  margin: 22px 0 7px 4px;
}

.slot-main {
  align-items: flex-start;
  padding: 12px 14px;
}

/* separator starts after the thumbnail, like a UITableView cell */
.slot-main + .slot-main::before {
  left: 66px;
}

.slot-main .ios-chevron {
  align-self: center;
}

.thumb {
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border: 1.5px solid;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus {
  font-size: 20px;
  color: var(--text-lo);
}

.slot-txt {
  flex: 1;
  min-width: 0;
}

.slot-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
}

.slot-name {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.dept-tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.part-name {
  margin: 1px 0 0;
  font-size: 13px;
  color: var(--text-mid);
  letter-spacing: -0.01em;
}

.calc {
  margin: 5px 0 0;
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--text-lo);
}

.calc strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--tint);
  margin-right: 5px;
  text-transform: capitalize;
}

.calc.empty {
  font-style: italic;
}

.explain {
  margin-top: 6px;
}

.synergy-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 7px;
  padding-top: 7px;
  border-top: 1px solid var(--hairline);
  font-size: 11px;
  color: var(--text-mid);
}

.synergy-row strong {
  font-family: var(--font-heading);
  font-size: 15px;
  color: var(--text-hi);
}

.totals {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-mid);
}

.totals strong {
  font-family: var(--font-heading);
  color: var(--text-hi);
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 9px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.cell {
  padding: 0;
  min-width: 0;
  overflow: hidden;
}
</style>
