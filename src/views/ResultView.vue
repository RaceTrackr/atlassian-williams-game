<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game.js'

const router = useRouter()
const game = useGameStore()
const r = computed(() => game.lastBattle)
</script>

<template>
  <div class="screen">
    <div v-if="!r" class="screen-body empty">
      <p class="helper">No race run yet.</p>
      <button class="btn" @click="router.push('/battle')">Go to Battle</button>
    </div>

    <template v-else>
      <div class="screen-body" :class="r.win ? 'won' : 'lost'">
        <p class="eyebrow">Race result</p>
        <h1 :class="r.win ? 'num-neon--gold' : 'defeat'">{{ r.win ? 'Victory' : 'Defeat' }}</h1>
        <p class="sub">
          {{ r.phasesWon }} of {{ r.phases.length }} phases won vs {{ r.opponentName }}
        </p>

        <div class="score panel">
          <div>
            <p class="eyebrow">You</p>
            <p class="num">{{ r.playerTotal }}</p>
          </div>
          <div class="mid">–</div>
          <div class="right">
            <p class="eyebrow">Rivals</p>
            <p class="num">{{ r.oppTotal }}</p>
          </div>
        </div>

        <p class="eyebrow section">Phase by phase</p>
        <div v-for="p in r.phases" :key="p.key" class="phase panel" :class="p.won ? 'w' : 'l'">
          <div class="phase-top">
            <span class="name">{{ p.label }}</span>
            <span class="tag">{{ p.won ? 'WON' : 'LOST' }}</span>
          </div>
          <p v-if="p.detail" class="game-line" :class="`q-${p.quality}`">
            {{ p.game }} · {{ p.detail }}
          </p>
          <div class="bars">
            <div class="bar">
              <div class="fill me" :style="{ width: (p.player / Math.max(p.player, p.opponent)) * 100 + '%' }"></div>
            </div>
            <div class="bar">
              <div class="fill them" :style="{ width: (p.opponent / Math.max(p.player, p.opponent)) * 100 + '%' }"></div>
            </div>
          </div>
          <p class="nums">{{ p.player }} vs {{ p.opponent }}
            <span v-if="p.bonus"> · minigame {{ p.bonus >= 0 ? '+' : '' }}{{ p.bonus }}</span>
            <span v-if="p.hypeBonus"> · fan hype +{{ p.hypeBonus }}</span>
          </p>
        </div>

        <div class="panel extras">
          <div class="x-row"><span>Squad power taken into the race</span><strong>{{ r.squadPower }}</strong></div>
          <div class="x-row"><span>Fan Hype at the flag</span><strong>{{ r.hype }}%</strong></div>
          <div class="x-row">
            <span>Minigames nailed</span>
            <strong>{{ r.phases.filter((p) => p.quality === 'perfect').length }}/{{ r.phases.length }}</strong>
          </div>
        </div>

        <p v-if="r.win" class="reward">🎁 Race win reward: +1 card pack</p>
      </div>

      <div class="screen-footer">
        <div class="actions">
          <button class="btn btn--ghost" @click="router.push('/')">Home</button>
          <button class="btn" @click="router.push('/battle')">Race again</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.screen-body {
  padding-top: 26px;
}

.screen-body.won {
  background: radial-gradient(120% 60% at 50% 0%, rgba(0, 196, 140, 0.25), transparent 70%);
}

.screen-body.lost {
  background: radial-gradient(120% 60% at 50% 0%, rgba(200, 16, 46, 0.25), transparent 70%);
}

h1 {
  font-size: 48px;
  line-height: 0.9;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin: 4px 0 6px;
}

h1.defeat {
  color: var(--ios-red);
  text-shadow: 0 0 26px rgba(255, 69, 58, 0.5);
}

.sub {
  margin: 0 0 14px;
  font-size: 12px;
  color: var(--text-mid);
}

.score {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score .right {
  text-align: right;
}

.num {
  margin: 2px 0 0;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 34px;
  line-height: 1;
}

.mid {
  color: var(--text-lo);
  font-size: 18px;
}

.section {
  display: block;
  margin: 16px 0 8px;
}

.phase {
  margin-bottom: 8px;
  padding: 11px 12px;
}

.phase.w {
  border-left: 3px solid #00c48c;
}

.phase.l {
  border-left: 3px solid var(--color-keyline-red);
}

.phase-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.name {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
}

.tag {
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--text-mid);
}

.bars {
  margin: 8px 0 5px;
  display: grid;
  gap: 4px;
}

.bar {
  height: 7px;
  border-radius: 4px;
  background: var(--surface-3);
  overflow: hidden;
}

.fill {
  height: 100%;
}

.fill.me {
  background: var(--color-primary-blue);
}

.fill.them {
  background: var(--text-lo);
}

.nums {
  margin: 0;
  font-size: 11px;
  color: var(--text-lo);
}

.game-line {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-mid);
}

.q-perfect {
  color: var(--ios-green);
}

.q-jumpstart,
.q-miss {
  color: var(--ios-red);
}

.extras {
  margin-top: 12px;
}

.x-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 11px;
  color: var(--text-mid);
  padding: 5px 0;
}

.x-row strong {
  font-family: var(--font-heading);
  font-size: 14px;
  color: var(--text-hi);
}

.cap {
  text-transform: capitalize;
}

.reward {
  margin: 12px 0 0;
  font-size: 12px;
  color: #ffd700;
}

.tip {
  margin-top: 10px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
