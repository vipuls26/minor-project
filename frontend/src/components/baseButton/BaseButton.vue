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
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-[0_14px_32px_-18px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-70'

  const variants = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:outline-sky-500',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600 focus-visible:outline-amber-500',
    tertiary: 'bg-rose-500 px-3 py-3 text-white hover:bg-rose-600 focus-visible:outline-rose-500',
  }

  return `${baseClasses} ${variants[props.variant] || variants.primary}`
})
</script>
