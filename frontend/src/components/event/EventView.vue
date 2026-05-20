<template>
  <section class="min-h-[calc(100vh-140px)] bg-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <div v-if="store.loading" class="flex justify-center">
        <i class="pi pi-spin pi-spinner text-2xl"></i>
      </div>

      <div v-else-if="store.eventsData.length">

        <div class="flex justify-between items-center gap-4">
          <button type="button"
            class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-3 text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:text-sky-400"
            @click="openCreateDialog">
            <i class="pi pi-file-plus" style="font-size: 1.5rem;"></i>
          </button>
        
          <BaseEventFilterDropdown v-model="selectedFilter" :options="filterOptions" />
        
      </div>

      <div class="mt-10 grid gap-6 lg:grid-cols-3">
        <EventCard v-for="event in paginatedEvents" 
                :key="event.id" 
                :event="event" 
                @edit="openEditDialog"
                @attendees="openAttendeeDialog" />
      </div>

      <p v-if="!filteredEvents.length" class="mt-10 text-center text-slate-500 dark:text-slate-400">
        No events found for the selected filter.
      </p>

      <div v-else-if="totalPages > 1" class="mt-10 flex flex-col sm:flex-row sm:justify-between gap-4">
        <p class="text-sm text-slate-500 dark:text-slate-400">Page {{ currentPage }} of {{ totalPages }}</p>

        <div class="flex items-center gap-3">
          <button type="button"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            :disabled="currentPage === 1" @click="goToPreviousPage">
            Previous
          </button>

          <button type="button"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            :disabled="currentPage === totalPages" @click="goToNextPage">
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="text-center text-slate-500 dark:text-slate-400">No events found.</p>
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

const pageEnd = computed(() => {
  return Math.min(pageStart.value + paginatedEvents.value.length, filteredEvents.value.length)
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
