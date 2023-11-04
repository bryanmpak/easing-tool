<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onUnmounted, watchEffect } from 'vue'
import { bezier } from '@/utils/bezier-easing'
import { FPS, OPACITY, TIME_ELAPSED } from '@/utils/constants'

export default defineComponent({
  name: 'EasingVisualizer',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const isPlaying = ref(false)
    const fps = FPS
    const elapsedOpacity = OPACITY
    const animationTiming = TIME_ELAPSED
    const containerRef = ref(null)
    const containerWidth = ref(0)

    const easingFunction = computed(() =>
      // TTD: create a types.ts & add a BezierCurve type
      bezier(...(props.value as [number, number, number, number]))
    )

    const getSteps = (easingFn: (x: number) => number, fps: number) => {
      const steps = Array.from({ length: fps })
        .fill(-1)
        .map((_, index) => easingFn(index / fps))
      steps.push(easingFn(1))
      return steps
    }

    const steps = computed(() => getSteps(easingFunction.value, fps))

    const activeStepIndex = ref(steps.value.length - 1)

    watch(
      () => props.value,
      () => {
        activeStepIndex.value = 0
      }
    )

    let intervalId: number | undefined

    watchEffect(() => {
      if (intervalId !== undefined) {
        clearInterval(intervalId)
      }
      if (isPlaying.value) {
        intervalId = window.setInterval(() => {
          if (activeStepIndex.value < steps.value.length - 1) {
            activeStepIndex.value += 1
          } else {
            isPlaying.value = false
          }
        }, animationTiming / fps)
      }
    })

    onMounted(() => {
      if (containerRef.value) {
        containerWidth.value = (containerRef.value as HTMLElement).offsetWidth
      }
      activeStepIndex.value = 0
      isPlaying.value = true
    })

    onUnmounted(() => {
      if (intervalId !== undefined) {
        clearInterval(intervalId)
      }
    })

    const getOpacity = (index: number) => {
      return index === activeStepIndex.value
        ? 1
        : index > activeStepIndex.value
        ? 0
        : elapsedOpacity
    }

    return {
      containerRef,
      containerWidth,
      steps,
      getOpacity
    }
  }
})
</script>

<template>
  <div ref="containerRef" class="relative h-10 mr-8">
    <div
      v-for="(step, index) in steps"
      :key="step"
      class="absolute top-0 w-8 h-8 border border-purple-500 bg-purple-400 rounded-full"
      :style="{
        transform: `translateX(${step * containerWidth}px)`,
        opacity: getOpacity(index)
      }"
    />
  </div>
</template>
