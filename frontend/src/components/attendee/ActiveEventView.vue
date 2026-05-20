<template>
  <EventCollectionView
    :events="store.activeEventList"
    :loading="store.requests.fetchActiveEvents"
    empty-message="There are no active events right now."
    filtered-empty-message="No active events found."
    :show-actions="false"
    show-interest-button
    :show-date="false"
    show-timer
    @attendees="openInterestForm"
  />

  <AttendeeModal
    :is-open="isInterestFormOpen"
    :event="selectedEvent"
    :can-register="true"
    :show-table="false"
    @close="closeInterestForm"
  />
</template>

<script setup>
import { eventStore } from '@/stores/eventStore'
import { onMounted, ref } from 'vue'
import EventCollectionView from '../event/EventCollectionView.vue'
import AttendeeModal from './AttendeeModal.vue'

const store = eventStore()
const isInterestFormOpen = ref(false)
const selectedEvent = ref(null)

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
</script>
