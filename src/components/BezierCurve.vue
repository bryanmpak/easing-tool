<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { usePosition } from '@/utils/usePosition'
import type { Position } from '@/utils/usePosition'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'BezierCurve',
  props: {
    value: {
      type: Array as () => number[],
      required: true
    },
    position: {
      type: Object as PropType<Position>,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    padding: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const posRef = ref(props.position)
    const { x, y } = usePosition(posRef)

    const curve = computed(() => {
      const startX = x(0)
      const startY = y(0)
      const endX = x(1)
      const endY = y(1)
      const controlStartX = x(props.value[0])
      const controlStartY = y(props.value[1])
      const controlEndX = x(props.value[2])
      const controlEndY = y(props.value[3])
      return `M${startX},${startY} C${controlStartX},${controlStartY} ${controlEndX},${controlEndY} ${endX},${endY}`
    })

    return { curve }
  }
})
</script>

<template>
  <g>
    <path class="stroke-2 stroke-black fill-none" :d="curve" />
    <path
      class="stroke-1 stroke-gray-500 fill-none"
      :d="`M${padding},${height - padding} C${padding},${height - padding} ${
        width - padding
      },${padding} ${width - padding},${padding}`"
    />
  </g>
</template>
