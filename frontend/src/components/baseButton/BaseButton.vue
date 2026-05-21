<template>
  <button :type="htmlType" :class="buttonClasses">
    <slot>
      <span class="inline-flex items-center gap-2">
        <i v-if="icon" :class="`pi ${icon}`" aria-hidden="true"></i>
        <span>{{ label }}</span>
      </span>
    </slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Button' },
  icon: { type: String, default: '' },
  variant: { type: String, default: 'primary' },
  htmlType: { type: String, default: 'button' },
})

const buttonClasses = computed(() => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500',
    secondary: 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-indigo-500 hover:text-indigo-600 focus-visible:outline-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:text-indigo-400',
    tertiary: 'bg-red-400 text-white hover:bg-red-600 focus-visible:outline-red-500 p-2',
  }

  return `${baseClasses} ${variants[props.variant] || variants.primary}`
})
</script>
