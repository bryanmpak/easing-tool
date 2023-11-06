<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onUnmounted, watchEffect } from 'vue'
import { bezier } from '@/utils/bezier-easing'
import { ANIMATION_FRAMES, OPACITY, ANIMATION_DURATION } from '@/utils/constants'
import type { BezierCurveTuple } from '@/utils/typings'

export default defineComponent({
  name: 'EasingVisualizer',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const frames = ANIMATION_FRAMES
    const elapsedOpacity = OPACITY
    const animationDuration = ANIMATION_DURATION

    const isPlaying = ref(false)
    const containerRef = ref(null)
    const containerWidth = ref(0)
    const activeStepIndex = ref(0)
    let animationFrameId: number | undefined

    const easingFunction = computed(() => bezier(...(props.value as BezierCurveTuple)))

    const getSteps = (easingFn: (x: number) => number, fps: number) => {
      const steps = Array.from({ length: fps })
        .fill(-1)
        .map((_, index) => easingFn(index / fps))
      steps.push(easingFn(1))
      return steps
    }

    const steps = computed(() => getSteps(easingFunction.value, frames))

    const startAnimation = () => {
      let startTime: number | undefined

      const runAnimation = (timestamp: number) => {
        if (startTime === undefined) startTime = timestamp
        const elapsedTime = timestamp - startTime
        const progress = elapsedTime / animationDuration
        const currentStep = Math.min(progress * (steps.value.length - 1), steps.value.length - 1)
        activeStepIndex.value = Math.floor(currentStep)

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(runAnimation)
        } else {
          isPlaying.value = false
        }
      }

      isPlaying.value = true
      animationFrameId = requestAnimationFrame(runAnimation)
    }

    watch(
      () => props.value,
      () => {
        if (animationFrameId !== undefined) {
          cancelAnimationFrame(animationFrameId)
        }
        activeStepIndex.value = 0
        startAnimation()
      }
    )

    onMounted(() => {
      if (containerRef.value) {
        containerWidth.value = (containerRef.value as HTMLElement).offsetWidth
      }
      startAnimation()
    })

    onUnmounted(() => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId)
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
  <div ref="containerRef" class="relative h-12 mr-8">
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
