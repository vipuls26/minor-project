<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8"
      @click.self="emit('close')">
      <div
        class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              {{ canRegister ? 'Register Interest' : 'Interested Users' }}
            </p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ event?.name }}</h2>
          </div>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
            @click="emit('close')">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- form -->
        <form v-if="canRegister" class="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800 sm:grid-cols-3"
          @submit.prevent="submitForm">
          <div
            v-if="generalError"
            class="sm:col-span-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200"
            role="alert"
            aria-live="polite"
          >
            {{ generalError }}
          </div>

          <div v-if="isEventFull" class="sm:col-span-3 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-950 dark:border-amber-700/70 dark:bg-amber-950/70 dark:text-amber-100">
            Full capacity reached. Registration is closed.
          </div>

          <div>
            <BaseInput label="Name" id="attendee-name" v-model="form.name" type="text" placeholder="Enter Name"
              :error="fieldError('name')" icon="pi-user" />
          </div>

          <div>
            <BaseInput label="Email" id="email" v-model="form.email" type="email" placeholder="Enter Email"
              :error="fieldError('email')" icon="pi-envelope" />
          </div>

          <div>
            <BaseInput label="Mobile No" id="attendee-mobile" v-model="form.mobile_no" type="tel" icon="pi-phone"
              placeholder="Enter Mobile Number" :error="fieldError('mobile_no')"
              @input="form.mobile_no = form.mobile_no.replace(/\D/g, '')" />
          </div>


          <div class="sm:col-span-3">
            <button type="submit"
              class="rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="loading || isEventFull">
              {{ loading ? 'Saving...' : isEventFull ? 'Fully Booked' : 'Register Attendee' }}
            </button>
          </div>
        </form>

        <!-- table of interested people -->
        <div v-if="showTable" class="mt-6">
          <div
            v-if="generalError && !canRegister"
            class="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200"
            role="alert"
            aria-live="polite"
          >
            {{ generalError }}
          </div>

          <div v-if="loadingList" class="py-6 text-center text-slate-500 dark:text-slate-400">
            <i class="pi pi-spin pi-spinner mr-2"></i>
          </div>

          <div v-else-if="attendees.length"
            class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-left text-sm text-slate-700 dark:text-slate-200">
              <thead class="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th class="px-4 py-3 font-semibold">Name</th>
                  <th class="px-4 py-3 font-semibold">Email</th>
                  <th class="px-4 py-3 font-semibold">Mobile No</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                <tr v-for="attendee in attendees" :key="attendee.id">
                  <td class="px-4 py-3">{{ attendee.name }}</td>
                  <td class="px-4 py-3">{{ attendee.email }}</td>
                  <td class="px-4 py-3">{{ attendee.mobile_no }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-else
            class="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No attendees registered yet.
          </p>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { eventStore } from '@/stores/eventStore'
import { computed, reactive, ref, watch } from 'vue'
import * as yup from 'yup'
import BaseInput from '../baseui/baseInput.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  event: { type: Object, default: null },
  canRegister: { type: Boolean, default: false },
  showTable: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])

const store = eventStore()
const attendees = ref([])
const generalError = ref('')
const fieldErrors = ref({})
const attendeeCount = ref(Number(props.event?.interests_count || 0))

const form = reactive({
  name: '',
  email: '',
  mobile_no: '',
})

const eventCapacity = computed(() => Number(props.event?.capacity || 0))
const isEventFull = computed(() => {
  return eventCapacity.value > 0 && attendeeCount.value >= eventCapacity.value
})
const loading = computed(() => store.requests.createInterest)
const loadingList = computed(() => store.requests.fetchInterests)

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(30, 'Name must not exceed 30 characters'),
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Email must be a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  mobile_no: yup
    .string()
    .trim()
    .required('Mobile number is required')
    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
})

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.event?.id) {
      resetForm()
      loadAttendees()
    }
  },
)

async function loadAttendees() {
  generalError.value = ''

  const result = await store.fetchInterests(props.event.id)

  if (result.ok) {
    attendees.value = result.data
    attendeeCount.value = result.data.length
    syncEventInterestCount(attendeeCount.value)
    return
  }

  generalError.value = result.message
  attendees.value = []
  attendeeCount.value = Number(props.event?.interests_count || 0)
}

async function submitForm() {
  const isValid = await validateForm()

  if (!isValid) {
    return
  }

  if (isEventFull.value) {
    generalError.value = 'Event capacity has been reached.'
    store.showMessage('error', generalError.value)
    return
  }

  const result = await store.createInterest(props.event.id, {
    name: form.name.trim(),
    email: form.email.trim(),
    mobile_no: form.mobile_no.trim(),
  })

  if (result.ok) {
    attendees.value.unshift(result.data)
    attendeeCount.value = attendees.value.length
    syncEventInterestCount(attendeeCount.value)
    resetForm()
    emit('close')
    return
  }

  generalError.value = result.message
  fieldErrors.value = result.errors || {}

  if (!fieldErrors.value.email && generalError.value === 'this email is already register in this event.') {
    fieldErrors.value = {
      ...fieldErrors.value,
      email: generalError.value,
    }
  }

  if (generalError.value === 'Event capacity has been reached.') {
    attendeeCount.value = eventCapacity.value
    syncEventInterestCount(attendeeCount.value)
  }
}

async function validateForm() {
  try {
    await validationSchema.validate(form, { abortEarly: false })
    fieldErrors.value = {}
    generalError.value = ''
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

    fieldErrors.value = errors
    generalError.value = ''
    return false
  }
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.mobile_no = ''
  generalError.value = ''
  fieldErrors.value = {}
  attendeeCount.value = Number(props.event?.interests_count || 0)
}

function syncEventInterestCount(count) {
  if (!props.event?.id) {
    return
  }

  store.syncInterestCount(props.event.id, count)
}

function fieldError(fieldName) {
  const error = fieldErrors.value[fieldName]
  return Array.isArray(error) ? error[0] : error
}
</script>
