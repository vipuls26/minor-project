import apiUrl from '@/api/axios'
import { notify } from '@/lib/notify'
import { defineStore } from 'pinia'

function createRequestState() {
  return {
    fetchEvents: false,
    fetchActiveEvents: false,
    createEvent: false,
    updateEvent: false,
    deleteEvent: false,
    fetchInterests: false,
    createInterest: false,
  }
}

export const eventStore = defineStore('eventStore', {
  state: () => ({
    eventsData: [],
    activeEventList: [],
    error: null,
    requests: createRequestState(),
  }),

  getters: {
    loading(state) {
      return Object.values(state.requests).some(Boolean)
    },
  },

  actions: {
    setRequestState(requestName, value) {
      this.requests[requestName] = value
    },

    showMessage(type, message) {
      notify(type, message)
    },

    eventPayload(formData) {
      return {
        name: formData.name,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        capacity: formData.capacity,
        status: formData.status || 'active',
      }
    },

    getErrorMessage(error) {
      return error.userMessage || error.response?.data?.message || error.message || 'Something went wrong'
    },

    getValidationErrors(error) {
      return error.response?.data?.errors || {}
    },

    syncEventRecord(updatedEvent) {
      this.eventsData = this.eventsData.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
      this.activeEventList = this.activeEventList.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    },

    syncInterestCount(eventId, count) {
      const updateCount = (event) => {
        if (event.id === eventId) {
          event.interests_count = count
        }
      }

      this.activeEventList.forEach(updateCount)
      this.eventsData.forEach(updateCount)
    },

    async fetchEvent() {
      this.setRequestState('fetchEvents', true)
      this.error = null

      try {
        const response = await apiUrl.get('all')
        this.eventsData = response.data
      } catch (error) {
        this.error = this.getErrorMessage(error)
        this.showMessage('error', this.error)
      } finally {
        this.setRequestState('fetchEvents', false)
      }
    },

    async activeEvent() {
      this.setRequestState('fetchActiveEvents', true)
      this.error = null

      try {
        const response = await apiUrl.get('active')
        this.activeEventList = response.data
      } catch (error) {
        this.error = this.getErrorMessage(error)
        this.showMessage('error', this.error)
      } finally {
        this.setRequestState('fetchActiveEvents', false)
      }
    },

    async createEvent(formData) {
      this.setRequestState('createEvent', true)
      this.error = null

      try {
        const response = await apiUrl.post('add', this.eventPayload(formData))
        this.eventsData.unshift(response.data)
        this.showMessage('success', 'Event created successfully')

        return { ok: true, data: response.data }
      } catch (error) {
        this.error = this.getErrorMessage(error)
        this.showMessage('error', this.error)

        return {
          ok: false,
          message: this.error,
          errors: this.getValidationErrors(error),
        }
      } finally {
        this.setRequestState('createEvent', false)
      }
    },

    async updateEvent(id, formData) {
      this.setRequestState('updateEvent', true)
      this.error = null

      try {
        const response = await apiUrl.post(`edit/${id}`, this.eventPayload(formData))
        this.syncEventRecord(response.data)
        this.showMessage('success', 'Event updated successfully')

        return { ok: true, data: response.data }
      } catch (error) {
        this.error = this.getErrorMessage(error)
        this.showMessage('error', this.error)

        return {
          ok: false,
          message: this.error,
          errors: this.getValidationErrors(error),
        }
      } finally {
        this.setRequestState('updateEvent', false)
      }
    },

    async deleteEvent(id) {
      this.setRequestState('deleteEvent', true)
      this.error = null

      try {
        await apiUrl.delete(`delete/${id}`)
        this.eventsData = this.eventsData.filter((event) => event.id !== id)
        this.activeEventList = this.activeEventList.filter((event) => event.id !== id)
        this.showMessage('success', 'Event deleted successfully')

        return { ok: true }
      } catch (error) {
        this.error = this.getErrorMessage(error)
        this.showMessage('error', this.error)

        return {
          ok: false,
          message: this.error,
        }
      } finally {
        this.setRequestState('deleteEvent', false)
      }
    },

    async fetchInterests(eventId) {
      this.setRequestState('fetchInterests', true)

      try {
        const response = await apiUrl.get(`events/${eventId}/interests`)
        this.syncInterestCount(eventId, response.data.length)

        return { ok: true, data: response.data }
      } catch (error) {
        const message = this.getErrorMessage(error)
        this.showMessage('error', message)

        return { ok: false, message }
      } finally {
        this.setRequestState('fetchInterests', false)
      }
    },

    async createInterest(eventId, formData) {
      this.setRequestState('createInterest', true)

      try {
        const response = await apiUrl.post(`events/${eventId}/interests`, {
          name: formData.name,
          email: formData.email,
          mobile_no: formData.mobile_no,
        })

        this.showMessage('success', 'Attendee registered successfully')
        return { ok: true, data: response.data }
      } catch (error) {
        const message = this.getErrorMessage(error)
        this.showMessage('error', message)

        return {
          ok: false,
          message,
          errors: this.getValidationErrors(error),
        }
      } finally {
        this.setRequestState('createInterest', false)
      }
    },
  },
})
