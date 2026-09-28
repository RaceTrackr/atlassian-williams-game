<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useScrolled } from '@/composables/useScrolled.js'
import BottomSheet from '@/components/BottomSheet.vue'
import CardTile from '@/components/CardTile.vue'
import CardDetail from '@/components/CardDetail.vue'
import SmartImage from '@/components/SmartImage.vue'
import { useGameStore } from '@/stores/game.js'
import { DEPARTMENTS } from '@/data/cards.js'
import { STAFF_SLOT_TOTAL } from '@/game/engine.js'
import { ASSETS, cardArt, placeholderFill, rarityFill } from '@/game/visuals.js'

const router = useRouter()
const game = useGameStore()
const { scrolled, onScroll } = useScrolled(40)

const summary = computed(() => game.summary)
const deptList = computed(() => Object.values(DEPARTMENTS).map((d) => summary.value.departments[d.key]))

/* ---------------- slot picking ---------------- */
const picker = ref(null) // { kind, deptKey, index, title }
const detail = ref(null)

function openPicker(kind, deptKey = null, index = null) {
  picker.value = { kind, deptKey, index }
}

const pickerOptions = computed(() => {
  const p = picker.value
  if (!p) return []
  if (p.kind === 'driver') return game.ownedCards.filter((c) => c.type === 'driver')
  if (p.kind === 'car') return game.ownedCards.filter((c) => c.type === 'car')
  return game.ownedCards.filter((c) => c.type === 'staff' && c.department === p.deptKey)
})

const pickerTitle = computed(() => {
  const p = picker.value
  if (!p) return ''
  if (p.kind === 'driver') return 'Pick a driver'
  if (p.kind === 'car') return 'Pick a car'
  const d = DEPARTMENTS[p.deptKey]
  return p.index === 'lead' ? `Pick ${d.label} Lead` : `Pick ${d.label} staff`
})

const pickerSubtitle = computed(() => {
  const p = picker.value
  if (!p) return ''
  return p.index === 'lead' ? 'Lead slot' : 'Only cards you own are shown'
})

function choose(card) {
  const p = picker.value
  if (!p) return
  if (p.kind === 'driver') game.setDriver(card.id)
  else if (p.kind === 'car') game.setCar(card.id)
  else game.setStaff(p.deptKey, p.index, card.id)
  picker.value = null
}

function clearCurrent() {
  const p = picker.value
  if (!p) return
  if (p.kind === 'driver') game.squad.driver = null
  else if (p.kind === 'car') game.squad.car = null
  else game.clearSlot(p.deptKey, p.index)
  picker.value = null
}

function slotCard(deptKey, index) {
  const dept = game.squad.departments[deptKey]
  const id = index === 'lead' ? dept.lead : dept.regular[index]
  return id ? game.ownedCards.find((c) => c.id === id) || null : null
}

function isChem(card) {
  return !!card && !!summary.value.driverEra && card.era === summary.value.driverEra
}

/* Slots for a department, rendered in order: Lead first, then regulars. */
function slotKeys(dept) {
  const meta = DEPARTMENTS[dept.key]
  const keys = meta.hasLead ? ['lead'] : []
  const regularCount = meta.hasLead ? meta.slots - 1 : meta.slots
  for (let i = 0; i < regularCount; i++) keys.push(i)
  return keys
}
</script>

<template>
  <div class="screen">
    <NavBar title="Squad Builder" :scrolled="scrolled">
      <template #action>
        <button class="btn-plain" @click="game.autoFillSquad()">Auto-fill</button>
      </template>
    </NavBar>

    <div class="screen-body" @scroll="onScroll">
      <h1 class="ios-large-title">Squad Builder</h1>
      <p class="helper sub">
        {{ summary.filledSlots }}/{{ summary.totalSlots }} filled — driver, car and
        {{ STAFF_SLOT_TOTAL }} staff across 5 departments.
      </p>

      <!-- Driver + Car -->
      <p class="ios-section-header">Driver &amp; Car</p>
      <div class="hero-slots">
        <button class="hero-slot" @click="openPicker('driver')">
          <span class="eyebrow">Driver</span>
          <div class="hero-art" :style="{ borderColor: summary.driver ? rarityFill(summary.driver.rarity) : 'var(--hairline)' }">
            <SmartImage
              :src="summary.driver ? cardArt(summary.driver.id) : ASSETS.driverSilhouette"
              :label="summary.driver ? summary.driver.name : 'Empty'"
              :color="summary.driver ? placeholderFill(summary.driver) : '#26282E'"
              :gradient="summary.driver && summary.driver.rarity === 'legend' ? rarityFill('legend') : ''"
              focus="50% 30%"
            />
          </div>
          <p class="hero-name">{{ summary.driver ? summary.driver.name : 'Tap to select' }}</p>
          <p class="hero-sub">{{ summary.driver ? summary.driver.years : '—' }}</p>
        </button>

        <button class="hero-slot" @click="openPicker('car')">
          <span class="eyebrow">Car</span>
          <div class="hero-art" :style="{ borderColor: summary.car ? rarityFill(summary.car.rarity) : 'var(--hairline)' }">
            <SmartImage
              :src="summary.car ? cardArt(summary.car.id) : ASSETS.car"
              :label="summary.car ? summary.car.name : 'Empty'"
              :color="summary.car ? placeholderFill(summary.car) : '#26282E'"
              :gradient="summary.car && summary.car.rarity === 'legend' ? rarityFill('legend') : ''"
            />
          </div>
          <p class="hero-name">{{ summary.car ? summary.car.name : 'Tap to select' }}</p>
          <p class="hero-sub">{{ summary.car ? summary.car.years : '—' }}</p>
        </button>
      </div>

      <button v-if="summary.car" class="garage-link" @click="router.push('/garage')">
        ⚙ Fit parts to the {{ summary.car.name }} in the Garage ›
      </button>

      <!-- Departments -->
      <section v-for="dept in deptList" :key="dept.key" class="dept panel" :style="{ '--dept': dept.color }">
        <div class="dept-hdr">
          <div class="dept-title">
            <span class="dot"></span>
            <div>
              <h2>{{ dept.label }}</h2>
            </div>
          </div>
          <span
            v-if="dept.badge"
            class="badge"
            :class="`badge--${dept.badge.tier}`"
          >{{ dept.badge.label }}</span>
        </div>

        <!-- slots -->
        <div class="slots" :style="{ '--cols': dept.totalSlots > 4 ? 3 : dept.totalSlots > 1 ? 4 : 1 }">
          <button
            v-for="k in slotKeys(dept)"
            :key="String(k)"
            class="slot"
            :class="{ 'slot--lead': k === 'lead', 'slot--filled': !!slotCard(dept.key, k), 'slot--wide': dept.totalSlots === 1 }"
            @click="openPicker('staff', dept.key, k)"
          >
            <template v-if="slotCard(dept.key, k)">
              <CardTile
                :card="slotCard(dept.key, k)"
                size="sm"
                :lead="k === 'lead'"
                :chemistry="isChem(slotCard(dept.key, k))"
              />
            </template>
            <template v-else>
              <span class="plus">+</span>
              <span class="slot-lbl">{{ k === 'lead' ? 'Lead' : 'Empty' }}</span>
            </template>
          </button>
        </div>

        <!-- live maths -->
        <div class="maths">
          <div class="maths-row">
            <span>{{ dept.statLabel }} (effective)</span>
            <strong :style="{ color: dept.color }">{{ dept.effective }}</strong>
          </div>
          <p v-if="dept.hasLead && !dept.leadFilled" class="warn">No Lead equipped</p>
          <div class="track">
            <div class="fill" :style="{ width: Math.min(100, dept.effective) + '%', background: dept.color }"></div>
          </div>
        </div>
      </section>

    </div>

    <!-- power footer -->
    <div class="screen-footer">
      <div class="power-row">
        <div>
          <p class="eyebrow">Squad Power</p>
          <p class="power num-neon">{{ summary.squadPower }}</p>
        </div>
        <div class="breakdown">
          <span>Driver {{ summary.driverStatsTotal }}</span>
          <span>Car {{ summary.carBaseStatsTotal }}</span>
          <span>Parts +{{ summary.partsTotal }}</span>
          <span>Media {{ summary.mediaStat }} · Perf {{ summary.performanceStat }}</span>
          <span class="tp">TP ×{{ (1 + summary.teamPrincipalMultiplier).toFixed(3) }}</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn--ghost" @click="game.resetSquad()">Reset</button>
        <button class="btn" :disabled="!game.squadComplete" @click="router.push('/battle')">
          To Battle
        </button>
      </div>
    </div>

    <!-- picker -->
    <BottomSheet :open="!!picker" :title="pickerTitle" :subtitle="pickerSubtitle" @close="picker = null">
      <p v-if="pickerOptions.some((c) => game.squadUsage[c.id])" class="footnote in-use-note">
        Cards marked ✓ are already somewhere in your squad — picking one moves it here and empties
        its old slot.
      </p>
      <div v-if="pickerOptions.length" class="picker-grid">
        <button v-for="c in pickerOptions" :key="c.id" class="pick" @click="choose(c)">
          <CardTile
            :card="c"
            :lead="!!c.isLead"
            :chemistry="isChem(c)"
            :in-use="game.squadUsage[c.id] || ''"
          />
          <span class="info" @click.stop="detail = c">i</span>
        </button>
      </div>
      <p v-else class="helper">No owned cards for this slot yet — open a pack on the Live Drop screen.</p>
      <button class="btn btn--ghost clear" @click="clearCurrent">Clear slot</button>
    </BottomSheet>

    <BottomSheet :open="!!detail" :title="detail ? detail.name : ''" @close="detail = null">
      <CardDetail v-if="detail" :card="detail" />
    </BottomSheet>
  </div>
</template>

<style scoped>
.sub {
  margin: 5px 0 18px;
}

.ios-section-header {
  margin-top: 0;
}

.hero-slots {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.hero-slot {
  min-width: 0;
  overflow: hidden;
  background: var(--surface-1);
  border-radius: var(--radius-ios);
  padding: 10px;
  text-align: left;
}

.hero-art {
  width: 100%;
  aspect-ratio: 4 / 3;
  margin: 6px 0 7px;
  border: 1.5px solid;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface-3);
}

.hero-name {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 13px;
  line-height: 1.1;
}

.hero-sub {
  margin: 2px 0 0;
  font-size: 10px;
  color: var(--text-lo);
}

.garage-link {
  width: 100%;
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-ios);
  background: var(--surface-1);
  color: var(--tint);
  font-size: 14px;
  letter-spacing: -0.01em;
  text-align: left;
}

.dept {
  margin-top: 12px;
  padding: 12px;
}

.dept-hdr {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.dept-title {
  display: flex;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dept);
  margin-top: 5px;
  flex-shrink: 0;
}

h2 {
  font-size: 14px;
  text-transform: uppercase;
  line-height: 1;
}

.dept-hdr .helper {
  margin: 4px 0 0;
  font-size: 10px;
}

.badge {
  flex-shrink: 0;
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 7px;
  border-radius: 6px;
  background: var(--surface-3);
  color: var(--text-mid);
}

.badge--full-roster {
  background: var(--color-keyline-white);
  color: var(--color-black);
}

.badge--full-synergy {
  background: var(--grad-gold);
  color: var(--color-black);
  box-shadow: var(--glow-gold);
  animation: badge-pulse 2.2s ease-in-out infinite;
}

@keyframes badge-pulse {
  50% {
    box-shadow: 0 0 34px rgba(255, 215, 0, 0.75);
  }
}

.slots {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: 6px;
  margin-top: 10px;
}

.slot {
  min-height: 62px;
  min-width: 0;
  padding: 0;
  border-radius: 10px;
  border: 1px dashed var(--hairline);
  background: var(--surface-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  overflow: hidden;
}

.slot--filled {
  border-style: solid;
  border-color: transparent;
  background: transparent;
  padding: 0;
}

.slot--lead:not(.slot--filled) {
  border-color: var(--dept);
  border-style: solid;
}

.plus {
  font-size: 16px;
  color: var(--text-lo);
  line-height: 1;
}

.slot-lbl {
  font-size: 8.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-lo);
  font-family: var(--font-heading);
  font-weight: 700;
}

.slot--lead .slot-lbl {
  color: var(--dept);
}

.maths {
  margin-top: 10px;
  padding-top: 9px;
  border-top: 1px solid var(--hairline);
}

.maths-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 11px;
  color: var(--text-mid);
}

.maths-row strong {
  font-family: var(--font-heading);
  font-size: 17px;
}

.warn {
  margin: 3px 0 6px;
  font-size: 11px;
  color: var(--ios-red);
}

.track {
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.35s var(--spring);
  box-shadow: 0 0 14px -1px var(--dept);
}

.note {
  margin: 14px 0 0;
}

.power-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.power {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 30px;
  line-height: 1;
  margin: 1px 0 0;
}

.breakdown {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 3px 8px;
  justify-content: flex-end;
  font-size: 9.5px;
  color: var(--text-lo);
}

.tp {
  color: var(--color-keyline-red);
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.picker-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.pick {
  position: relative;
  padding: 0;
  min-width: 0;
  overflow: hidden;
}

.info {
  position: absolute;
  bottom: 6px;
  left: 6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(10, 10, 10, 0.8);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear {
  margin-top: 12px;
}

.in-use-note {
  margin: 0 0 10px;
}
</style>
