export type BezierCurveTuple = [number, number, number, number]

export type BezierCurveValues = number[]

export interface EasingPreset {
  img: string
  value: BezierCurveValues
}

export interface EasingPresetsType {
  [key: string]: EasingPreset
}
