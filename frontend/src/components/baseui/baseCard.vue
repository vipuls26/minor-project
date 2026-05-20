<template>
  <article
    class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
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
