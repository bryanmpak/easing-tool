<script lang="ts">
import { ref, computed, watch } from 'vue'
import AppContainer from './components/AppContainer.vue'
import AppCard from './components/AppCard.vue'
import EasingVisualizer from './components/EasingVisualizer.vue'
import EasingEditor from './components/EasingEditor.vue'
import EasingPresetOptions from './components/EasingPresetOptions.vue'
import { easingPresets } from './utils/easing-presets'

export type EasingPreset = {
  img: string
  value: number[]
}

export default {
  components: { AppContainer, AppCard, EasingEditor, EasingVisualizer, EasingPresetOptions },
  setup() {
    const defaultPreset = easingPresets['ease-in-out']
    const defaultPresetValue = defaultPreset.value
    const currentPreset = ref(defaultPreset)
    const currentValue = ref(defaultPresetValue)

    const roundedCurrentValues = computed(() => currentValue.value.map((val) => val.toFixed(1)))

    watch(currentPreset, (newPreset) => {
      currentValue.value = newPreset.value
    })

    const setCurrentValue = (value: number[]) => {
      currentValue.value = value
    }

    const setCurrentPreset = (preset: EasingPreset) => {
      currentPreset.value = preset
      visualizerValue.value = preset.value
    }

    const visualizerValue = ref(defaultPresetValue)

    const handleComplete = (newValue: number[]) => {
      visualizerValue.value = newValue
    }

    return {
      currentValue,
      roundedCurrentValues,
      visualizerValue,
      setCurrentValue,
      setCurrentPreset,
      currentPreset,
      handleComplete
    }
  }
}
</script>

<template>
  <AppContainer>
    <AppCard :cardWidth="450">
      <EasingVisualizer :value="visualizerValue" />
      <div class="flex justify-evenly">
        <EasingPresetOptions :currentPreset="currentPreset" @updatePreset="setCurrentPreset" />
        <EasingEditor
          :value="currentValue"
          @updateValue="setCurrentValue"
          @editing-finished="handleComplete"
          :height="300"
          :width="300"
        />
      </div>
      <div class="mx-auto pt-4 font-light text-sm">
        <p>cubic-bezier ({{ roundedCurrentValues.join(', ') }})</p>
      </div>
    </AppCard>
  </AppContainer>
</template>
