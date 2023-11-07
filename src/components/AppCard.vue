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
    class="flex flex-col mx-auto rounded-md p-4 sm:p-8"
    :style="{ width: cardWidth + 'px', boxShadow: `0 8px 30px var(--shadow-color)` }"
  >
    <slot></slot>
  </div>
</template>
