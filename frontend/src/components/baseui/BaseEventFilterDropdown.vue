<template>
  <div class="flex items-center justify-end">
    <label for="event-date-filter" class="sr-only">Filter events by date</label>

    <div
      class="relative min-w-48 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm transition focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-950">
      <select id="event-date-filter" :value="modelValue"
        class="min-w-0 w-full appearance-none border-0 bg-transparent px-4 py-2.5 pr-12 text-sm font-medium text-zinc-900 outline-none dark:bg-zinc-900 dark:text-zinc-100"
        @change="emit('update:modelValue', $event.target.value)">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <i class="pi pi-chevron-down text-sm"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'all' },
  options: {
    type: Array,
    default: () => [
      { label: 'today', value: 'today' },
      { label: 'tomorrow', value: 'tomorrow' },
      { label: 'next week', value: 'next_week' },
      { label: 'all', value: 'all' }
    ],
  },
})

const emit = defineEmits(['update:modelValue'])
</script>
