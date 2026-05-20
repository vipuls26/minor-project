<template>
  <button :type="htmlType" :class="buttonClasses">
    <slot> {{ label }} </slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Button' },
  variant: { type: String, default: 'primary' },
  htmlType: { type: String, default: 'button' },
})

const buttonClasses = computed(() => {
  const baseClasses =
    'px-5 py-2.5 rounded-4xl font-semibold text-sm shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-700 focus-visible:outline-blue-600',
    secondary: 'bg-yellow-500 text-white hover:bg-yellow-700 focus-visible:outline-yellow-600',
    tertiary: 'bg-red-400 text-white hover:bg-red-600 focus-visible:outline-red-500 p-2',
  }

  return `${baseClasses} ${variants[props.variant] || variants.primary}`
})
</script>
