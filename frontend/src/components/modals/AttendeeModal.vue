<template>
  <Teleport to="body">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 px-3 py-6 sm:px-4 sm:py-8"
      @click.self="emit('close')">
      <div
        class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-zinc-50 p-3 shadow-2xl dark:bg-zinc-900 sm:p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-500">
              {{ canRegister ? 'Register Interest' : 'Interested Users' }}
            </p>
            <h2 class="mt-2 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">{{ event?.name }}</h2>
          </div>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:text-zinc-100"
            @click="emit('close')">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- form -->
        <form v-if="canRegister" class="mt-5 grid gap-4 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900 sm:grid-cols-3"
          @submit.prevent="submitForm">

          <div v-if="isEventFull"
            class="sm:col-span-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
            Registration is closed because this event has reached its capacity.
          </div>

          <div>
            <BaseInput label="Name" required id="attendee-name" v-model="form.name" type="text" placeholder="Enter Name"
              :error="fieldError('name')" icon="pi-user" />
          </div>

          <div>
            <BaseInput label="Email" required id="email" v-model="form.email" type="email" placeholder="Enter Email"
              :error="fieldError('email')" icon="pi-envelope" />
          </div>

          <div>
            <BaseInput label="Mobile No" required id="attendee-mobile" v-model="form.mobile_no" type="tel"
              icon="pi-phone" placeholder="Enter Mobile Number" :error="fieldError('mobile_no')"
              @input="form.mobile_no = form.mobile_no.replace(/\D/g, '')" />
          </div>


          <div class="sm:col-span-3">
            <button type="submit"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-70 sm:py-2.5"
              :disabled="loading || isEventFull">
              <i :class="loading ? 'pi pi-spin pi-spinner text-xs' : isEventFull ? 'pi pi-lock text-xs' : 'pi pi-user-plus text-xs'"
                aria-hidden="true"></i>
              {{ loading ? 'Saving...' : isEventFull ? 'Capacity Reached' : 'Register Attendee' }}
            </button>
          </div>
        </form>

        <!-- table of interested people -->
        <div v-if="showTable" class="mt-6">
          <div v-if="generalError && !canRegister"
            class="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200"
            role="alert" aria-live="polite">
            {{ generalError }}
          </div>

          <div v-if="loadingList" class="py-6 text-center text-zinc-500 dark:text-zinc-400">
            <i class="pi pi-spin pi-spinner mr-2"></i>
          </div>

          <div v-else-if="attendees.length"
            class="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table class="w-full text-left text-sm text-zinc-900 dark:text-zinc-100">
              <thead class="bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                <tr>
                  <th class="px-4 py-3 font-semibold">Name</th>
                  <th class="px-4 py-3 font-semibold">Email</th>
                  <th class="px-4 py-3 font-semibold">Mobile No</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr v-for="attendee in attendees" :key="attendee.id">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div>
                        <p class="font-semibold text-zinc-900 dark:text-zinc-100">{{ attendee.name }}</p>

                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">{{ attendee.email }}</td>
                  <td class="px-4 py-3">{{ attendee.mobile_no }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-else
            class="rounded-2xl border border-dashed border-zinc-200 px-4 py-8 text-center text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            No attendees registered yet.
          </p>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import apiUrl from '@/api/axios'
import { eventStore } from '@/stores/useEventStore'
import { computed, reactive, ref, watch } from 'vue'
import * as yup from 'yup'
import BaseInput from '../ui/BaseInput.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  event: { type: Object, default: null },
  canRegister: { type: Boolean, default: false },
  showTable: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])

const store = eventStore()
const attendees = ref([])
const loading = ref(false)
const loadingList = ref(false)
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
  loadingList.value = true
  generalError.value = ''

  try {
    const response = await apiUrl.get(`events/${props.event.id}/interests`)
    attendees.value = response.data
    attendeeCount.value = response.data.length
    syncEventInterestCount(attendeeCount.value)
  } catch (error) {
    generalError.value = getErrorMessage(error)
    attendees.value = []
    attendeeCount.value = Number(props.event?.interests_count || 0)
    store.showMessage('error', generalError.value)
  } finally {
    loadingList.value = false
  }
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

  loading.value = true

  try {
    const response = await apiUrl.post(`events/${props.event.id}/interests`, {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile_no: form.mobile_no.trim(),
    })

    attendees.value.unshift(response.data)
    attendeeCount.value = attendees.value.length
    syncEventInterestCount(attendeeCount.value)
    resetForm()
    store.showMessage('success', 'Registration completed successfully')
    emit('close')


  } catch (error) {
    generalError.value = getErrorMessage(error)
    fieldErrors.value = error.response?.data?.errors || {}

    if (!fieldErrors.value.email && generalError.value === 'This email is already registered for this event.') {
      fieldErrors.value = {
        ...fieldErrors.value,
        email: generalError.value,
      }
    }

    if (generalError.value === 'Event capacity has been reached.') {
      attendeeCount.value = eventCapacity.value
      syncEventInterestCount(attendeeCount.value)
    }

    if (shouldShowToastError()) {
      store.showMessage('error', generalError.value)
    }
  }

  loading.value = false
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

  const updateCount = (event) => {
    if (event.id === props.event.id) {
      event.interests_count = count
    }
  }

  store.activeEventList.forEach(updateCount)
  store.eventsData.forEach(updateCount)
}

function fieldError(fieldName) {
  const error = fieldErrors.value[fieldName]
  return formatMessage(Array.isArray(error) ? error[0] : error)
}

function shouldShowToastError() {
  return showGeneralError.value
}

function getErrorMessage(error) {
  return formatMessage(error.response?.data?.message || error.message || 'Something went wrong')
}

function formatMessage(message) {
  if (typeof message !== 'string' || !message.length) {
    return message
  }

  return message.charAt(0).toUpperCase() + message.slice(1)
}

function attendeeInitials(name) {
  if (!name) {
    return 'NA'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}
</script>
