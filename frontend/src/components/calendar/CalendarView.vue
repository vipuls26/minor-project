<script setup>
import { computed } from 'vue'
import { Calendar } from 'v-calendar'
import 'v-calendar/style.css'

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },
})

const eventAttributes = computed(() =>
  props.events.map((event) => ({
    key: event.id,

    dates: [
      new Date(event.start_date),
      new Date(event.end_date || event.start_date),
    ],

    highlight: {
      color: 'slate',
      fillMode: 'light',
    },

    dot: {
      color: 'slate',
    },

    popover: {
      label: event.location
        ? `${event.name} • ${event.location}`
        : event.name,
    },
  })),
)
</script>

<template>
  <section
    class="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

    <div class="mb-4 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Event Calendar
        </h2>

        <p class="text-sm text-slate-500 dark:text-slate-400">
          Browse upcoming events.
        </p>
      </div>

      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {{ loading ? 'Loading...' : `${eventAttributes.length} events` }}
      </span>
    </div>

    <div v-if="loading"
      class="flex h-420px items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      Loading calendar...
    </div>

    <!-- Empty -->
    <div v-else-if="!eventAttributes.length"
      class="flex h-420px items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      No events available.
    </div>

    <Calendar v-else expanded borderless :attributes="eventAttributes"
      class="rounded-2xl bg-slate-100 dark:bg-slate-800" />
  </section>
</template>
