/* Presentation helpers shared by every card surface. */
import { RARITIES, DEPARTMENTS } from '@/data/cards.js'

/* Asset URLs must be built from BASE_URL, not hardcoded to "/", or they
   break when the site is served from a subpath like /<repo>/ on GitHub
   Pages. BASE_URL is "/" in dev and "./" in the build. */
const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`

export const ASSETS = {
  backgroundMain: asset('backgrounds/a1-main.png'),
  backgroundBattle: asset('backgrounds/a2-battle.png'),
  pageBackground: asset('backgrounds/a3-page.png'),
  logo: asset('components/b1-logo.png'),
  departmentIcons: asset('components/b2-department-icons.png'),
  car: asset('components/b4-car-illustration.png'),
  driverSilhouette: asset('components/b5-driver-silhouette.png'),
  packClosed: asset('components/b8-pack-closed.png'),
  packBurst: asset('components/b8-pack-burst.png'),
}

export const cardArt = (id) => asset(`cards/${id}.png`)

export function rarityFill(rarity) {
  const r = RARITIES[rarity] || RARITIES.bronze
  return r.gradient || r.color
}

export function rarityLabel(rarity) {
  return (RARITIES[rarity] || RARITIES.bronze).label
}

/* Border/badge treatment for a card of a given rarity. */
export function rarityStyle(rarity) {
  const fill = rarityFill(rarity)
  if (rarity === 'legend') {
    return { borderImage: `${fill} 1`, borderColor: '#FFD700', background: fill }
  }
  return { borderColor: fill, background: fill }
}

export function deptColor(key) {
  return DEPARTMENTS[key] ? DEPARTMENTS[key].color : '#767D89'
}

/* Placeholder colour for a card: department colour for staff, rarity
   colour for everything else — so unillustrated cards still read. */
export function placeholderFill(card) {
  if (!card) return '#26282E'
  if (card.type === 'staff') return deptColor(card.department)
  return rarityFill(card.rarity)
}

export const typeLabels = {
  driver: 'Driver',
  car: 'Car',
  part: 'Part',
  staff: 'Staff',
}
