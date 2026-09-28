<script setup>
/* iOS navigation bar. Sits under the status bar, stays transparent
   over the content until the screen is scrolled, then fades in its
   material background, hairline and inline title — the standard
   large-title collapse behaviour. */
import { useRouter } from 'vue-router'

defineProps({
  title: { type: String, required: true },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
  scrolled: { type: Boolean, default: false },
})

const router = useRouter()
</script>

<template>
  <header class="nav-bar" :class="{ scrolled }">
    <button v-if="backTo" class="back" @click="router.push(backTo)">
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 2 2.5 10 10 18" />
      </svg>
      <span>{{ backLabel }}</span>
    </button>
    <h2 class="inline-title">{{ title }}</h2>
    <div class="trailing"><slot name="action" /></div>
  </header>
</template>

<style scoped>
.nav-bar {
  position: relative;
  z-index: 30;
  flex-shrink: 0;
  height: var(--ios-nav-h);
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: transparent;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

.nav-bar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0.5px;
  background: var(--hairline);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.nav-bar.scrolled {
  background: var(--material-bar);
  backdrop-filter: var(--blur-bar);
  -webkit-backdrop-filter: var(--blur-bar);
}

.nav-bar.scrolled::after {
  opacity: 1;
}

.back {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--tint);
  font-size: 17px;
  letter-spacing: -0.02em;
  padding: 4px 4px 4px 0;
  z-index: 1;
}

.inline-title {
  position: absolute;
  left: 60px;
  right: 60px;
  text-align: center;
  font-family: var(--font-ios);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.22s ease, transform 0.22s var(--spring);
}

.nav-bar.scrolled .inline-title {
  opacity: 1;
  transform: none;
}

.trailing {
  margin-left: auto;
  z-index: 1;
  display: flex;
  align-items: center;
}
</style>
