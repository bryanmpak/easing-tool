<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { easingPresets } from '@/utils/easing-presets'
import type { EasingPreset } from '@/utils/typings'

export default defineComponent({
  name: 'EasingPresetOptions',
  props: {
    currentPreset: {
      // TTD: check if this is the right TS for Vue
      type: Object as PropType<EasingPreset>,
      required: true
    }
  },
  emits: ['updatePreset'],
  setup(props, { emit }) {
    const handleClick = (preset: EasingPreset) => {
      emit('updatePreset', preset)
    }

    return {
      easingPresets,
      handleClick
    }
  }
})
</script>

<template>
  <div class="flex flex-col justify-evenly">
    <button
      v-for="(preset, presetKey) in easingPresets"
      :key="presetKey"
      :title="presetKey.toString()"
      class="h-12 w-12 rounded-md border bg-gray-200 hover:bg-gray-300"
      :class="{ 'bg-gray-300': currentPreset.value.toString() === preset.value.toString() }"
      @click="handleClick(preset)"
    >
      <img :src="preset.img" :alt="presetKey.toString()" />
    </button>
  </div>
</template>
