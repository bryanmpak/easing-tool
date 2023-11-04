import type { Ref } from 'vue'

export interface Position {
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
  const x = (value: number) => Math.round(interpolate(pos.value.x.from, pos.value.x.to, value))
  const y = (value: number) => Math.round(interpolate(pos.value.y.from, pos.value.y.to, value))

  return { x, y }
}
