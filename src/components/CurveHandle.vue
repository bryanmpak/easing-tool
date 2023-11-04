<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { usePosition } from '@/utils/usePosition'
import type { PropType } from 'vue'
import type { Position } from '@/utils/usePosition'
import { RADIUS } from '@/utils/constants'

export default defineComponent({
  name: 'CurveHandle',
  props: {
    index: {
      type: Number,
      required: true
    },
    initialX: {
      type: Number,
      required: true
    },
    initialY: {
      type: Number,
      required: true
    },
    position: {
      type: Object as PropType<Position>,
      required: true
    },
    handleMouseDown: {
      type: Function as PropType<(index: number) => void>,
      required: true
    }
  },
  setup(props) {
    const radius = RADIUS

    const posRef = ref(props.position)
    const { x, y } = usePosition(posRef)

    const startX = x(props.index)
    const startY = y(props.index)

    const controlX = computed(() => x(props.initialX))
    const controlY = computed(() => y(props.initialY))

    const a = computed(() => Math.atan2(controlY.value - startY, controlX.value - startX))
    const cxs = computed(() => controlX.value - radius * Math.cos(a.value))
    const cys = computed(() => controlY.value - radius * Math.sin(a.value))

    return {
      cxs,
      cys,
      startX,
      startY,
      controlX,
      controlY,
      radius
    }
  }
})
</script>

<template>
  <g>
    <line class="stroke-purple-500 stroke-2" :x1="cxs" :y1="cys" :x2="startX" :y2="startY" />
    <circle
      class="focus:rounded-full hover:cursor-pointer fill-purple-500 focus:outline-purple-600"
      :cx="controlX"
      :cy="controlY"
      :r="radius"
      @mousedown="() => handleMouseDown(index)"
      tabindex="0"
    />
  </g>
</template>
