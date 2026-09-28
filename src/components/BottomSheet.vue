<script setup>
/* Generic slide-up panel used for card pickers and detail views.
   Constrained to the 390x844 frame — never escapes it. */
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
const emit = defineEmits(['close'])
</script>

<template>
  <Transition name="sheet">
    <div v-if="open" class="sheet-root">
      <div class="scrim" @click="emit('close')"></div>
      <section class="sheet">
        <div class="grab"></div>
        <div class="sheet-hdr">
          <div>
            <h2>{{ title }}</h2>
            <p v-if="subtitle" class="helper">{{ subtitle }}</p>
          </div>
          <button class="close" @click="emit('close')">✕</button>
        </div>
        <div class="sheet-body scroll-area">
          <slot />
        </div>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.sheet-root {
  position: absolute;
  inset: 0;
  z-index: 40;
}

.scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

/* iOS sheet at the large detent: nearly full height, leaving the
   parent screen peeking above it. */
.sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 44px;
  display: flex;
  flex-direction: column;
  background: var(--surface-1);
  border-radius: var(--radius-sheet) var(--radius-sheet) 0 0;
  padding: 8px 14px 0;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.5);
}

.grab {
  width: 36px;
  height: 5px;
  border-radius: 3px;
  background: rgba(235, 235, 245, 0.3);
  margin: 0 auto 10px;
}

.sheet-hdr {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
}

h2 {
  font-size: 16px;
  text-transform: uppercase;
}

/* iOS circular close button */
.close {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(118, 118, 128, 0.24);
  color: var(--text-mid);
  font-size: 13px;
  font-weight: 600;
}

/* flex:1 + min-height:0 is what actually lets this scroll instead of
   pushing the sheet taller than its container. */
.sheet-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-bottom: 28px;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}

.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}
</style>
