<template>
  <EventCollectionView
    :events="store.eventsData"
    :loading="store.requests.fetchEvents"
    empty-message="No events found."
    filtered-empty-message="No events found for the selected filter."
    show-create-button
    show-actions
    show-date
    @create="openCreateDialog"
    @edit="openEditDialog"
    @attendees="openAttendeeDialog"
  />

  <FormAdd
    :is-open="isCreateDialogOpen"
    mode="create"
    :loading="store.requests.createEvent"
    :errors="formErrors"
    @close="closeCreateDialog"
    @submit="handleCreateEvent"
  />

  <FormAdd
    :is-open="isEditDialogOpen"
    mode="edit"
    :initial-event="selectedEvent"
    :loading="store.requests.updateEvent"
    :errors="formErrors"
    @close="closeEditDialog"
    @submit="handleUpdateEvent"
  />

  <AttendeeModal
    :is-open="isAttendeeDialogOpen"
    :event="selectedAttendeeEvent"
    :can-register="false"
    @close="closeAttendeeDialog"
  />
</template>

<script setup>
import { eventStore } from '@/stores/eventStore'
import { onMounted, ref } from 'vue'
import AttendeeModal from '../attendee/AttendeeModal.vue'
import FormAdd from '../common/FormAdd.vue'
import EventCollectionView from './EventCollectionView.vue'

const store = eventStore()
const isCreateDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const isAttendeeDialogOpen = ref(false)
const selectedEvent = ref(null)
const selectedAttendeeEvent = ref(null)
const formErrors = ref({})

onMounted(() => {
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
    return
  }

  formErrors.value = {
    general: result.message,
    fields: result.errors,
  }
}
</script>
