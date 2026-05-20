<template>
  <article
    class="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.28)] ring-1 ring-white/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-[0_28px_60px_-24px_rgba(14,116,144,0.28)] hover:ring-sky-200/70 dark:border-slate-800/80 dark:bg-slate-900/92 dark:ring-white/5 dark:hover:border-sky-500/40 dark:hover:ring-sky-500/20"
  >
    <div v-if="$slots.image" class="aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
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

const contentClasses = computed(() => (props.padded ? 'p-6' : ''))
</script>
