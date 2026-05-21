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
          <div v-if="generalError"
            class="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200"
            role="alert" aria-live="polite">
            {{ generalError }}
          </div>

          <div class="space-y-2 md:col-span-2">
            <BaseInput id="name" label="Event Name" v-model="form.name" placeholder="Enter event name"
              icon="pi-calendar-plus" :error="fieldError('name')" />

          </div>

          <div class="space-y-2">
            <BaseStatusSelect id="category" label="Category" v-model="form.category" :options="categoryOptions" />
            <p v-if="fieldError('category')" class="mt-1 text-sm text-red-600">
              {{ fieldError('category') }}
            </p>
          </div>

          <div class="space-y-2">
            <BaseInput id="location" label="Location" v-model="form.location" type="text" placeholder="Enter location"
              :error="fieldError('location')" icon="pi-map-marker" />
          </div>

          <div class="space-y-2">
            <BaseInput id="start_date" label="Start Date" v-model="form.start_date" type="datetime-local"
              :min="minimumStartDate" :error="fieldError('start_date')" icon="pi-clock" />
          </div>

          <div class="space-y-2">
            <BaseInput id="end_date" label="End Date" v-model="form.end_date" type="datetime-local"
              :min="minimumEndDate" :error="fieldError('end_date')" icon="pi-clock" />
          </div>

          <div class="space-y-2">
            <BaseInput id="capacity" label="Total Capacity" v-model="form.capacity" type="number" min="1" step="1"
              :error="fieldError('capacity')" icon="pi-users" placeholder="capacity" />
          </div>

          <div class="space-y-3 md:col-span-2">
            <label for="image" class="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Event Image
            </label>

            <div v-if="imagePreview"
              class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
              <img :src="imagePreview" alt="Event preview" class="h-48 w-full object-cover">
            </div>

            <input id="image" ref="imageInput" type="file" accept="image/png,image/jpeg,image/webp"
              class="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:font-semibold file:text-sky-700 hover:file:bg-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:file:bg-sky-500/15 dark:file:text-sky-200"
              @change="handleImageChange">

            <p class="text-xs text-slate-500 dark:text-slate-400">
              Optional. Upload a JPG, PNG, or WEBP image up to 2 MB.
            </p>

            <label v-if="isEditMode && props.initialEvent?.image_url"
              class="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input v-model="form.remove_image" type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800">
              Remove current image
            </label>

            <p v-if="fieldError('image')" class="text-sm text-red-600">
              {{ fieldError('image') }}
            </p>
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
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
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
  category: 'meetup',
  location: '',
  start_date: '',
  end_date: '',
  capacity: '',
  image: null,
  remove_image: false,
  status: 'active',
})

const localErrors = ref({})
const imageInput = ref(null)
const imagePreview = ref('')
const isEditMode = computed(() => props.mode === 'edit')
const minimumStartDate = computed(() => toDateTimeLocal(new Date()))
const minimumEndDate = computed(() => form.start_date || minimumStartDate.value)
const generalError = computed(() => props.errors.general || '')
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
  form.category = props.initialEvent?.category || 'meetup'
  form.location = props.initialEvent?.location || ''
  form.start_date = toDateTimeLocal(props.initialEvent?.start_date || '')
  form.end_date = toDateTimeLocal(props.initialEvent?.end_date || '')
  form.capacity = props.initialEvent?.capacity || '1'
  form.image = null
  form.remove_image = false
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
    remove_image: form.remove_image,
    status: form.status,
  })
}

function handleImageChange(event) {
  const [file] = event.target.files || []
  form.image = file || null

  if (form.image) {
    form.remove_image = false
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

watch(
  () => form.remove_image,
  (shouldRemove) => {
    if (!shouldRemove) {
      if (!form.image) {
        setImagePreview(props.initialEvent?.image_url || '')
      }
      return
    }

    form.image = null

    if (imageInput.value) {
      imageInput.value.value = ''
    }

    setImagePreview('')
  },
)

onBeforeUnmount(() => {
  revokeImagePreview()
})
</script>
