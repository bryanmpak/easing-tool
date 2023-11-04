import { computed } from 'vue'
import type { Ref } from 'vue'

interface Position {
  x: {
    from: number
    to: number
  }
  y: {
    from: number
    to: number
  }
}

const interpolate = (a: number, b: number, x: number) => {
  return a * (1 - x) + b * x
}

export const usePosition = (pos: Ref<Position>) => {
  const x = computed(
    () => (value: number) => Math.round(interpolate(pos.value.x.from, pos.value.x.to, value))
  )
  const y = computed(
    () => (value: number) => Math.round(interpolate(pos.value.y.from, pos.value.y.to, value))
  )

  return { x, y }
}
