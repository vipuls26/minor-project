<template>
  <Teleport to="body">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-3 py-4 sm:items-center sm:px-4 sm:py-6"
      @click.self="emit('close')">
      <div
        class="w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl max-sm:max-h-[calc(100vh-2rem)] dark:bg-slate-900 sm:p-6 sm:max-h-[calc(100vh-3rem)]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              {{ isEditMode ? 'Update Event' : 'New Event' }}
            </p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {{ isEditMode ? 'Edit event details' : 'Add event details' }}
            </h2>
          </div>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
            @click="emit('close')">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <form class="mt-6 grid gap-4 md:grid-cols-2" @submit.prevent="submitForm">
          <div class="space-y-2 md:col-span-2">
            <BaseInput id="name" label="Event Name" v-model="form.name" placeholder="Enter event name" icon="pi-bell"
              :error="fieldError('name')" />

          </div>

          <div class="space-y-2">
            <BaseInput id="location" label="Location" v-model="form.location" type="text" placeholder="Enter location"
              :error="fieldError('location')" icon="pi-map-marker" />
          </div>

          <div class="space-y-2">
            <BaseInput id="capacity" label="Total Capacity" v-model="form.capacity" type="number" min="1" step="1"
              :error="fieldError('capacity')" icon="pi-users" placeholder="capacity" />
          </div>

          <div class="space-y-2">
            <BaseInput id="start_date" label="Start Date" v-model="form.start_date" type="datetime-local"
              :min="minimumStartDate" :error="fieldError('start_date')" icon="pi-calendar-plus" />
          </div>

          <div class="space-y-2">
            <BaseInput id="end_date" label="End Date" v-model="form.end_date" type="datetime-local"
              :min="minimumEndDate" :error="fieldError('end_date')" icon="pi-calendar-plus" />
          </div>



          <div v-if="isEditMode" class="space-y-2 md:col-span-2">
            <BaseStatusSelect id="status" v-model="form.status" />
          </div>

          <div class="flex flex-col gap-3 pt-2 md:col-span-2 sm:flex-row sm:justify-end">
            <button type="button"
              class="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="emit('close')">
              Cancel
            </button>
            <button type="submit"
              class="rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="loading">
              {{ loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import * as yup from 'yup'

import BaseInput from '../baseui/baseInput.vue'
import BaseStatusSelect from '../baseui/BaseStatusSelect.vue'


const props = defineProps({
  isOpen: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  initialEvent: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  name: '',
  location: '',
  start_date: '',
  end_date: '',
  capacity: '',
  status: 'active',
})

const localErrors = ref({})
const isEditMode = computed(() => props.mode === 'edit')
const minimumStartDate = computed(() => toDateTimeLocal(new Date()))
const minimumEndDate = computed(() => form.start_date || minimumStartDate.value)

const validationSchema = yup.object({
  name: yup.string().trim().required('event name is required'),
  location: yup.string().trim().required('location is required'),
  start_date: yup
    .string()
    .required('start date is required')
    .test('is-future-date', 'start date must be in the future', (value) => {
      if (!value) {
        return false
      }

      return isFutureDateTime(value)
    }),
  end_date: yup
    .string()
    .required('end date is required')
    .test('is-after-start-date', 'end date must be after the start date', (value) => {
      if (!value) {
        return false
      }

      if (!form.start_date) {
        return isFutureDateTime(value)
      }

      return isAfterDateTime(value, form.start_date)
    }),
  capacity: yup
    .number()
    .typeError('capacity must be a number')
    .integer('capacity must be a whole number')
    .min(1, 'minimum capacity must be at least 1')
    .required('capacity is required'),
})

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fillForm()
    }
  },
)

watch(
  () => props.initialEvent,
  () => {
    if (props.isOpen) {
      fillForm()
    }
  },
)

function fillForm() {
  form.name = props.initialEvent?.name || ''
  form.location = props.initialEvent?.location || ''
  form.start_date = toDateTimeLocal(props.initialEvent?.start_date || '')
  form.end_date = toDateTimeLocal(props.initialEvent?.end_date || '')
  form.capacity = props.initialEvent?.capacity || '1'
  form.status = props.initialEvent?.status || 'active'
  localErrors.value = {}
}

async function submitForm() {
  const isValid = await validateForm()

  if (!isValid) {
    return
  }

  localErrors.value = {}
  emit('submit', {
    name: form.name.trim(),
    location: form.location.trim(),
    start_date: form.start_date,
    end_date: form.end_date,
    capacity: Number(form.capacity),
    status: form.status,
  })
}

async function validateForm() {
  try {
    await validationSchema.validate(form, { abortEarly: false })
    localErrors.value = {}
    return true
  } catch (error) {
    const errors = {}

    if (error instanceof yup.ValidationError) {
      error.inner.forEach((issue) => {
        if (issue.path && !errors[issue.path]) {
          errors[issue.path] = issue.message
        }
      })
    }

    localErrors.value = errors
    return false
  }
}

function fieldError(fieldName) {
  const backendError = props.errors.fields?.[fieldName]

  if (localErrors.value[fieldName]) {
    return localErrors.value[fieldName]
  }

  return Array.isArray(backendError) ? backendError[0] : backendError
}

function isFutureDateTime(value) {
  const targetTimestamp = new Date(value).getTime()
  const currentTimestamp = Date.now()

  return Number.isFinite(targetTimestamp) && targetTimestamp > currentTimestamp
}

function isAfterDateTime(value, compareValue) {
  const targetTimestamp = new Date(value).getTime()
  const compareTimestamp = new Date(compareValue).getTime()

  return Number.isFinite(targetTimestamp) && Number.isFinite(compareTimestamp) && targetTimestamp > compareTimestamp
}

function toDateTimeLocal(value) {
  if (!value) {
    return ''
  }

  const dateText = typeof value === 'string' ? value : value.toISOString()
  return dateText.replace(' ', 'T').slice(0, 16)
}
</script>
