<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import BezierCurve from './BezierCurve.vue'
import CurveHandle from './CurveHandle.vue'
import { PADDING } from '@/utils/constants'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'EasingEditor',
  components: { BezierCurve, CurveHandle },
  props: {
    value: {
      type: Array as PropType<number[]>,
      required: true
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    }
  },
  setup(props, { emit }) {
    const editorRef = ref<SVGSVGElement | null>(null)
    const isDragging = ref<null | number>(null)

    const padding = PADDING
    const paddedWidth = computed(() => props.width - padding * 2)
    const paddedHeight = computed(() => props.height - padding * 2)

    const x = (val: number) => Math.round(val * paddedWidth.value) + padding
    const y = (val: number) => Math.round((1 - val) * paddedHeight.value) + padding

    const position = computed(() => ({
      x: { from: x(0), to: x(1) },
      y: { from: y(0), to: y(1) }
    }))

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.value !== null && editorRef.value) {
        const rect = editorRef.value.getBoundingClientRect()
        if (rect) {
          const newValue = [...props.value]

          let x = (e.clientX - rect.left - padding) / paddedWidth.value
          let y = 1 - (e.clientY - rect.top - padding) / paddedHeight.value

          // clamping x value to range [0, 1], per bezier-easing.ts spec
          x = Math.min(Math.max(x, 0), 1)

          // based on index, which coordinate is being adjusted
          newValue[isDragging.value * 2] = x
          newValue[isDragging.value * 2 + 1] = y

          emit('updateValue', newValue)
        }
      }
    }

    const handleMouseDown = (index: number) => {
      isDragging.value = index
    }

    const handleMouseUp = () => {
      isDragging.value = null
    }

    return {
      editorRef,
      position,
      handleMouseMove,
      handleMouseDown,
      handleMouseUp,
      padding
    }
  }
})
</script>

<template>
  <div :style="{ width: width + 'px', height: height + 'px' }" class="relative">
    <div
      class="absolute w-full h-full bg-[length:16px_16px] pointer-events-none"
      :style="{
        backgroundImage:
          'radial-gradient(circle at 6px 6px, rgb(26, 26, 26, 0.2) 1px, transparent 0)'
      }"
    ></div>
    <svg
      :width="width"
      :height="height"
      ref="editorRef"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <BezierCurve
        :value="value"
        :position="position"
        :width="width"
        :height="height"
        :padding="padding"
      />
      <CurveHandle
        :index="0"
        :initial-x="value[0]"
        :initial-y="value[1]"
        :position="position"
        :handleMouseDown="handleMouseDown"
      />
      <CurveHandle
        :index="1"
        :initial-x="value[2]"
        :initial-y="value[3]"
        :position="position"
        :handleMouseDown="handleMouseDown"
      />
    </svg>
  </div>
</template>