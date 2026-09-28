<script setup>
/* Detail body for a single card. Staff cards are the "getting to know
   the team" payoff — fictional staff show their bio fields; real people
   (drivers, principals, chassis) show factual legacy notes only. */
import { computed } from 'vue'
import SmartImage from './SmartImage.vue'
import StatBar from './StatBar.vue'
import { cardArt, placeholderFill, rarityFill, rarityLabel } from '@/game/visuals.js'
import { DEPARTMENTS, PART_SLOTS } from '@/data/cards.js'

const props = defineProps({
  card: { type: Object, required: true },
})

const dept = computed(() =>
  props.card.type === 'staff' ? DEPARTMENTS[props.card.department] : null
)

const bioFields = computed(() => {
  const b = props.card.bio
  if (!b) return []
  return [
    { label: 'Education', value: b.education },
    { label: 'Advice for students', value: b.adviceForStudents },
    { label: 'Top quote', value: `“${b.topQuote}”` },
    { label: 'Secret skill', value: b.secretSkill },
  ]
})
</script>

<template>
  <div class="detail">
    <div class="hero" :style="{ borderColor: rarityFill(card.rarity) }">
      <SmartImage
        :src="cardArt(card.id)"
        :alt="card.name"
        :label="card.name"
        :color="placeholderFill(card)"
        :gradient="card.rarity === 'legend' ? rarityFill('legend') : ''"
        :focus="card.type === 'staff' || card.type === 'driver' ? '50% 28%' : '50% 50%'"
      />
    </div>

    <div class="title-row">
      <div>
        <h3>{{ card.name }}</h3>
        <p class="role">
          {{ card.role || (dept && dept.label) || card.years || '' }}
          <template v-if="card.type === 'part'">{{ PART_SLOTS[card.slot].label }}</template>
        </p>
      </div>
      <span class="rarity" :style="{ background: rarityFill(card.rarity) }">
        {{ rarityLabel(card.rarity) }}
      </span>
    </div>

    <div class="chips">
      <span v-if="dept" class="chip" :style="{ borderColor: dept.color, color: dept.color }">
        {{ dept.label }}
      </span>
      <span v-if="card.isLead" class="chip chip--lead">Lead</span>
      <span class="chip">{{ card.era === 'retro' ? 'Retro era' : 'Modern era' }}</span>
      <span v-if="card.years" class="chip">{{ card.years }}</span>
    </div>

    <!-- stats -->
    <div v-if="card.stats" class="block">
      <p class="eyebrow">Stats</p>
      <StatBar
        v-for="(v, k) in card.stats"
        :key="k"
        :label="k"
        :value="v"
        :color="rarityFill(card.rarity)"
      />
    </div>

    <div v-if="card.primaryStat" class="block">
      <p class="eyebrow">Primary stat</p>
      <StatBar
        :label="card.primaryStat.label"
        :value="card.primaryStat.value"
        :color="dept ? dept.color : 'var(--color-primary-blue)'"
      />
    </div>

    <div v-if="card.statBonus" class="block">
      <p class="eyebrow">Part bonus</p>
      <p class="bonus">
        +{{ card.statBonus.value }} <span>{{ card.statBonus.stat }}</span>
      </p>
      <p class="helper">{{ card.flavour }}</p>
    </div>

    <!-- real-person / real-chassis legacy note -->
    <div v-if="card.legacy" class="block">
      <p class="eyebrow">Legacy</p>
      <p class="helper">{{ card.legacy }}</p>
    </div>

    <!-- fictional staff bio -->
    <div v-if="bioFields.length" class="block">
      <p class="eyebrow">Meet the staff</p>
      <div v-for="f in bioFields" :key="f.label" class="bio">
        <p class="bio-lbl">{{ f.label }}</p>
        <p class="bio-val">{{ f.value }}</p>
      </div>
      <p class="fict">Fictional placeholder staff member — not a real Williams employee.</p>
    </div>
  </div>
</template>

<style scoped>
.hero {
  width: 100%;
  aspect-ratio: 16 / 10;
  border: 1.5px solid;
  border-radius: var(--radius-card);
  overflow: hidden;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

h3 {
  font-size: 19px;
  text-transform: uppercase;
  line-height: 1.05;
}

.role {
  margin: 3px 0 0;
  font-size: 11px;
  color: var(--text-mid);
}

.rarity {
  flex-shrink: 0;
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-black);
  padding: 4px 7px;
  border-radius: 6px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.chip {
  font-size: 9.5px;
  padding: 3px 7px;
  border-radius: 20px;
  border: 1px solid var(--hairline);
  color: var(--text-mid);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-family: var(--font-heading);
  font-weight: 700;
}

.chip--lead {
  background: var(--color-keyline-white);
  color: var(--color-black);
  border-color: transparent;
}

.block {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--hairline);
}

.block .eyebrow {
  margin: 0 0 7px;
}

.affects {
  margin-top: 8px;
}

.bonus {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 900;
  color: var(--color-primary-blue);
}

.bonus span {
  font-size: 12px;
  color: var(--text-mid);
  text-transform: uppercase;
}

.bio {
  margin-bottom: 9px;
}

.bio-lbl {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary-blue);
}

.bio-val {
  margin: 2px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-hi);
}

.fict {
  margin: 10px 0 0;
  font-size: 9.5px;
  color: var(--text-lo);
  font-style: italic;
}
</style>
