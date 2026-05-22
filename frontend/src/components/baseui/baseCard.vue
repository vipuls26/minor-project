<template>
  <article
    class="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20">
    <div v-if="$slots.image" class="aspect-16/10 overflow-hidden bg-white dark:bg-zinc-900">
      <slot name="image" />
    </div>

    <div :class="contentClasses">
      <slot />
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padded: {
    type: Boolean,
    default: true,
  },
})

const contentClasses = computed(() => (props.padded ? 'p-4 sm:p-5' : ''))
</script>
