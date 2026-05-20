<template>
  <section class="min-h-[calc(100vh-140px)] bg-slate-100 py-12 transition-colors duration-300 dark:bg-slate-950">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="skeleton in itemsPerPage"
          :key="skeleton"
          class="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.3)] dark:border-slate-800/80 dark:bg-slate-900/90"
        >
          <div class="space-y-4">
            <div class="skeleton-shimmer h-4 w-24 rounded-full"></div>
            <div class="skeleton-shimmer h-8 w-3/4 rounded-2xl"></div>
            <div class="skeleton-shimmer h-4 w-full rounded-xl"></div>
            <div class="skeleton-shimmer h-4 w-5/6 rounded-xl"></div>
            <div class="grid gap-3 pt-2">
              <div class="skeleton-shimmer h-16 rounded-2xl"></div>
              <div class="skeleton-shimmer h-16 rounded-2xl"></div>
              <div class="skeleton-shimmer h-16 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="mt-8 space-y-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            v-if="showCreateButton"
            type="button"
            class="inline-flex items-center justify-center gap-2 self-start rounded-full border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-sky-300 hover:text-sky-600 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:text-sky-400"
            @click="$emit('create')"
          >
            <i class="pi pi-calendar-plus"></i> {{ createButtonLabel }}
          </button>

          <div :class="showCreateButton ? '' : 'ml-auto'">
            <BaseDropDown v-model="selectedFilter" :options="filterOptions" />
          </div>
        </div>

        <div v-if="paginatedEvents.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <EventCard
            v-for="event in paginatedEvents"
            :key="event.id"
            :event="event"
            :show-actions="showActions"
            :show-interest-button="showInterestButton"
            :show-date="showDate"
            :show-timer="showTimer"
            @edit="$emit('edit', event)"
            @attendees="$emit('attendees', event)"
          />
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400"
        >
          {{ resolvedEmptyMessage }}
        </div>

        <div
          v-if="paginatedEvents.length && totalPages > 1"
          class="flex flex-col items-center justify-center gap-4 pt-2"
        >
          <p class="text-sm text-slate-500 dark:text-slate-400">Page {{ currentPage }} of {{ totalPages }}</p>

          <div class="flex items-center justify-center gap-3 rounded-full border border-slate-200/80 bg-white/85 px-3 py-3 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/85">
            <button
              type="button"
              class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:text-sky-400"
              :disabled="currentPage === 1"
              @click="goToPreviousPage"
            >
              Previous
            </button>

            <button
              type="button"
              class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:text-sky-400"
              :disabled="currentPage === totalPages"
              @click="goToNextPage"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseDropDown from '../baseui/baseDropDown.vue'
import EventCard from './EventCard.vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: 'No events found.',
  },
  filteredEmptyMessage: {
    type: String,
    default: 'No events found for the selected filter.',
  },
  showCreateButton: {
    type: Boolean,
    default: false,
  },
  createButtonLabel: {
    type: String,
    default: 'Add Event',
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  showInterestButton: {
    type: Boolean,
    default: false,
  },
  showDate: {
    type: Boolean,
    default: true,
  },
  showTimer: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['create', 'edit', 'attendees'])

const selectedFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 3
const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'Next Week', value: 'next_week' },
]

const filteredEvents = computed(() => {
  const now = new Date()
  const todayStart = startOfDay(now)
  const tomorrowStart = addDays(todayStart, 1)
  const dayAfterTomorrowStart = addDays(todayStart, 2)
  const nextWeekStart = startOfDay(addDays(todayStart, 7))
  const nextWeekEnd = endOfDay(addDays(todayStart, 13))

  if (!selectedFilter.value || selectedFilter.value === 'all') {
    return props.events
  }

  return props.events.filter((event) => {
    const eventDate = new Date(event.start_date)

    if (selectedFilter.value === 'today') {
      return eventDate >= todayStart && eventDate < tomorrowStart
    }

    if (selectedFilter.value === 'tomorrow') {
      return eventDate >= tomorrowStart && eventDate < dayAfterTomorrowStart
    }

    if (selectedFilter.value === 'next_week') {
      return eventDate >= nextWeekStart && eventDate <= nextWeekEnd
    }

    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEvents.value.length / itemsPerPage)))
const pageStart = computed(() => (currentPage.value - 1) * itemsPerPage)
const paginatedEvents = computed(() => filteredEvents.value.slice(pageStart.value, pageStart.value + itemsPerPage))
const resolvedEmptyMessage = computed(() => {
  return props.events.length ? props.filteredEmptyMessage : props.emptyMessage
})

watch(selectedFilter, () => {
  currentPage.value = 1
})

watch(filteredEvents, (events) => {
  if (!events.length) {
    currentPage.value = 1
    return
  }

  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

function startOfDay(date) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

function endOfDay(date) {
  const value = new Date(date)
  value.setHours(23, 59, 59, 999)
  return value
}

function addDays(date, days) {
  const value = new Date(date)
  value.setDate(value.getDate() + days)
  return value
}
</script>
