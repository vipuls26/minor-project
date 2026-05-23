import apiUrl from '@/api/axios'
import { notify } from '@/lib/notify'
import { defineStore } from 'pinia'


// check if message has valid string or not empty string
function formatMessage(message) {
  if (typeof message !== 'string' || message.length === 0) {
    return message
  }

  // capitalize first letter of message
  return message.charAt(0).toUpperCase() + message.slice(1)
}

// show notifcation message it formmatted text
function showMessage(type, message) {
  notify(type, formatMessage(message))
}

// show error message from api
function getErrorMessage(error) {
  return formatMessage(error.response?.data?.message || error.message || 'Something went wrong')
}

function getValidationErrors(error) {
  return error.response?.data?.errors || {}
}

function hasValidationErrors(errors) {
  return Boolean(errors && Object.keys(errors).length)
}

// form payload data
function buildEventPayload(formData) {
  const payload = new FormData()

  payload.append('name', formData.name)
  payload.append('category', formData.category)
  payload.append('location', formData.location)
  payload.append('start_date', formData.start_date)
  payload.append('end_date', formData.end_date)
  payload.append('capacity', String(formData.capacity))
  payload.append('status', formData.status || 'active')

  if (formData.image instanceof File) {
    payload.append('image', formData.image)
  }

  return payload
}

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    eventsData: [],
    activeEventList: [],
    loading: false,
    error: null,
  }),

  actions: {
    showMessage(type, message) {
      showMessage(type, message)
    },

    // fetch all event
    async fetchEvents() {
      this.loading = true
      this.error = null

      try {
        const response = await apiUrl.get('all')
        this.eventsData = response.data
      } catch (error) {
        this.error = getErrorMessage(error)
        showMessage('error', this.error)
      } finally {
        this.loading = false
      }
    },

    // fetch active events
    async fetchActiveEvents() {
      this.loading = true
      this.error = null

      try {
        const response = await apiUrl.get('active')
        this.activeEventList = response.data
      } catch (error) {
        this.error = getErrorMessage(error)
        showMessage('error', this.error)
      } finally {
        this.loading = false
      }
    },

    // create new event
    async createEvent(formData) {
      this.loading = true
      this.error = null

      try {
        const response = await apiUrl.post('add', buildEventPayload(formData))
        this.eventsData.unshift(response.data)
        showMessage('success', 'Event created successfully')

        return { ok: true, data: response.data }
      } catch (error) {
        this.error = getErrorMessage(error)
        const validationErrors = getValidationErrors(error)

        if (!hasValidationErrors(validationErrors)) {
          showMessage('error', this.error)
        }

        return {
          ok: false,
          message: this.error,
          errors: validationErrors,
        }
      } finally {
        this.loading = false
      }
    },

    // update existing event
    async updateEvent(id, formData) {
      this.loading = true
      this.error = null

      try {
        const response = await apiUrl.post(`edit/${id}`, buildEventPayload(formData))

        this.eventsData = this.eventsData.map((event) => {
          if (event.id === id) {
            return response.data
          }

          return event
        })

        showMessage('success', 'Event updated successfully')

        return { ok: true, data: response.data }
      } catch (error) {
        this.error = getErrorMessage(error)
        const validationErrors = getValidationErrors(error)

        if (!hasValidationErrors(validationErrors)) {
          showMessage('error', this.error)
        }

        return {
          ok: false,
          message: this.error,
          errors: validationErrors,
        }
      } finally {
        this.loading = false
      }
    },

    // delete event
    async deleteEvent(id) {
      this.loading = true
      this.error = null

      try {
        await apiUrl.delete(`delete/${id}`)
        this.eventsData = this.eventsData.filter((event) => event.id !== id)
        showMessage('success', 'Event deleted successfully')

        return { ok: true }
      } catch (error) {
        this.error = getErrorMessage(error)
        showMessage('error', this.error)

        return {
          ok: false,
          message: this.error,
        }
      } finally {
        this.loading = false
      }
    },

    // fetch interests for an event
    async fetchInterests(eventId) {
      try {
        const response = await apiUrl.get(`events/${eventId}/interests`)
        return { ok: true, data: response.data }
      } catch (error) {
        const message = getErrorMessage(error)
        showMessage('error', message)
        return { ok: false, message }
      }
    },

    async createInterest(eventId, formData) {
      try {
        const response = await apiUrl.post(`events/${eventId}/interests`, {
          name: formData.name,
          email: formData.email,
          mobile_no: formData.mobile_no,
        })

        showMessage('success', 'Attendee registered successfully')
        return { ok: true, data: response.data }
      } catch (error) {
        const message = getErrorMessage(error)
        showMessage('error', message)

        return {
          ok: false,
          message,
          errors: getValidationErrors(error),
        }
      }
    },

    fetchEvent() {
      return this.fetchEvents()
    },

    activeEvent() {
      return this.fetchActiveEvents()
    },
  },
})

export const eventStore = useEventStore
