<template>
  <Teleport to="body">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-zinc-950/45 px-3 py-4 sm:items-center sm:px-4 sm:py-6"
      @click.self="emit('close')">
      <div
        class="w-full max-w-2xl overflow-y-auto rounded-2xl bg-zinc-50 p-3 shadow-2xl max-sm:max-h-[calc(100vh-2rem)] dark:bg-zinc-900 sm:p-5 sm:max-h-[calc(100vh-3rem)]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-500">
              {{ isEditMode ? 'Update Event' : 'New Event' }}
            </p>
            <h2 class="mt-2 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {{ isEditMode ? 'Edit event details' : 'Add event details' }}
            </h2>
          </div>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:text-zinc-100"
            @click="emit('close')">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <form class="mt-5 grid gap-4 md:grid-cols-2" @submit.prevent="submitForm">

          <div class="space-y-2 md:col-span-2">
            <BaseInput id="name" label="Event Name" required v-model="form.name" placeholder="Enter event name"
              icon="pi-calendar-plus" :error="fieldError('name')" />

          </div>

          <div class="space-y-2">
            <BaseStatusSelect id="category" label="Category" required v-model="form.category"
              :options="categoryOptions" />
            <p v-if="fieldError('category')" class="mt-1 text-sm text-red-600">
              {{ fieldError('category') }}
            </p>
          </div>

          <div class="space-y-2">
            <BaseInput id="location" label="Location" required v-model="form.location" type="text"
              placeholder="Enter location" :error="fieldError('location')" icon="pi-map-marker" />
          </div>

          <div class="space-y-2">
            <BaseInput id="start_date" label="Start Date" required v-model="form.start_date" type="datetime-local"
              :min="minimumStartDate" :error="fieldError('start_date')" icon="pi-clock" />
          </div>

          <div class="space-y-2">
            <BaseInput id="end_date" label="End Date" required v-model="form.end_date" type="datetime-local"
              :min="minimumEndDate" :error="fieldError('end_date')" icon="pi-clock" />
          </div>

          <div class="space-y-2">
            <BaseInput id="capacity" label="Total Capacity" required v-model="form.capacity" type="number" min="1"
              step="1" :error="fieldError('capacity')" icon="pi-users" placeholder="capacity" />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label for="image" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Event Image
            </label>

            <div v-if="imagePreview"
              class="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <img :src="imagePreview" alt="Event preview" class="h-48 w-full object-cover">
            </div>

            <input id="image" ref="imageInput" type="file" accept="image/png,image/jpeg,image/webp"
              class="block w-full rounded-xl border border-zinc-200/90 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:font-medium file:text-indigo-600 hover:file:bg-indigo-100 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:file:bg-indigo-500/15 dark:file:text-indigo-200 sm:py-2.5"
              @change="handleImageChange">

            <p class="text-xs text-zinc-400 dark:text-zinc-500">
              Optional. Upload a JPG, PNG, or WEBP image up to 2 MB.
            </p>

            <p v-if="fieldError('image')" class="text-sm text-red-600">
              {{ fieldError('image') }}
            </p>
          </div>

          <div v-if="isEditMode" class="space-y-2 md:col-span-2">
            <BaseStatusSelect id="status" v-model="form.status" />
          </div>

          <div class="flex flex-col gap-2 pt-1 md:col-span-2 sm:flex-row sm:justify-end">
            <button type="button"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:w-auto sm:py-2.5"
              @click="emit('close')">
              <i class="pi pi-times text-xs" aria-hidden="true"></i>
              Cancel
            </button>
            <button type="submit"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:py-2.5"
              :disabled="loading">
              <i :class="loading ? 'pi pi-spin pi-spinner text-xs' : isEditMode ? 'pi pi-pencil text-xs' : 'pi pi-plus text-xs'"
                aria-hidden="true"></i>
              {{ loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import * as yup from 'yup'

import BaseInput from '../ui/BaseInput.vue'
import BaseStatusSelect from '../ui/BaseStatusSelect.vue'


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
  category: 'meetup',
  location: '',
  start_date: '',
  end_date: '',
  capacity: '',
  image: null,
  status: 'active',
})

const localErrors = ref({})
const imageInput = ref(null)
const imagePreview = ref('')
const isEditMode = computed(() => props.mode === 'edit')
const minimumStartDate = computed(() => {
  if (
    isEditMode.value &&
    props.initialEvent?.start_date
  ) {
    const originalDate = toDateTimeLocal(props.initialEvent.start_date)
    const now = toDateTimeLocal(new Date())

    return originalDate < now ? originalDate : now
  }

  return toDateTimeLocal(new Date())
})

const minimumEndDate = computed(() => form.start_date || minimumStartDate.value)

const categoryOptions = [
  { label: 'Conference', value: 'conference' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Meetup', value: 'meetup' },
  { label: 'Webinar', value: 'webinar' },
  { label: 'Hackathon', value: 'hackathon' },
  { label: 'Social', value: 'social' },
]

const validationSchema = yup.object({
  name: yup.string().trim().required('Event name is required'),

  category: yup.string().required('Category is required'),

  location: yup.string().trim().required('Location is required'),

start_date: yup
  .string()
  .required('Start date is required')
  .test(
    'valid-start-date',
    'Start date must be in the future',
    (value) => {
      if (!value) {
        return false
      }

      // In edit mode allow old past date
      if (isEditMode.value) {
        const originalStartDate = props.initialEvent?.start_date

        if (originalStartDate) {
          const originalTimestamp = new Date(originalStartDate).getTime()
          const currentTimestamp = new Date(value).getTime()

          if (originalTimestamp === currentTimestamp) {
            return true
          }

          if (originalTimestamp < Date.now()) {
            return true
          }
        }
      }

      return isFutureDateTime(value)
    },
  ),

  end_date: yup
    .string()
    .required('End date is required')
    .test(
      'is-after-start-date',
      'End date must be after the start date',
      (value) => {
        if (!value || !form.start_date) {
          return false
        }

        // Allow unchanged old end date in edit mode
        if (
          isEditMode.value &&
          props.initialEvent?.end_date &&
          toDateTimeLocal(props.initialEvent.end_date) === value
        ) {
          return true
        }

        return isAfterDateTime(value, form.start_date)
      },
    ),

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
  form.category = props.initialEvent?.category || 'meetup'
  form.location = props.initialEvent?.location || ''
  form.start_date = toDateTimeLocal(props.initialEvent?.start_date || '')
  form.end_date = toDateTimeLocal(props.initialEvent?.end_date || '')
  form.capacity = props.initialEvent?.capacity ?? 1
  form.image = null
  form.status = props.initialEvent?.status || 'active'
  setImagePreview(props.initialEvent?.image_url || '')

  if (imageInput.value) {
    imageInput.value.value = ''
  }

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
    category: form.category,
    location: form.location.trim(),
    start_date: form.start_date,
    end_date: form.end_date,
    capacity: Number(form.capacity),
    image: form.image,
    status: form.status,
  })
}

function handleImageChange(event) {
  const [file] = event.target.files || []
  form.image = file || null

  if (form.image) {
    setImagePreview(URL.createObjectURL(form.image))
    return
  }

  setImagePreview(props.initialEvent?.image_url || '')
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

  return formatMessage(Array.isArray(backendError) ? backendError[0] : backendError)
}

function formatMessage(message) {
  if (typeof message !== 'string' || !message.length) {
    return message
  }

  return message.charAt(0).toUpperCase() + message.slice(1)
}

function setImagePreview(value) {
  revokeImagePreview()
  imagePreview.value = value || ''
}

function revokeImagePreview() {
  if (imagePreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }
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

onBeforeUnmount(() => {
  revokeImagePreview()
})
</script>
