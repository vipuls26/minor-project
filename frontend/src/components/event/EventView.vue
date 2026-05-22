<template>
  <section class="min-h-[calc(100vh-140px)] bg-white py-6 sm:py-8 transition-colors duration-300 dark:bg-zinc-950">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <div v-if="store.loading" class="flex justify-center py-10">
        <i class="pi pi-spin pi-spinner text-3xl text-zinc-500 dark:text-zinc-400"></i>
      </div>

      <div v-else-if="store.eventsData.length" class="space-y-6 sm:space-y-8">

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 sm:py-2.5 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:border-indigo-600 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:text-indigo-500 sm:w-auto"
            @click="openCreateDialog">
            <i class="pi pi-plus"></i>
            New Event
          </button>

          <BaseEventFilterDropdown v-model="selectedFilter" :options="filterOptions" />
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <EventCard v-for="event in paginatedEvents" :key="event.id" :event="event" :show-timer="false"
            @edit="openEditDialog" @attendees="openAttendeeDialog" />
        </div>


        <div v-if="!filteredEvents.length"
          class="rounded-2xl border border-zinc-200 bg-zinc-50/90 px-6 py-10 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
          No events found for the selected filter.
        </div>

        <BasePagination v-else-if="totalPages > 1" v-model:currentPage="currentPage" :total-pages="totalPages" />
      </div>

      <div v-else>
        <div
          class="rounded-2xl border border-zinc-200 bg-zinc-50/90 px-6 py-10 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
          No events found.
        </div>
      </div>
    </div>
  </section>

  <FormAdd :is-open="isCreateDialogOpen" mode="create" :loading="store.loading" :errors="formErrors"
    @close="closeCreateDialog" @submit="handleCreateEvent" />

  <FormAdd :is-open="isEditDialogOpen" mode="edit" :initial-event="selectedEvent" :loading="store.loading"
    :errors="formErrors" @close="closeEditDialog" @submit="handleUpdateEvent" />


  <AttendeeModal :is-open="isAttendeeDialogOpen" :event="selectedAttendeeEvent" :can-register="false"
    @close="closeAttendeeDialog" />
</template>

<script setup>

import { eventStore } from '@/stores/eventStore'
import { computed, onMounted, ref, watch } from 'vue'
import AttendeeModal from '../attendee/AttendeeModal.vue'
import BasePagination from '../baseui/BasePagination.vue'
import BaseEventFilterDropdown from '../baseui/BaseEventFilterDropdown.vue'
import EventCard from './EventCard.vue'
import FormAdd from '../common/FormAdd.vue'


const store = eventStore()
const isCreateDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const isAttendeeDialogOpen = ref(false)
const selectedEvent = ref(null)
const selectedAttendeeEvent = ref(null)
const formErrors = ref({})
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
    return store.eventsData
  }

  return store.eventsData.filter((event) => {
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

onMounted(async () => {
  store.fetchEvent()
})

function openCreateDialog() {
  formErrors.value = {}
  isCreateDialogOpen.value = true
}

function closeCreateDialog() {
  isCreateDialogOpen.value = false
  formErrors.value = {}
}

function openEditDialog(event) {
  selectedEvent.value = { ...event }
  formErrors.value = {}
  isEditDialogOpen.value = true
}

function closeEditDialog() {
  isEditDialogOpen.value = false
  selectedEvent.value = null
  formErrors.value = {}
}

function openAttendeeDialog(event) {
  selectedAttendeeEvent.value = event
  isAttendeeDialogOpen.value = true
}

function closeAttendeeDialog() {
  isAttendeeDialogOpen.value = false
  selectedAttendeeEvent.value = null
}

async function handleUpdateEvent(payload) {
  if (!selectedEvent.value?.id) {
    return
  }

  const result = await store.updateEvent(selectedEvent.value.id, payload)

  if (result.ok) {
    closeEditDialog()
    return
  }

  formErrors.value = {
    general: result.message,
    fields: result.errors,
  }
}

async function handleCreateEvent(payload) {
  const result = await store.createEvent(payload)

  if (result.ok) {
    closeCreateDialog()
    currentPage.value = 1
    return
  }

  formErrors.value = {
    general: result.message,
    fields: result.errors,
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
