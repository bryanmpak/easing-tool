<script lang="ts">
import { ref, computed, watch } from 'vue'
import AppContainer from './components/AppContainer.vue'
import AppCard from './components/AppCard.vue'
// import EasingVisualizer from './components/EasingVisualizer.vue'
// import EasingEditor from './components/EasingEditor.vue'
// import EasingPresetOptions from './components/EasingPresetOptions.vue'

type BezierCurveValue = [number, number, number, number]

type EasingPreset = {
  img: string
  value: BezierCurveValue
}

type EasingPresetsType = {
  [key: string]: EasingPreset
}

const easingPresets: EasingPresetsType = {
  'ease-in-out': { img: '/ease-in-out.png', value: [0.42, 0, 0.58, 1] },
  'ease-in': { img: '/ease-in.png', value: [0.42, 0, 1, 1] },
  'ease-out': { img: '/ease-out.png', value: [0, 0, 0.58, 1] },
  ease: { img: '/ease.png', value: [0.25, 0.1, 0.25, 1] },
  linear: { img: '/linear.png', value: [0, 0, 1, 1] }
}

export default {
  components: { AppContainer, AppCard }, // EasingVisualizer, EasingEditor, EasingPresetOptions
  setup() {
    const defaultPreset = easingPresets['ease-in-out']
    const defaultPresetValue: BezierCurveValue = defaultPreset.value as BezierCurveValue
    const currentPreset = ref(defaultPreset)
    const currentValue = ref<BezierCurveValue>(defaultPresetValue)

    const roundedCurrentValues = computed(() => currentValue.value.map((val) => val.toFixed(1)))

    watch(currentPreset, (newPreset) => {
      currentValue.value = newPreset.value as BezierCurveValue
    })

    const setCurrentValue = (value: BezierCurveValue) => {
      currentValue.value = value
    }

    const setCurrentPreset = (preset: EasingPreset) => {
      currentPreset.value = preset
    }

    return { currentValue, roundedCurrentValues, setCurrentValue, setCurrentPreset, currentPreset }
  }
}
</script>

<template>
  <AppContainer>
    <AppCard :cardWidth="300">
      <!-- <EasingVisualizer :value="currentValue" @updateValue="setCurrentValue" />
      <div class="flex justify-evenly">
        <EasingPresetOptions :currentPreset="currentPreset" @updatePreset="setCurrentPreset" />
        <EasingEditor
          :value="currentValue"
          @updateValue="setCurrentValue"
          :height="300"
          :width="300"
        />
      </div> -->
      <div class="mx-auto pt-4 font-light text-sm">
        <p>cubic-bezier ({{ roundedCurrentValues.join(', ') }})</p>
      </div>
    </AppCard>
  </AppContainer>
</template>
