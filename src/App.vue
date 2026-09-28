<script setup>
/* The app runs inside a fixed 390x844 screen, wrapped in a CSS-drawn
   iPhone shell (bezel, titanium rail, side buttons). Nothing inside
   the screen ever exceeds 390x844 — tall content scrolls internally.

   If the window is shorter than the device, the whole thing scales
   down uniformly rather than being clipped, so it stays the same fixed
   rectangle on any monitor — just smaller on a short window.

   To swap the CSS shell for a real device image: drop a transparent
   PNG at /assets/components/b9-device-frame.png and set USE_IMAGE_SHELL
   to true — the screen insets below (BEZEL) must match the artwork. */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusBar from '@/components/StatusBar.vue'
import TabBar from '@/components/TabBar.vue'
import { ASSETS } from '@/game/visuals.js'

const SCREEN_W = 390
const SCREEN_H = 844
const BEZEL = 12
const DEVICE_W = SCREEN_W + BEZEL * 2
const DEVICE_H = SCREEN_H + BEZEL * 2
const MARGIN = 28

const route = useRoute()
const scale = ref(1)

function fit() {
  scale.value = Math.min(
    1,
    (window.innerHeight - MARGIN) / DEVICE_H,
    (window.innerWidth - MARGIN) / DEVICE_W
  )
}

onMounted(() => {
  fit()
  window.addEventListener('resize', fit)

  /* Page background behind the phone. Set here rather than in CSS so the
     URL honours BASE_URL; it simply won't paint until the art exists,
     leaving the navy fallback. */
  document.body.style.backgroundImage = `url('${ASSETS.pageBackground}')`
  document.body.style.backgroundSize = 'cover'
  document.body.style.backgroundPosition = 'center'
  document.body.style.backgroundAttachment = 'fixed'
  document.body.style.backgroundRepeat = 'no-repeat'
})
onBeforeUnmount(() => window.removeEventListener('resize', fit))

/* Tab bar shows on the main sections; the race flow and the live drop
   present modally over it, as they would on iOS. */
const showTabs = computed(() => route.meta.tab === true)

/* Transition choice mirrors UIKit:
   - tab → tab            : no push, just a quick crossfade (iOS tab bars
                            switch instantly; a slide would be wrong)
   - → modal route        : cover vertically from the bottom
   - modal → back         : dismiss downward
   - anything else        : horizontal push */
const transition = ref('fade')
useRouter().afterEach((to, from) => {
  if (to.meta.transition === 'modal') transition.value = 'modal'
  else if (from.meta.transition === 'modal') transition.value = 'modal-out'
  else if (to.meta.tab && from.meta.tab) transition.value = 'fade'
  else transition.value = 'push'
})
</script>

<template>
  <div class="device-fit" :style="{ width: DEVICE_W * scale + 'px', height: DEVICE_H * scale + 'px' }">
    <div class="device" :style="{ transform: `scale(${scale})` }">
      <!-- side buttons -->
      <span class="btn-silent"></span>
      <span class="btn-vol btn-vol--up"></span>
      <span class="btn-vol btn-vol--dn"></span>
      <span class="btn-power"></span>

      <div class="screen-shell" :class="{ 'has-tabbar': showTabs }">
        <!-- No `mode` here on purpose: an iOS push moves both screens at
             the same time. out-in would play them one after the other. -->
        <RouterView v-slot="{ Component }">
          <Transition :name="transition">
            <component :is="Component" :key="$route.path" />
          </Transition>
        </RouterView>

        <StatusBar />
        <TabBar v-if="showTabs" />
        <div class="home-indicator"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-fit {
  position: relative;
  flex: 0 0 auto;
}

/* Titanium-ish rail: a thin gradient edge around a black bezel. */
.device {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  width: 414px;
  height: 868px;
  padding: 12px;
  border-radius: 56px;
  background: linear-gradient(145deg, #d9dadd 0%, #8e9094 18%, #5f6165 42%, #303134 62%, #7c7e82 88%, #babcc0 100%);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.42), 0 2px 4px rgba(255, 255, 255, 0.35) inset;
}

/* Inner black body between rail and glass */
.device::before {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 53px;
  background: #0a0a0c;
}

.screen-shell {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 390px;
  height: 844px;
  border-radius: 44px;
  overflow: hidden;
  background: #041526;
  /* glass edge */
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
}

/* Fine scanlines plus a corner glow, laid over everything at very low
   opacity — reads as a lit display rather than a web page. */
.screen-shell::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 80;
  pointer-events: none;
  background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.025) 0 1px,
      transparent 1px 3px
    ),
    radial-gradient(90% 55% at 50% -10%, rgba(0, 229, 255, 0.1), transparent 70%);
}

/* ---- side buttons ---- */
.btn-silent,
.btn-vol,
.btn-power {
  position: absolute;
  background: linear-gradient(180deg, #a7a9ad, #6d6f73 45%, #48494d);
  border-radius: 2px;
}

.btn-silent {
  left: -2px;
  top: 118px;
  width: 3px;
  height: 30px;
}

.btn-vol {
  left: -2px;
  width: 3px;
  height: 58px;
}

.btn-vol--up {
  top: 172px;
}

.btn-vol--dn {
  top: 244px;
}

.btn-power {
  right: -2px;
  top: 208px;
  width: 3px;
  height: 92px;
}

/* ---- home indicator ---- */
.home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.85);
  z-index: 60;
  pointer-events: none;
}
</style>
