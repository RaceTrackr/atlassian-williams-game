<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import SmartImage from '@/components/SmartImage.vue'
import ReactionStart from '@/components/minigames/ReactionStart.vue'
import LateBraking from '@/components/minigames/LateBraking.vue'
import PitStopQte from '@/components/minigames/PitStopQte.vue'
import TyreHold from '@/components/minigames/TyreHold.vue'
import { useGameStore } from '@/stores/game.js'
import { PHASES, MINIGAMES, phaseRating, minigameBonus } from '@/game/engine.js'
import { ASSETS, cardArt, placeholderFill, rarityFill } from '@/game/visuals.js'

const router = useRouter()
const game = useGameStore()

const summary = computed(() => game.summary)
const opponent = game.opponent

/* stage: intro → minigame → phase (resolve + compare) → … → result */
const stage = ref('intro')
const phaseIndex = ref(0)
const results = reactive([])
const hype = ref(0)
/* Outcome of the current phase's minigame. */
const play = reactive({ quality: null, detail: '' })

const phase = computed(() => PHASES[phaseIndex.value])
const pitCrewStat = computed(() => summary.value.departments.pitCrew.effective)
const mediaStat = computed(() => summary.value.mediaStat)

/* Each phase has its own minigame; difficulty comes from the squad. */
const GAME_COMPONENTS = { ReactionStart, LateBraking, PitStopQte, TyreHold }
const gameComponent = computed(() => GAME_COMPONENTS[MINIGAMES[phase.value.key].component])
const gameProps = computed(() => {
  switch (phase.value.key) {
    case 'start':
      return { racecraft: summary.value.driver ? summary.value.driver.stats.racecraft : 50 }
    case 'openingStint':
      return { overtaking: summary.value.driver ? summary.value.driver.stats.overtaking : 50 }
    case 'pitWindow':
      return { pitCrewStat: pitCrewStat.value }
    default:
      return { performanceStat: summary.value.performanceStat }
  }
})

/* Fan Hype fill rate comes straight from the Media department. */
const hypeGain = (won) => Math.round((won ? 18 : 7) * (1 + mediaStat.value / 60))

const revealed = ref(false)
let revealTimer = null

function start() {
  results.splice(0)
  hype.value = 0
  phaseIndex.value = 0
  enterPhase()
}

function enterPhase() {
  revealed.value = false
  play.quality = null
  play.detail = ''
  stage.value = 'minigame'
}

/* Every phase is preceded by its own minigame; the result feeds the
   comparison as a percentage swing, never as an automatic win. */
function onGameDone(payload) {
  play.quality = payload.quality
  play.detail = payload.detail || ''
  stage.value = 'phase'
  revealTimer = setTimeout(resolvePhase, 420)
}

/* ---------------------------- resolution ---------------------------- */
function resolvePhase() {
  const key = phase.value.key
  const base = phaseRating(key, summary.value)
  const bonus = minigameBonus(play.quality, base)
  let player = base + bonus
  if (key === 'closingStint') player += hype.value * 0.15 // hype pays off at the end
  const opp = opponent.phaseRatings[key]
  const won = player >= opp

  results.push({
    key,
    label: phase.value.label,
    game: MINIGAMES[key].name,
    player: Math.round(player),
    base: Math.round(base),
    opponent: opp,
    won,
    quality: play.quality,
    detail: play.detail,
    bonus,
    hypeBonus: key === 'closingStint' ? Math.round(hype.value * 0.15) : 0,
  })
  hype.value = Math.min(100, hype.value + hypeGain(won))
  revealed.value = true
}

function next() {
  if (phaseIndex.value < PHASES.length - 1) {
    phaseIndex.value += 1
    enterPhase()
  } else {
    finish()
  }
}

function finish() {
  const won = results.filter((r) => r.won).length
  const playerTotal = results.reduce((a, r) => a + r.player, 0)
  const oppTotal = results.reduce((a, r) => a + r.opponent, 0)
  game.recordBattle({
    phases: results.map((r) => ({ ...r })),
    phasesWon: won,
    win: won > PHASES.length / 2 || (won === PHASES.length / 2 && playerTotal >= oppTotal),
    playerTotal,
    oppTotal,
    hype: Math.round(hype.value),
    squadPower: summary.value.squadPower,
    opponentName: opponent.name,
  })
  // Winning a race earns a pack — that closes the loop back to Live Drop.
  if (won >= PHASES.length / 2) game.addPack(1)
  router.push('/result')
}

const current = computed(() => results[results.length - 1] || null)
const barMax = computed(() =>
  current.value ? Math.max(current.value.player, current.value.opponent) * 1.1 : 1
)

onBeforeUnmount(() => clearTimeout(revealTimer))
</script>

<template>
  <div class="screen">
    <div class="bg">
      <SmartImage :src="ASSETS.backgroundBattle" alt="" color="#12060A" />
    </div>

    <!-- INTRO -->
    <template v-if="stage === 'intro'">
      <div class="screen-body">
        <button class="back" @click="router.push('/')">← Home</button>
        <p class="eyebrow">Race Battle</p>
        <h1>Four phases.<br />One result.</h1>

        <div class="vs">
          <div class="side">
            <div class="art" :style="{ borderColor: summary.driver ? rarityFill(summary.driver.rarity) : 'var(--hairline)' }">
              <SmartImage
                :src="summary.driver ? cardArt(summary.driver.id) : ASSETS.driverSilhouette"
                :label="summary.driver ? summary.driver.name : 'No driver'"
                :color="summary.driver ? placeholderFill(summary.driver) : '#26282E'"
              />
            </div>
            <p class="side-name">Your Squad</p>
            <p class="side-pow">{{ summary.squadPower }}</p>
            <p class="side-cap">squad power</p>
          </div>
          <span class="vs-mark">VS</span>
          <div class="side">
            <div class="art art--opp"><span>{{ opponent.short }}</span></div>
            <p class="side-name">{{ opponent.name }}</p>
            <p class="side-pow">{{ Object.values(opponent.phaseRatings).reduce((a, b) => a + b, 0) }}</p>
            <p class="side-cap">combined phase rating</p>
          </div>
        </div>

        <p class="ios-section-header">Each phase has a minigame</p>
        <ul class="phase-list">
          <li v-for="p in PHASES" :key="p.key">
            <div class="pl-top">
              <strong>{{ p.label }}</strong>
              <span class="pl-game">{{ MINIGAMES[p.key].name }}</span>
            </div>
            <span class="helper">{{ MINIGAMES[p.key].how }}</span>
          </li>
        </ul>

        <div v-if="!game.squadComplete" class="warn panel">
          Equip at least a driver and a car in the Squad Builder first.
        </div>
      </div>
      <div class="screen-footer">
        <button class="btn btn--red" :disabled="!game.squadComplete" @click="start">Start Race</button>
      </div>
    </template>

    <!-- MINIGAME (one per phase) -->
    <template v-else-if="stage === 'minigame'">
      <div class="screen-body game-body">
        <div class="steps">
          <span
            v-for="(p, i) in PHASES"
            :key="p.key"
            class="step"
            :class="{ on: i <= phaseIndex, won: results[i] && results[i].won, lost: results[i] && !results[i].won }"
          ></span>
        </div>
        <component :is="gameComponent" v-bind="gameProps" @done="onGameDone" />
      </div>
    </template>

    <!-- PHASE RESOLUTION -->
    <template v-else>
      <div class="screen-body">
        <div class="steps">
          <span
            v-for="(p, i) in PHASES"
            :key="p.key"
            class="step"
            :class="{ on: i <= phaseIndex, won: results[i] && results[i].won, lost: results[i] && !results[i].won }"
          ></span>
        </div>
        <p class="eyebrow">Phase {{ phaseIndex + 1 }} of 4</p>
        <h1>{{ phase.label }}</h1>
        <p class="helper">{{ phase.blurb }}</p>

        <div v-if="current && revealed" class="compare panel">
          <div class="cmp-row">
            <span class="cmp-lbl">You</span>
            <div class="cmp-track">
              <div
                class="cmp-fill me"
                :style="{ width: (current.player / barMax) * 100 + '%' }"
              ></div>
            </div>
            <span class="cmp-val">{{ current.player }}</span>
          </div>
          <div class="cmp-row">
            <span class="cmp-lbl">{{ opponent.short }}</span>
            <div class="cmp-track">
              <div
                class="cmp-fill them"
                :style="{ width: (current.opponent / barMax) * 100 + '%' }"
              ></div>
            </div>
            <span class="cmp-val">{{ current.opponent }}</span>
          </div>

          <p class="verdict" :class="current.won ? 'win' : 'lose'">
            {{ current.won ? 'Phase won' : 'Phase lost' }}
          </p>
          <p v-if="current.detail" class="bonus" :class="{ penalty: current.bonus < 0 }">
            {{ current.game }}: {{ current.detail }} —
            {{ current.bonus >= 0 ? '+' : '' }}{{ current.bonus }} this phase only
          </p>
          <p v-if="current.hypeBonus" class="bonus">
            Fan Hype carried over — +{{ current.hypeBonus }}
          </p>
        </div>
        <div v-else class="loading panel">Resolving…</div>

        <div class="hype panel">
          <div class="hype-top">
            <span class="eyebrow">Fan Hype</span>
            <span class="hype-rate">{{ Math.round(hype) }}%</span>
          </div>
          <div class="hype-track"><div class="hype-fill" :style="{ width: hype + '%' }"></div></div>
        </div>

        <ul class="log">
          <li v-for="r in results" :key="r.key" :class="r.won ? 'w' : 'l'">
            <span>{{ r.label }}</span>
            <span>{{ r.player }} – {{ r.opponent }}</span>
          </li>
        </ul>
      </div>
      <div class="screen-footer">
        <button class="btn" :disabled="!revealed" @click="next">
          {{ phaseIndex === PHASES.length - 1 ? 'See Result' : 'Next Phase' }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.bg {
  position: absolute;
  inset: 0;
  opacity: 0.45;
}

.bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(200, 16, 46, 0.4), rgba(4, 21, 38, 0.94) 62%);
}

.screen-body {
  position: relative;
  z-index: 1;
  padding-top: 20px;
}

.screen-footer {
  position: relative;
  z-index: 1;
  background: rgba(10, 10, 10, 0.9);
}

.back {
  font-size: 12px;
  color: var(--text-mid);
  margin-bottom: 10px;
}

h1 {
  font-size: 30px;
  line-height: 0.95;
  text-transform: uppercase;
  margin: 3px 0 8px;
}

.vs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
}

.side {
  flex: 1;
  text-align: center;
}

.art {
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 1.5px solid;
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--surface-2);
}

.art--opp {
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: var(--surface-3);
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 32px;
  color: var(--text-lo);
}

.side-name {
  margin: 7px 0 0;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
}

.side-pow {
  margin: 1px 0 0;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 22px;
}

.side-cap {
  margin: 1px 0 0;
  font-size: 8.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-lo);
}

.vs-mark {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 15px;
  color: var(--color-keyline-red);
}

.phase-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.phase-list li {
  display: flex;
  flex-direction: column;
  padding: 9px 0;
  border-top: 1px solid var(--hairline);
}

.phase-list strong {
  font-family: var(--font-heading);
  font-size: 13px;
  text-transform: uppercase;
}

.warn {
  margin-top: 14px;
  border-color: var(--color-keyline-red);
  color: var(--color-keyline-red);
  font-size: 12px;
}

/* steps */
.steps {
  display: flex;
  gap: 5px;
  margin-bottom: 12px;
}

.step {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--surface-3);
}

.step.on {
  background: var(--text-lo);
}

.step.won {
  background: var(--ios-green);
  box-shadow: 0 0 10px rgba(48, 209, 88, 0.7);
}

.step.lost {
  background: var(--ios-red);
  box-shadow: 0 0 10px rgba(255, 69, 58, 0.6);
}

/* compare */
.compare {
  margin-top: 14px;
}

.cmp-row {
  display: grid;
  grid-template-columns: 34px 1fr 44px;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.cmp-lbl {
  font-family: var(--font-heading);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--text-mid);
}

.cmp-track {
  height: 13px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.cmp-fill {
  height: 100%;
  border-radius: 7px;
  transition: width 0.7s var(--spring);
}

.cmp-fill.me {
  background: var(--grad-primary);
  box-shadow: var(--glow-cyan);
}

.cmp-fill.them {
  background: linear-gradient(135deg, #5a5f68, #8b919c);
}

.cmp-val {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 14px;
  text-align: right;
}

.verdict {
  margin: 6px 0 4px;
  font-family: var(--font-heading);
  font-size: 17px;
  font-weight: 900;
  text-transform: uppercase;
}

.verdict.win {
  color: var(--ios-green);
  text-shadow: 0 0 18px rgba(48, 209, 88, 0.6);
}

.verdict.lose {
  color: var(--ios-red);
  text-shadow: 0 0 18px rgba(255, 69, 58, 0.55);
}

.bonus {
  margin: 5px 0 0;
  font-size: 11px;
  color: #ffd700;
  text-transform: capitalize;
}

.loading {
  margin-top: 14px;
  font-size: 12px;
  color: var(--text-lo);
}

/* hype */
.hype {
  margin-top: 10px;
}

.hype-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 7px;
}

.hype-rate {
  font-size: 9.5px;
  color: var(--text-lo);
}

.hype-track {
  height: 8px;
  border-radius: 4px;
  background: var(--surface-3);
  overflow: hidden;
}

.hype-fill {
  height: 100%;
  background: linear-gradient(90deg, #9b5de5, #ffd700);
  transition: width 0.6s ease;
}

.log {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
}

.log li {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 6px 0;
  border-top: 1px solid var(--hairline);
  color: var(--text-mid);
}

.log li.w span:last-child {
  color: #00c48c;
}

.log li.l span:last-child {
  color: var(--color-keyline-red);
}

/* minigame host — the game fills the screen under the phase dots */
.game-body {
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
}

.game-body > :last-child {
  flex: 1;
  min-height: 0;
}

.pl-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.pl-game {
  font-size: 12px;
  font-weight: 600;
  color: var(--tint);
  letter-spacing: -0.01em;
}

.bonus.penalty {
  color: var(--ios-red);
}
</style>
