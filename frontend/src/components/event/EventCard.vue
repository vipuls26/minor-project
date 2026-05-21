<template>
  <BaseCard
    class="bg-white/80 transition-all duration-200 hover:border-sky-500/30 dark:bg-slate-900/80"
  >
    <div class="space-y-4">
      <div
        v-if="event.image_url"
        class="overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
      >
        <img
          :src="event.image_url"
          :alt="`${event.name} image`"
          class="h-48 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        >
      </div>

      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 space-y-2">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="badge in badges"
              :key="badge.label"
              class="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              :class="badge.class"
            >
              {{ badge.label }}
            </span>
          </div>

          
          <h2
            class="line-clamp-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
          >
            {{ event.name }}
          </h2>
        </div>

        
        <div v-if="showActions" class="flex shrink-0 gap-1">
          
          <button
            type="button"
            aria-label="Manage attendees"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-sky-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-sky-400"
            :disabled="actionLoading"
            title="Manage attendees"
            @click="$emit('attendees', event)"
          >
            <i class="pi pi-users text-sm"></i>
          </button>

          <button
            type="button"
            aria-label="Edit event"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-sky-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-sky-400"
            :disabled="actionLoading"
            @click="$emit('edit', event)"
          >
            <i class="pi pi-pencil text-sm"></i>
          </button>

          <button
            type="button"
            aria-label="Delete event"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-rose-400"
            :disabled="actionLoading"
            @click="deleteThisEvent"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </div>

      
      <div
        v-if="showTimer"
        class="flex flex-wrap items-center gap-2 text-sm"
      >
        <BaseCountDown
          :target-date="event.start_date"
          :end-date="event.end_date"
          class="justify-start"
        />

        <span
          v-if="countdownHelperText"
          class="text-xs text-slate-400"
        >
          {{ countdownHelperText }}
        </span>
      </div>

      
      <div
        class="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-sm dark:border-slate-800 sm:flex sm:flex-wrap"
      >
        <span class="inline-flex items-center gap-1.5">
          <i class="pi pi-map-marker text-xs text-slate-400"></i>
          <span class="text-slate-600 dark:text-slate-300">
            {{ event.location }}
          </span>
        </span>

        <span class="inline-flex items-center gap-1.5">
          <i class="pi pi-calendar text-xs text-slate-400"></i>
          <span class="text-slate-600 dark:text-slate-300">
            {{ formattedStartDate }}
          </span>
        </span>

        <span class="inline-flex items-center gap-1.5">
          <i class="pi pi-users text-xs text-slate-400"></i>
          <span class="text-slate-600 dark:text-slate-300">
            {{ registrationSummary }}
          </span>
        </span>

        <span class="inline-flex items-center gap-1.5">
          <i class="pi pi-ticket text-xs text-slate-400"></i>

          <span
            :class="seatsLeftClass"
            class="text-slate-600 dark:text-slate-300"
          >
            {{ seatsLeftLabel }}
          </span>
        </span>

        <span
          v-if="showUpdated"
          class="inline-flex items-center gap-1.5 text-xs text-slate-400"
        >
          <i class="pi pi-refresh text-[10px]"></i>
          <span>Updated {{ formattedUpdatedDate }}</span>
        </span>
      </div>

      
      <button
        v-if="showInterestButton"
        type="button"
        class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        :class="interestButtonClass"
        :disabled="isInterestDisabled"
        @click="openInterest"
      >
        <i :class="interestIcon"></i>
        {{ interestButtonLabel }}
      </button>
    </div>
  </BaseCard>
</template>
<script setup>
import { eventStore } from '@/stores/eventStore'
import { useThemeStore } from '@/stores/themeStore'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import BaseCard from '../baseui/baseCard.vue'
import BaseCountDown from '../baseui/baseCountDown.vue'

const emit = defineEmits(['edit', 'attendees'])

const props = defineProps({
  event: {
    type: Object,
    required: true,
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

const categoryPalette = {
  conference: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/15 dark:text-fuchsia-300',
  workshop: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  meetup: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  webinar: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300',
  hackathon: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
  social: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
}

const store = eventStore()
const themeStore = useThemeStore()
const now = ref(Date.now())
const shouldTrackTime = computed(() => props.showInterestButton || props.showTimer)
const actionLoading = computed(() => store.requests?.deleteEvent || false)
let timer = null

function syncNow() {
  now.value = Date.now()
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function startTimer() {
  stopTimer()

  if (!shouldTrackTime.value) {
    return
  }

  syncNow()
  timer = setInterval(syncNow, 1000)
}

const eventStatus = computed(() => {
  const start = new Date(props.event.start_date).getTime()
  const end = props.event.end_date ? new Date(props.event.end_date).getTime() : null

  if (start > now.value) {
    return 'upcoming'
  }

  if (end !== null && end <= now.value) {
    return 'ended'
  }

  return 'started'
})

const attendeeCount = computed(() => Number(props.event.interests_count || 0))
const eventCapacity = computed(() => Number(props.event.capacity || 0))
const seatsLeft = computed(() => {
  if (eventCapacity.value <= 0) {
    return null
  }

  return Math.max(eventCapacity.value - attendeeCount.value, 0)
})

const registrationSummary = computed(() => {
  if (eventCapacity.value > 0) {
    return `${attendeeCount.value} / ${eventCapacity.value}`
  }

  return `${attendeeCount.value}`
})

const seatsLeftLabel = computed(() => {
  if (seatsLeft.value === null) {
    return 'Unlimited'
  }

  return `${seatsLeft.value} left`
})

const seatsLeftClass = computed(() => {
  if (seatsLeft.value === null) {
    return 'text-emerald-600 dark:text-emerald-400'
  }

  if (seatsLeft.value === 0) {
    return 'text-rose-600 dark:text-rose-400'
  }

  if (seatsLeft.value <= 5) {
    return 'text-amber-600 dark:text-amber-400'
  }

  return 'text-slate-600 dark:text-slate-300'
})

const isEventFull = computed(() => {
  return eventCapacity.value > 0 && attendeeCount.value >= eventCapacity.value
})

const isInterestDisabled = computed(() => {
  return props.showInterestButton && (eventStatus.value !== 'upcoming' || isEventFull.value)
})

const interestButtonClass = computed(() => {
  if (isEventFull.value) {
    return 'bg-amber-500 text-amber-950 hover:bg-amber-500 dark:bg-amber-400 dark:text-amber-950'
  }

  if (eventStatus.value === 'started' || eventStatus.value === 'ended') {
    return 'bg-slate-500 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-600'
  }

  return 'bg-sky-600 hover:bg-sky-700'
})

const interestButtonLabel = computed(() => {
  if (isEventFull.value) {
    return 'Fully Booked'
  }

  if (eventStatus.value === 'started') {
    return 'Event Started'
  }

  if (eventStatus.value === 'ended') {
    return 'Event Ended'
  }

  return 'Add Interest'
})

const statusLabel = computed(() => {
  if (isEventFull.value) {
    return 'Fully Booked'
  }

  if (eventStatus.value === 'started') {
    return 'Live Now'
  }

  if (eventStatus.value === 'ended') {
    return 'Ended'
  }

  return 'Upcoming'
})

const statusBadgeClass = computed(() => {
  if (isEventFull.value) {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
  }

  if (eventStatus.value === 'started') {
    return 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300'
  }

  if (eventStatus.value === 'ended') {
    return 'bg-slate-200 text-slate-700 dark:bg-slate-700/70 dark:text-slate-200'
  }

  return 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300'
})

const categoryLabel = computed(() => {
  const value = props.event.category || 'meetup'
  return value.charAt(0).toUpperCase() + value.slice(1)
})

const categoryBadgeClass = computed(() => {
  const value = props.event.category || 'meetup'
  return categoryPalette[value] || categoryPalette.meetup
})

const badges = computed(() => {
  return [
    {
      label: statusLabel.value,
      class: statusBadgeClass.value,
    },
    {
      label: categoryLabel.value,
      class: categoryBadgeClass.value,
    },
  ]
})

const countdownHelperText = computed(() => {
  if (eventStatus.value === 'upcoming') {
    return seatsLeft.value === null ? 'Open registration' : `${seatsLeft.value} seats remaining`
  }

  if (eventStatus.value === 'started') {
    return 'Event is currently in progress.'
  }

  return 'This event has finished.'
})

const formattedStartDate = computed(() => formatDate(props.event.start_date))
const formattedCreatedDate = computed(() => formatDate(props.event.created_at))
const formattedUpdatedDate = computed(() => formatDate(props.event.updated_at))

const showUpdated = computed(() => {
  if (!props.event.updated_at) {
    return false
  }

  if (!props.showDate) {
    return false
  }

  return props.event.updated_at !== props.event.created_at
})

const interestIcon = computed(() => {
  if (isEventFull.value) {
    return 'pi pi-lock'
  }

  if (eventStatus.value === 'started') {
    return 'pi pi-play-circle'
  }

  if (eventStatus.value === 'ended') {
    return 'pi pi-check-circle'
  }

  return 'pi pi-heart'
})

async function deleteThisEvent() {
  const result = await Swal.fire({
    title: 'Delete event?',
    text: `Are you sure you want to delete "${props.event.name}"?`,
    icon: 'warning',
    background: themeStore.darkMode ? '#0f172a' : '#ffffff',
    color: themeStore.darkMode ? '#e2e8f0' : '#0f172a',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
  })

  if (!result.isConfirmed) {
    return
  }

  await store.deleteEvent(props.event.id)
}

function openInterest() {
  if (isInterestDisabled.value) {
    return
  }

  emit('attendees', props.event)
}

watch(shouldTrackTime, startTimer)

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

function formatDate(value) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
</script>
