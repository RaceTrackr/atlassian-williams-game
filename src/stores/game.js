import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import {
  DEPARTMENTS,
  PART_SLOTS,
  allCards,
  cardsById,
  startingCollection,
  opponentSquad,
} from '@/data/cards.js'
import { computeSquad } from '@/game/engine.js'

/* In-memory only — a reload resets the demo, which is fine here. */

function emptySquad() {
  const departments = {}
  Object.values(DEPARTMENTS).forEach((d) => {
    departments[d.key] = {
      regular: Array(d.hasLead ? d.slots - 1 : d.slots).fill(null),
      lead: d.hasLead ? null : undefined,
    }
  })
  return { driver: null, car: null, departments }
}

function emptyPartSet() {
  const set = {}
  Object.keys(PART_SLOTS).forEach((k) => (set[k] = null))
  return set
}

export const useGameStore = defineStore('game', () => {
  /* ------------------------------ state ------------------------------ */
  const owned = ref([...startingCollection])
  const packs = ref(2)
  const squad = reactive(emptySquad())
  /* Parts are stored per car so swapping cars does not lose a build. */
  const partsByCar = reactive({})
  const lastBattle = ref(null)
  const lastUnlocked = ref(null)

  /* ----------------------------- getters ----------------------------- */
  const isOwned = (id) => owned.value.includes(id)

  const ownedCards = computed(() => owned.value.map((id) => cardsById[id]).filter(Boolean))

  const collectionByType = computed(() => {
    const groups = { driver: [], car: [], staff: [], part: [] }
    allCards.forEach((c) => groups[c.type].push({ ...c, owned: isOwned(c.id) }))
    return groups
  })

  const currentParts = computed(() => {
    if (!squad.car) return emptyPartSet()
    return partsByCar[squad.car] || emptyPartSet()
  })

  const summary = computed(() => computeSquad(squad, currentParts.value))

  /* Where every equipped card currently sits, keyed by card id, so a
     picker can warn before swapping out something already in use. */
  const squadUsage = computed(() => {
    const map = {}
    // Parts on other cars first, so the current car's fitment wins.
    Object.entries(partsByCar).forEach(([carId, set]) => {
      if (carId === squad.car) return
      Object.entries(set).forEach(([slotKey, partId]) => {
        if (partId) map[partId] = `On ${cardsById[carId] ? cardsById[carId].name : 'another car'}`
        void slotKey
      })
    })
    Object.entries(currentParts.value).forEach(([slotKey, partId]) => {
      if (partId) map[partId] = `Fitted — ${PART_SLOTS[slotKey].label}`
    })
    if (squad.driver) map[squad.driver] = 'Driver slot'
    if (squad.car) map[squad.car] = 'Car slot'
    Object.values(DEPARTMENTS).forEach((meta) => {
      const dept = squad.departments[meta.key]
      if (meta.hasLead && dept.lead) map[dept.lead] = `${meta.label} — Lead`
      dept.regular.forEach((id, i) => {
        if (id) map[id] = meta.slots === 1 ? meta.label : `${meta.label} — slot ${i + 1}`
      })
    })
    return map
  })

  const squadComplete = computed(() => !!squad.driver && !!squad.car)

  const collectionProgress = computed(() => ({
    owned: owned.value.length,
    total: allCards.length,
    pct: Math.round((owned.value.length / allCards.length) * 100),
  }))

  /* ----------------------------- actions ----------------------------- */

  function setDriver(id) {
    squad.driver = squad.driver === id ? null : id
  }

  function setCar(id) {
    squad.car = squad.car === id ? null : id
    if (squad.car && !partsByCar[squad.car]) partsByCar[squad.car] = emptyPartSet()
  }

  /* Assign a staff card to a department slot. `index` is the regular slot
     index, or the string 'lead' for the department's Lead slot. */
  function setStaff(deptKey, index, cardId) {
    const dept = squad.departments[deptKey]
    if (!dept) return
    // A card can only be in one slot at a time — clear any previous home.
    if (cardId) clearCardFromSquad(cardId)
    if (index === 'lead') dept.lead = cardId
    else dept.regular[index] = cardId
  }

  function clearSlot(deptKey, index) {
    setStaff(deptKey, index, null)
  }

  function clearCardFromSquad(cardId) {
    Object.values(squad.departments).forEach((dept) => {
      if (dept.lead === cardId) dept.lead = null
      dept.regular.forEach((id, i) => {
        if (id === cardId) dept.regular[i] = null
      })
    })
  }

  function setPart(slotKey, partId) {
    if (!squad.car) return
    if (!partsByCar[squad.car]) partsByCar[squad.car] = emptyPartSet()
    const set = partsByCar[squad.car]
    set[slotKey] = set[slotKey] === partId ? null : partId
  }

  function autoFillSquad() {
    /* Demo convenience: fills every slot with the best owned card that
       fits, so a presenter can reach a full squad in one tap. */
    const byRating = (a, b) => b.primaryStat.value - a.primaryStat.value
    const pool = ownedCards.value

    const bestDriver = pool
      .filter((c) => c.type === 'driver')
      .sort(
        (a, b) =>
          Object.values(b.stats).reduce((x, y) => x + y, 0) -
          Object.values(a.stats).reduce((x, y) => x + y, 0)
      )[0]
    if (bestDriver) squad.driver = bestDriver.id

    const bestCar = pool
      .filter((c) => c.type === 'car')
      .sort(
        (a, b) =>
          Object.values(b.stats).reduce((x, y) => x + y, 0) -
          Object.values(a.stats).reduce((x, y) => x + y, 0)
      )[0]
    if (bestCar) {
      squad.car = bestCar.id
      if (!partsByCar[bestCar.id]) partsByCar[bestCar.id] = emptyPartSet()
      Object.keys(PART_SLOTS).forEach((slotKey) => {
        const best = pool
          .filter((c) => c.type === 'part' && c.slot === slotKey)
          .sort((a, b) => b.statBonus.value - a.statBonus.value)[0]
        if (best) partsByCar[bestCar.id][slotKey] = best.id
      })
    }

    Object.values(DEPARTMENTS).forEach((meta) => {
      const dept = squad.departments[meta.key]
      const candidates = pool
        .filter((c) => c.type === 'staff' && c.department === meta.key)
        .sort(byRating)
      if (meta.hasLead) {
        const lead = candidates.find((c) => c.isLead) || candidates[0]
        dept.lead = lead ? lead.id : null
      }
      const remaining = candidates.filter((c) => c.id !== dept.lead)
      dept.regular.forEach((_, idx) => {
        dept.regular[idx] = remaining[idx] ? remaining[idx].id : null
      })
    })
  }

  function resetSquad() {
    const fresh = emptySquad()
    squad.driver = null
    squad.car = null
    Object.keys(fresh.departments).forEach((k) => {
      squad.departments[k] = fresh.departments[k]
    })
  }

  function addPack(n = 1) {
    packs.value += n
  }

  /* Opens a pack: unlocks a random card the player does not own yet.
     Weighted slightly toward rarer cards so reveals feel worthwhile. */
  function openPack() {
    if (packs.value <= 0) return null
    packs.value -= 1
    const locked = allCards.filter((c) => !isOwned(c.id))
    if (!locked.length) {
      lastUnlocked.value = { card: null, duplicate: true }
      return lastUnlocked.value
    }
    const weight = { bronze: 1, silver: 2, gold: 3, legend: 4 }
    const pool = []
    locked.forEach((c) => {
      for (let i = 0; i < (weight[c.rarity] || 1); i++) pool.push(c)
    })
    const card = pool[Math.floor(Math.random() * pool.length)]
    owned.value.push(card.id)
    lastUnlocked.value = { card, duplicate: false }
    return lastUnlocked.value
  }

  function recordBattle(result) {
    lastBattle.value = result
  }

  return {
    // state
    owned,
    packs,
    squad,
    partsByCar,
    lastBattle,
    lastUnlocked,
    opponent: opponentSquad,
    // getters
    isOwned,
    ownedCards,
    collectionByType,
    currentParts,
    summary,
    squadUsage,
    squadComplete,
    collectionProgress,
    // actions
    setDriver,
    setCar,
    setStaff,
    clearSlot,
    setPart,
    autoFillSquad,
    resetSquad,
    addPack,
    openPack,
    recordBattle,
  }
})
