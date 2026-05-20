<template>
  <BaseCard>

    <div class="space-y-4">
      <div class="flex items-start justify-between gap-4">
        <h2 class="text font-bold text-slate-900 dark:text-slate-100">{{ event.name }}</h2>

        <div v-if="showTimer">
         <BaseCountDown :target-date="event.start_date" :end-date="event.end_date" />
        </div>

        <div v-if="showActions" class="flex gap-2">
          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-sky-500 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
            title="Manage attendees" @click="$emit('attendees', event)">
            <i class="pi pi-users text-sm"></i>
          </button>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-sky-500 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
            @click="$emit('edit', event)">
            <i class="pi pi-pencil text-sm"></i>
          </button>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-sky-500 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
            @click="deleteThisEvent">
            <i class="pi pi-trash text-sm"></i>
          </button>

        </div>
      </div>

      <button v-if="showInterestButton" type="button"
        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:bg-slate-400"
        :disabled="isInterestDisabled"
        @click="openInterest">
        <i class="pi pi-user-plus text-sm"></i>
        {{ interestButtonLabel }}
      </button>

      <div class="grid gap-3 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Location</p>
          <p class="mt-2 font-semibold text-slate-900 dark:text-slate-100">{{ event.location }}</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Start Date</p>
          <p class="mt-2 font-semibold text-slate-900 dark:text-slate-100">{{ event.start_date.split('T')[0] }}</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Registrations</p>
          <p class="mt-2 font-semibold text-slate-900 dark:text-slate-100">{{ registrationSummary }}</p>
        </div>

        <div v-if="showDate" class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Created</p>
          <p class="mt-2 font-semibold text-slate-900 dark:text-slate-100">{{ event.created_at.split('T')[0] }}</p>
        </div>

        <div v-if="showDate" class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Updated</p>
          <p class="mt-2 font-semibold text-slate-900 dark:text-slate-100">{{ event.updated_at.split('T')[0] }}</p>
        </div>

      </div>

    </div>
    
  </BaseCard>
</template>

<script setup>
import { eventStore } from '@/stores/eventStore'
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
const now = ref(Date.now())
const shouldTrackTime = computed(() => props.showInterestButton || props.showTimer)
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
const registrationSummary = computed(() => {
  if (eventCapacity.value > 0) {
    return `${attendeeCount.value}/${eventCapacity.value}`
  }

  return `${attendeeCount.value}`
})

const isEventFull = computed(() => {
  return eventCapacity.value > 0 && attendeeCount.value >= eventCapacity.value
})

const isInterestDisabled = computed(() => {
  return props.showInterestButton && (eventStatus.value !== 'upcoming' || isEventFull.value)
})

const interestButtonLabel = computed(() => {
  if (isEventFull.value) {
    return 'Event Full'
  }

  if (eventStatus.value === 'started') {
    return 'Event Started'
  }

  if (eventStatus.value === 'ended') {
    return 'Event Ended'
  }

  return 'Add Interest'
})

async function deleteThisEvent() {
  const result = await Swal.fire({
    title: 'Delete event?',
    text: `Are you sure you want to delete "${props.event.name}"?`,
    icon: 'warning',
    background: 'dark:bg-slate-800',
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

</script>
