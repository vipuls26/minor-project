<template>
  <BaseCard>
    <div class="space-y-5">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
              :class="statusBadgeClass"
            >
              {{ statusLabel }}
            </span>
            <div v-if="showTimer">
              <BaseCountDown :target-date="event.start_date" :end-date="event.end_date" />
            </div>
          </div>

          <h2 class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{{ event.name }}</h2>
        </div>

        <div v-if="showActions" class="flex gap-2">
          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
            :disabled="actionLoading" title="Manage attendees" @click="$emit('attendees', event)">
            <i class="pi pi-users text-sm"></i>
          </button>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
            :disabled="actionLoading" @click="$emit('edit', event)">
            <i class="pi pi-pencil text-sm"></i>
          </button>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-rose-400 dark:hover:text-rose-400"
            :disabled="actionLoading" @click="deleteThisEvent">
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </div>

      <p class="text-sm font-normal leading-6 text-slate-500 dark:text-slate-400">
        Manage capacity, timing, and attendee flow from one clean event summary.
      </p>

      <button v-if="showInterestButton" type="button"
        class="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(15,23,42,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed"
        :class="interestButtonClass"
        :disabled="isInterestDisabled"
        @click="openInterest">
        <i class="pi pi-user-plus text-sm"></i>
        {{ interestButtonLabel }}
      </button>

      <div class="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
        <div class="grid gap-2 rounded-[1.4rem] border border-slate-200/80 bg-slate-50/95 p-4 dark:border-slate-800/80 dark:bg-slate-800/70">
          <div class="flex items-center gap-3">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
              <i class="pi pi-map-marker"></i>
            </span>
            <div>
              <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Location</p>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ event.location }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <i class="pi pi-calendar"></i>
            </span>
            <div>
              <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Date</p>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ formattedStartDate }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <i class="pi pi-users"></i>
            </span>
            <div>
              <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Capacity</p>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ compactCapacity }}</p>
            </div>
          </div>
        </div>

        <div v-if="showDate" class="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div class="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-900/55">
            <p class="font-medium uppercase tracking-[0.16em]">Created</p>
            <p class="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">{{ formattedCreatedDate }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-900/55">
            <p class="font-medium uppercase tracking-[0.16em]">Updated</p>
            <p class="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">{{ formattedUpdatedDate }}</p>
          </div>
        </div>

        <p v-if="isEventFull" class="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
          Registration closed
        </p>
      </div>
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
  }

})

const store = eventStore()
const themeStore = useThemeStore()
const now = ref(Date.now())
const shouldTrackTime = computed(() => props.showInterestButton || props.showTimer)
const actionLoading = computed(() => store.requests.deleteEvent)
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

const compactCapacity = computed(() => {
  if (eventCapacity.value > 0) {
    return `${attendeeCount.value} / ${eventCapacity.value}`
  }

  return `${attendeeCount.value}`
})

const formattedStartDate = computed(() => formatDate(props.event.start_date))
const formattedCreatedDate = computed(() => formatDate(props.event.created_at))
const formattedUpdatedDate = computed(() => formatDate(props.event.updated_at))

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
