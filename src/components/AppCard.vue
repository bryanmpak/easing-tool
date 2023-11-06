<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppCard',
  props: {
    cardWidth: {
      type: Number,
      required: true
    },
    cardHeight: {
      type: Number,
      default: null
    }
  }
})
</script>

<template>
  <div
    class="flex flex-col mx-auto rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8"
    :style="{ width: cardWidth + 'px' }"
  >
    <slot></slot>
  </div>
</template>
