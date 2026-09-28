import { ref } from 'vue'

/* Tracks whether a scroll container has moved past a threshold, so a
   NavBar can collapse its large title exactly like UIKit does.
   Usage:  const { scrolled, onScroll } = useScrolled()
           <div class="screen-body" @scroll="onScroll"> */
export function useScrolled(threshold = 24) {
  const scrolled = ref(false)
  const onScroll = (e) => {
    scrolled.value = e.target.scrollTop > threshold
  }
  return { scrolled, onScroll }
}
