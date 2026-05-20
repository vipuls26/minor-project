<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
        @click.self="emit('close')">
        <Transition name="modal-scale" appear>
          <div
            v-if="isOpen"
            class="w-full max-w-xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/95 shadow-[0_32px_80px_-32px_rgba(15,23,42,0.55)] max-sm:max-h-[calc(100vh-1.5rem)] dark:border-slate-700/70 dark:bg-slate-900/95 sm:max-h-[calc(100vh-3rem)]">
            <div class="p-5 sm:p-7">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                    {{ isEditMode ? 'Update Event' : 'New Event' }}
                  </p>
                  <h2 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    {{ isEditMode ? 'Edit event details' : 'Add event details' }}
                  </h2>
                </div>

                <button type="button"
                  class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
                  @click="emit('close')">
                  <i class="pi pi-times"></i>
                </button>
              </div>

              <form class="mt-6 grid gap-4 md:grid-cols-2" @submit.prevent="submitForm">
                <div class="space-y-2 md:col-span-2">
                  <BaseInput id="name" label="Event Name" v-model="form.name" placeholder="Enter event name"
                    icon="pi-calendar-plus" :error="fieldError('name')" />

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
                    :min="minimumStartDate" :error="fieldError('start_date')" icon="pi-clock" />
                </div>

                <div class="space-y-2">
                  <BaseInput id="end_date" label="End Date" v-model="form.end_date" type="datetime-local"
                    :min="minimumEndDate" :error="fieldError('end_date')" icon="pi-clock" />
                </div>

                <div v-if="isEditMode" class="space-y-2 md:col-span-2">
                  <BaseSelectDropdown id="status" v-model="form.status" />
                </div>


                <div class="sticky bottom-0 -mx-5 mt-2 border-t border-slate-200/80 bg-white/92 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 dark:border-slate-800/80 dark:bg-slate-900/95 sm:dark:bg-transparent md:col-span-2">
                  <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button type="button"
                      class="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 sm:w-auto sm:px-5 sm:text-base dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800"
                      @click="emit('close')">
                      Cancel
                    </button>

                    <button type="submit"
                      class="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(2,132,199,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-5 sm:text-base"
                      :disabled="loading">
                      {{ loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import * as yup from 'yup'

import BaseInput from '../baseui/baseInput.vue'
import BaseSelectDropdown from '../baseui/baseSelectDropdown.vue'


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
  name: yup.string().trim().required('Event name is required'),
  location: yup.string().trim().required('Location is required'),
  start_date: yup
    .string()
    .required('Start date is required')
    .test('is-future-date', 'Start date must be in the future', (value) => {
      if (!value) {
        return false
      }

      return isFutureDateTime(value)
    }),
  end_date: yup
    .string()
    .required('End date is required')
    .test('is-after-start-date', 'End date must be after the start date', (value) => {
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
    .typeError('Capacity must be a number')
    .integer('Capacity must be a whole number')
    .min(1, 'Minimum capacity must be at least 1')
    .required('Capacity is required'),
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
