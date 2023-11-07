<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppCard'
})
</script>

<template>
  <div
    class="flex flex-col mx-auto rounded-md px-2 xs:px-8 py-8 w-[360px] xs:w-[450px]"
    :style="{ boxShadow: `0 8px 30px var(--shadow-color)` }"
  >
    <slot></slot>
  </div>
</template>
