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

const palette = ['blue', 'emerald', 'amber', 'rose', 'violet', 'cyan']

const eventAttributes = computed(() =>
  props.events
    .filter((event) => event.start_date)
    .map((event, idx) => ({
      key: `${event.id ?? idx}`,
      dates: {
        start: new Date(event.start_date),
        end: new Date(event.end_date || event.start_date),
      },
      highlight: {
        color: palette[idx % palette.length],
        fillMode: 'light',
      },
      dot: {
        color: palette[idx % palette.length],
      },
      popover: {
        label: event.location ? `${event.name} • ${event.location}` : event.name,
      },
    }))
)

const hasEvents = computed(() => eventAttributes.value.length > 0)
</script>

<template>
  <section
    class="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85 dark:shadow-black/20"
  >
    <div class="mb-4 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Event Calendar</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Browse upcoming schedules and multi-day events at a glance.
        </p>
      </div>
      <span
        class="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      >
        {{ loading ? 'Loading events...' : `${eventAttributes.length} scheduled` }}
      </span>
    </div>

    <div
      v-if="loading"
      class="flex h-420px items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-400"
    >
      Fetching event schedule...
    </div>

    <div
      v-else-if="!hasEvents"
      class="flex h-420px items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-400"
    >
      No events yet. Create one to see it on the calendar.
    </div>

    <Calendar
      v-else
      expanded
      transparent
      borderless
      :attributes="eventAttributes"
      class="w-full rounded-3xl bg-transparent [--vc-accent-50:rgb(239_246_255)] [--vc-accent-100:rgb(219_234_254)] [--vc-accent-200:rgb(191_219_254)] [--vc-accent-300:rgb(147_197_253)] [--vc-accent-400:rgb(96_165_250)] [--vc-accent-500:rgb(59_130_246)] [--vc-accent-600:rgb(37_99_235)] [--vc-accent-700:rgb(29_78_216)] [--vc-accent-800:rgb(30_64_175)] [--vc-accent-900:rgb(30_58_138)] [&_.vc-container]:w-full [&_.vc-container]:border-0 [&_.vc-container]:bg-transparent [&_.vc-container]:text-slate-900 [&_.vc-day-content]:text-slate-900 [&_.vc-header]:bg-transparent [&_.vc-title]:text-slate-900 [&_.vc-weekday]:text-slate-900 [&_.vc-weekdays]:bg-transparent [&_.vc-weeks]:bg-transparent dark:[&_.vc-container]:text-slate-200 dark:[&_.vc-day-content]:text-slate-200 dark:[&_.vc-day-layer]:opacity-95 dark:[&_.vc-day-popover-row-content]:text-slate-200 dark:[&_.vc-nav-item]:text-slate-200 dark:[&_.vc-nav-title]:text-slate-200 dark:[&_.vc-popover-content]:border-slate-700 dark:[&_.vc-popover-content]:bg-slate-900 dark:[&_.vc-popover-content]:text-slate-200 dark:[&_.vc-title]:text-slate-200 dark:[&_.vc-weekday]:text-slate-200"
    />
  </section>
</template>
