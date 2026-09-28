<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useScrolled } from '@/composables/useScrolled.js'
import SmartImage from '@/components/SmartImage.vue'
import CardDetail from '@/components/CardDetail.vue'
import BottomSheet from '@/components/BottomSheet.vue'
import { useGameStore } from '@/stores/game.js'
import { ASSETS, cardArt, placeholderFill, rarityFill, rarityLabel, typeLabels } from '@/game/visuals.js'

const router = useRouter()
const game = useGameStore()
const { scrolled, onScroll } = useScrolled(40)

/* idle → watching (10s countdown stands in for live coverage)
   → ready → opening (pack burst) → revealed */
const stage = ref('idle')
const countdown = ref(10)
const revealCard = ref(null)
const detail = ref(false)
let timer = null
let burstTimer = null

const WATCH_SECONDS = 10
const progress = computed(() => ((WATCH_SECONDS - countdown.value) / WATCH_SECONDS) * 100)

/* Arriving from the Collection's "packs to open" banner skips the
   broadcast countdown — you already have the pack. */
const route = useRoute()
onMounted(() => {
  if (route.query.open && game.packs > 0) stage.value = 'ready'
})

function watchNow() {
  stage.value = 'watching'
  countdown.value = WATCH_SECONDS
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(timer)
      game.addPack(1)
      stage.value = 'ready'
    }
  }, 1000)
}

function openPack() {
  if (game.packs <= 0) return
  stage.value = 'opening'
  burstTimer = setTimeout(() => {
    const result = game.openPack()
    revealCard.value = result && result.card ? result.card : null
    stage.value = 'revealed'
  }, 1400)
}

function again() {
  revealCard.value = null
  stage.value = game.packs > 0 ? 'ready' : 'idle'
}

onBeforeUnmount(() => {
  clearInterval(timer)
  clearTimeout(burstTimer)
})
</script>

<template>
  <div class="screen">
    <NavBar title="Live Drop" :scrolled="scrolled">
      <template #action>
        <button class="btn-plain" @click="router.push('/')">Done</button>
      </template>
    </NavBar>

    <div class="screen-body" @scroll="onScroll">
      <template v-if="stage === 'idle'">
        <h1 class="ios-large-title">Live Drop</h1>
        <p class="helper sub">Watch live coverage, earn a pack, unlock a card.</p>
      </template>

      <!-- IDLE -->
      <template v-if="stage === 'idle'">
        <div class="stream panel">
          <div class="stream-art">
            <SmartImage :src="ASSETS.backgroundBattle" alt="" label="LIVE FEED" color="#1D1E22" />
            <span class="live-pill"><i></i> LIVE</span>
          </div>
          <h2>Grand Prix — live now</h2>
          <p class="helper">
            In the real product this rewards you for watching the race broadcast. In this demo a
            10-second countdown stands in for it.
          </p>
        </div>
        <button class="btn btn--red big" @click="watchNow">Watch Now</button>
        <button v-if="game.packs > 0" class="btn btn--ghost big" @click="stage = 'ready'">
          Open a pack I already have ({{ game.packs }})
        </button>
      </template>

      <!-- WATCHING -->
      <template v-else-if="stage === 'watching'">
        <div class="watching">
          <div class="ring">
            <span class="count">{{ countdown }}</span>
          </div>
          <p class="eyebrow">Watching live coverage</p>
          <p class="helper">Stay on the broadcast to earn your pack.</p>
          <div class="track"><div class="fill" :style="{ width: progress + '%' }"></div></div>
        </div>
      </template>

      <!-- READY -->
      <template v-else-if="stage === 'ready'">
        <div class="pack-stage">
          <div class="pack" @click="openPack">
            <SmartImage :src="ASSETS.packClosed" alt="Card pack" label="PACK" color="var(--color-primary-blue)" />
          </div>
          <h2>Pack earned</h2>
          <p class="helper">You have {{ game.packs }} pack{{ game.packs === 1 ? '' : 's' }}. Tap the pack to open it.</p>
        </div>
        <button class="btn big" @click="openPack">Open Pack</button>
      </template>

      <!-- OPENING -->
      <template v-else-if="stage === 'opening'">
        <div class="pack-stage">
          <div class="pack burst">
            <SmartImage :src="ASSETS.packBurst" alt="" label="OPENING" color="var(--color-keyline-red)" />
          </div>
          <p class="eyebrow flash">Opening…</p>
        </div>
      </template>

      <!-- REVEALED -->
      <template v-else>
        <div class="reveal">
          <template v-if="revealCard">
            <p class="eyebrow">{{ typeLabels[revealCard.type] }} unlocked</p>
            <div
              class="reveal-card"
              :style="{ borderColor: rarityFill(revealCard.rarity), background: revealCard.rarity === 'legend' ? rarityFill('legend') : 'transparent' }"
            >
              <SmartImage
                :src="cardArt(revealCard.id)"
                :label="revealCard.name"
                :color="placeholderFill(revealCard)"
                :gradient="revealCard.rarity === 'legend' ? rarityFill('legend') : ''"
                :focus="revealCard.type === 'staff' || revealCard.type === 'driver' ? '50% 30%' : '50% 50%'"
              />
            </div>
            <h2>{{ revealCard.name }}</h2>
            <span class="rar" :style="{ background: rarityFill(revealCard.rarity) }">
              {{ rarityLabel(revealCard.rarity) }}
            </span>
            <p class="helper">{{ revealCard.role || revealCard.legacy || revealCard.flavour }}</p>
            <button class="link" @click="detail = true">View full card ›</button>
          </template>
          <template v-else>
            <h2>Collection complete</h2>
            <p class="helper">Every card in the demo set is already unlocked.</p>
          </template>
        </div>
        <div class="reveal-actions">
          <button class="btn btn--ghost" :disabled="game.packs <= 0" @click="again">
            Open another ({{ game.packs }})
          </button>
          <button class="btn" @click="router.push('/collection')">Collection</button>
        </div>
      </template>
    </div>

    <BottomSheet :open="detail" :title="revealCard ? revealCard.name : ''" @close="detail = false">
      <CardDetail v-if="revealCard" :card="revealCard" />
    </BottomSheet>
  </div>
</template>

<style scoped>
.sub {
  margin: 5px 0 16px;
}

.stream-art {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface-3);
}

.live-pill {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--color-keyline-red);
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
  padding: 4px 7px;
  border-radius: 5px;
}

.live-pill i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  animation: pulse 1.3s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

h2 {
  font-size: 19px;
  text-transform: uppercase;
  margin: 12px 0 5px;
}

.big {
  margin-top: 12px;
}

/* watching */
.watching {
  text-align: center;
  padding-top: 60px;
}

.ring {
  width: 132px;
  height: 132px;
  margin: 0 auto 20px;
  border-radius: 50%;
  border: 3px solid var(--color-keyline-red);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: breathe 1s infinite ease-in-out;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

.count {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 52px;
}

.watching .track {
  height: 6px;
  border-radius: 3px;
  background: var(--surface-2);
  overflow: hidden;
  margin-top: 18px;
}

.watching .fill {
  height: 100%;
  background: var(--color-keyline-red);
  transition: width 1s linear;
}

/* pack */
.pack-stage {
  text-align: center;
  padding-top: 40px;
}

.pack {
  width: 172px;
  height: 232px;
  margin: 0 auto;
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 2px solid var(--color-primary-blue);
  animation: float 2.4s ease-in-out infinite;
  cursor: pointer;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-9px) rotate(1deg); }
}

.pack.burst {
  border-color: var(--color-keyline-red);
  animation: burst 1.4s forwards cubic-bezier(0.2, 0.8, 0.3, 1);
}

@keyframes burst {
  0% { transform: scale(1); opacity: 1; }
  45% { transform: scale(1.22) rotate(3deg); }
  70% { transform: scale(0.9) rotate(-2deg); box-shadow: 0 0 60px 20px rgba(255, 215, 0, 0.6); }
  100% { transform: scale(2.1); opacity: 0; box-shadow: 0 0 120px 60px rgba(255, 215, 0, 0); }
}

.flash {
  margin-top: 34px;
  animation: flash 0.6s infinite alternate;
}

@keyframes flash {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

/* reveal */
.reveal {
  text-align: center;
  padding-top: 14px;
  animation: rise 0.45s ease both;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(18px) scale(0.94); }
  to { opacity: 1; transform: none; }
}

.reveal-card {
  width: 196px;
  aspect-ratio: 3 / 4;
  margin: 10px auto 0;
  border: 2px solid;
  border-radius: var(--radius-card);
  overflow: hidden;
  padding: 3px;
}

.rar {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-black);
  padding: 4px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.link {
  margin-top: 10px;
  font-size: 12px;
  color: var(--color-primary-blue);
  font-weight: 600;
}

.reveal-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}
</style>
