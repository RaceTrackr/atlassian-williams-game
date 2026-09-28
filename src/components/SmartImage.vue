<script setup>
/* Renders an image if the file exists, otherwise a flat coloured
   placeholder with the card/asset name on it. This is what lets the
   demo look finished before any generated art is dropped into
   /public/assets. Drop a file in at the referenced path and it just
   appears — no code change needed. */
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  label: { type: String, default: '' },
  color: { type: String, default: '#26282E' },
  gradient: { type: String, default: '' },
  contain: { type: Boolean, default: false },
  rounded: { type: String, default: '0' },
  /* Where the crop is anchored when this box is a different shape to
     the source art. Portraits need it weighted upward or the head gets
     cut off in a square or landscape crop. */
  focus: { type: String, default: '50% 50%' },
})

const failed = ref(!props.src)
watch(
  () => props.src,
  (v) => (failed.value = !v)
)
</script>

<template>
  <div class="smart-img" :style="{ borderRadius: rounded }">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      :style="{ objectFit: contain ? 'contain' : 'cover', objectPosition: focus }"
      @error="failed = true"
    />
    <div
      v-else
      class="ph"
      :style="{ background: gradient || color }"
      :title="`Placeholder — drop art at ${src}`"
    >
      <span v-if="label" class="ph-label">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.smart-img {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.smart-img img {
  width: 100%;
  height: 100%;
  display: block;
}

.ph {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  text-align: center;
}

.ph-label {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 10px;
  line-height: 1.15;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.72);
  mix-blend-mode: normal;
}
</style>
