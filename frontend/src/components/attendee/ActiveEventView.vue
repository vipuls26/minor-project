<template>
  <section class="min-h-[calc(100vh-140px)] bg-white py-6 sm:py-8 transition-colors duration-300 dark:bg-zinc-950">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <div v-if="store.loading" class="flex justify-center py-10">
        <i class="pi pi-spin pi-spinner text-3xl text-zinc-500 dark:text-zinc-400"></i>
      </div>

      <div v-else class="space-y-6 sm:space-y-8">

        <div v-if="upcomingEvents.length" class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Upcoming Events
            </h1>

            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Discover and register for upcoming events.
            </p>
          </div>

          <BaseEventFilterDropdown v-model="selectedFilter" :options="filterOptions" />
        </div>

        <div v-if="filteredEvents.length" class="grid gap-6 lg:grid-cols-3">
          <EventCard v-for="event in paginatedEvents" :key="event.id" :event="event" :show-actions="false"
            :show-interest-button="true" :show-date="false" :show-timer="true" @attendees="openInterestForm" />
        </div>

        <div v-else
          class="rounded-2xl border border-zinc-200 bg-zinc-50/90 px-6 py-10 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
          {{ emptyStateMessage }}
        </div>

        <BasePagination
          v-if="filteredEvents.length && totalPages > 1"
          v-model:currentPage="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </div>
  </section>


  <AttendeeModal :is-open="isInterestFormOpen" :event="selectedEvent" :can-register="true" :show-table="false"
    @close="closeInterestForm" />
</template>

<script setup>
import { eventStore } from '@/stores/eventStore'
import { computed, onMounted, ref, watch } from 'vue'
import AttendeeModal from './AttendeeModal.vue'
import BasePagination from '../baseui/BasePagination.vue'
import EventCard from '../event/EventCard.vue'
import BaseEventFilterDropdown from '../baseui/BaseEventFilterDropdown.vue'

const store = eventStore()
const isInterestFormOpen = ref(false)
const selectedEvent = ref(null)
const selectedFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 3
const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'Next Week', value: 'next_week' },
]

const upcomingEvents = computed(() => {
  const now = new Date()

  return store.activeEventList.filter((event) => {
    const startDate = new Date(event.start_date)
    return startDate > now
  })
})

const filteredEvents = computed(() => {
  const now = new Date()
  const todayStart = startOfDay(now)
  const tomorrowStart = addDays(todayStart, 1)
  const dayAfterTomorrowStart = addDays(todayStart, 2)
  const nextWeekStart = startOfDay(addDays(todayStart, 7))
  const nextWeekEnd = endOfDay(addDays(todayStart, 13))

  if (!selectedFilter.value || selectedFilter.value === 'all') {
    return upcomingEvents.value
  }

  return upcomingEvents.value.filter((event) => {
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

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredEvents.value.length / itemsPerPage))
})

const emptyStateMessage = computed(() => {
  if (!upcomingEvents.value.length) {
    return 'There are no upcoming events right now.'
  }

  return 'No upcoming events found for the selected filter.'
})

const pageStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const paginatedEvents = computed(() => {
  return filteredEvents.value.slice(pageStart.value, pageStart.value + itemsPerPage)
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

onMounted(() => {
  store.activeEvent()
})

function openInterestForm(event) {
  selectedEvent.value = event
  isInterestFormOpen.value = true
}

function closeInterestForm() {
  isInterestFormOpen.value = false
  selectedEvent.value = null
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
