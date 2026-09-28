import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

/* meta.tab       — show the iOS tab bar on this screen
   meta.transition— 'push' (slide from right) or 'modal' (cover from bottom) */
const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { tab: true } },
  {
    path: '/collection',
    name: 'collection',
    component: () => import('@/views/CollectionView.vue'),
    meta: { tab: true },
  },
  {
    path: '/squad',
    name: 'squad',
    component: () => import('@/views/SquadBuilderView.vue'),
    meta: { tab: true },
  },
  {
    path: '/garage',
    name: 'garage',
    component: () => import('@/views/GarageView.vue'),
    meta: { tab: true },
  },
  {
    path: '/battle',
    name: 'battle',
    component: () => import('@/views/BattleView.vue'),
    meta: { tab: true },
  },
  {
    path: '/result',
    name: 'result',
    component: () => import('@/views/ResultView.vue'),
    meta: { transition: 'modal' },
  },
  {
    path: '/live',
    name: 'live',
    component: () => import('@/views/LiveDropView.vue'),
    meta: { transition: 'modal' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  /* Hash history: GitHub Pages has no SPA rewrite, so with real paths a
     refresh or a shared deep link 404s. The hash keeps every route on
     one real URL, which also keeps relative asset paths resolving. */
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
