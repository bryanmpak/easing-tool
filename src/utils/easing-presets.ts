import easeInOutImg from '@/assets/ease-in-out.png'
import easeInImg from '@/assets/ease-in.png'
import easeOutImg from '@/assets/ease-out.png'
import easeImg from '@/assets/ease.png'
import linearImg from '@/assets/linear.png'

export type EasingPreset = {
  img: string
  value: number[]
}

export type EasingPresetsType = {
  [key: string]: EasingPreset
}

export const easingPresets: EasingPresetsType = {
  'ease-in-out': { img: easeInOutImg, value: [0.42, 0, 0.58, 1] },
  'ease-in': { img: easeInImg, value: [0.42, 0, 1, 1] },
  'ease-out': { img: easeOutImg, value: [0, 0, 0.58, 1] },
  ease: { img: easeImg, value: [0.25, 0.1, 0.25, 1] },
  linear: { img: linearImg, value: [0, 0, 1, 1] }
}
