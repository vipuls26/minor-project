<template>
  <section class="min-h-[calc(100vh-140px)] bg-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center px-10">
        <i class="pi pi-spin pi-spinner text-2xl"></i>
      </div>

      <div v-else class="mt-10 space-y-6">
        <div class="flex items-center justify-between gap-4">
          <button
            v-if="showCreateButton"
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white p-3 text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:text-sky-400"
            @click="$emit('create')"
          >
            <i class="pi pi-calendar-plus"></i> {{ createButtonLabel }}
          </button>

          <div :class="showCreateButton ? '' : 'ml-auto'">
            <BaseDropDown v-model="selectedFilter" :options="filterOptions" />
          </div>
        </div>

        <div v-if="paginatedEvents.length" class="grid gap-6 lg:grid-cols-3">
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
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-sm text-slate-500 dark:text-slate-400">Page {{ currentPage }} of {{ totalPages }}</p>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              :disabled="currentPage === 1"
              @click="goToPreviousPage"
            >
              Previous
            </button>

            <button
              type="button"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
