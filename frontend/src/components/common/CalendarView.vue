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
    class="rounded-3xl border border-zinc-200/80 bg-zinc-50/95 p-4 sm:p-5 shadow-xl shadow-zinc-200/40 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-black/20"
  >
    <div class="mb-4 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Event Calendar</h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Browse upcoming schedules and multi-day events at a glance.
        </p>
      </div>
      <span
        class="rounded-full bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
      >
        {{ loading ? 'Loading events...' : `${eventAttributes.length} scheduled` }}
      </span>
    </div>

    <div
      v-if="loading"
      class="flex h-420px items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
    >
      Fetching event schedule...
    </div>

    <div
      v-else-if="!hasEvents"
      class="flex h-420px items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
    >
      No events yet. Create one to see it on the calendar.
    </div>

    <Calendar
      v-else
      expanded
      transparent
      borderless
      :attributes="eventAttributes"
      class="w-full rounded-3xl bg-transparent [--vc-accent-50:rgb(238_242_255)] [--vc-accent-100:rgb(224_231_255)] [--vc-accent-200:rgb(199_210_254)] [--vc-accent-300:rgb(165_180_252)] [--vc-accent-400:rgb(129_140_248)] [--vc-accent-500:rgb(99_102_241)] [--vc-accent-600:rgb(79_70_229)] [--vc-accent-700:rgb(67_56_202)] [--vc-accent-800:rgb(55_48_163)] [--vc-accent-900:rgb(49_46_129)] [&_.vc-container]:w-full [&_.vc-container]:border-0 [&_.vc-container]:bg-transparent [&_.vc-container]:text-zinc-900 [&_.vc-day-content]:text-zinc-900 [&_.vc-header]:bg-transparent [&_.vc-title]:text-zinc-900 [&_.vc-weekday]:text-zinc-900 [&_.vc-weekdays]:bg-transparent [&_.vc-weeks]:bg-transparent dark:[&_.vc-container]:text-zinc-100 dark:[&_.vc-day-content]:text-zinc-100 dark:[&_.vc-day-layer]:opacity-95 dark:[&_.vc-day-popover-row-content]:text-zinc-100 dark:[&_.vc-nav-item]:text-zinc-100 dark:[&_.vc-nav-title]:text-zinc-100 dark:[&_.vc-popover-content]:border-zinc-800 dark:[&_.vc-popover-content]:bg-zinc-900 dark:[&_.vc-popover-content]:text-zinc-100 dark:[&_.vc-title]:text-zinc-100 dark:[&_.vc-weekday]:text-zinc-100"
    />
  </section>
</template>
