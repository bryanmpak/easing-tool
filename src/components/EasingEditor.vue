<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import BezierCurve from './BezierCurve.vue'
import CurveHandle from './CurveHandle.vue'
import { PADDING } from '@/utils/constants'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'EasingEditor',
  components: { BezierCurve, CurveHandle },
  props: {
    value: {
      // not sure if this the right way to do TS in Vue
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
    const padding = PADDING

    const editorRef = ref<SVGSVGElement | null>(null)
    const isDragging = ref<null | number>(null)
    const rect = ref<DOMRect | null>(null)

    const updateRect = () => {
      if (editorRef.value) {
        rect.value = editorRef.value.getBoundingClientRect()
      }
    }

    // window resizes to deal with position recalcs in handleMove
    onMounted(() => {
      updateRect()
      window.addEventListener('resize', updateRect)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateRect)
    })

    // to account for padding in SVG
    const paddedWidth = computed(() => props.width - padding * 2)
    const paddedHeight = computed(() => props.height - padding * 2)

    // curve & handle positions
    const position = computed(() => {
      const x = (val: number) => Math.round(val * paddedWidth.value) + padding
      const y = (val: number) => Math.round((1 - val) * paddedHeight.value) + padding
      return {
        x: { from: x(0), to: x(1) },
        y: { from: y(0), to: y(1) }
      }
    })

    // mouse & touch handlers for EasingEditor & CurveHandles
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging.value !== null && rect.value) {
        let x = (clientX - rect.value.left - padding) / paddedWidth.value
        let y = 1 - (clientY - rect.value.top - padding) / paddedHeight.value
        x = Math.min(Math.max(x, 0), 1)
        const newValue = [...props.value]
        newValue[isDragging.value * 2] = x
        newValue[isDragging.value * 2 + 1] = y
        emit('updateValue', newValue)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const handleEnd = () => {
      isDragging.value = null
      emit('editing-finished', props.value)
    }
    const handleStart = (index: number) => {
      isDragging.value = index
    }

    const handleMouseDown = (index: number) => {
      handleStart(index)
    }

    const handleTouchStart = (event: TouchEvent, index: number) => {
      if (event.touches.length === 1) {
        handleStart(index)
        event.preventDefault()
      }
    }

    return {
      editorRef,
      position,
      handleMouseMove,
      handleMouseDown,
      handleMouseUp: handleEnd,
      handleTouchMove,
      handleTouchStart,
      handleTouchEnd: handleEnd,
      padding
    }
  }
})
</script>

<template>
  <div :style="{ width: width + 'px', height: height + 'px' }" class="relative">
    <div
      class="absolute w-full h-full bg-[length:16px_16px] pointer-events-none -z-10"
      :style="{
        backgroundImage:
          'radial-gradient(circle at 6px 6px, var(--gradient-color) 1px, transparent 0)'
      }"
    ></div>
    <svg
      :width="width"
      :height="height"
      ref="editorRef"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
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
        :handleTouchStart="handleTouchStart"
      />
      <CurveHandle
        :index="1"
        :initial-x="value[2]"
        :initial-y="value[3]"
        :position="position"
        :handleMouseDown="handleMouseDown"
        :handleTouchStart="handleTouchStart"
      />
    </svg>
  </div>
</template>
