import apiUrl from '@/api/axios'
import { notify } from '@/lib/notify'
import { defineStore } from 'pinia'

export const eventStore = defineStore('eventStore', {
  state: () => ({
    eventsData: [],
    activeEventList: [],
    loading: false,
    error: null,
  }),

  actions: {
    showMessage(type, message) {
      notify(type, this.formatMessage(message))
    },

    formatMessage(message) {
      if (typeof message !== 'string' || !message.length) {
        return message
      }

      return message.charAt(0).toUpperCase() + message.slice(1)
    },

    eventPayload(formData) {
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

      if (formData.remove_image) {
        payload.append('remove_image', '1')
      }

      return payload
    },

    getErrorMessage(error) {
      return this.formatMessage(error.response?.data?.message || error.message || 'Something went wrong')
    },

    getValidationErrors(error) {
      return error.response?.data?.errors || {}
    },

    async fetchEvent() {
      this.loading = true
      this.error = null

      try {
        const response = await apiUrl.get('all')
        this.eventsData = response.data
      } catch (error) {
        this.error = this.getErrorMessage(error)
        this.showMessage('error', this.error)
      } finally {
        this.loading = false
      }
    },

    async activeEvent() {
      this.loading = true
      this.error = null

      try {
        const response = await apiUrl.get('active')
        this.activeEventList = response.data
      } catch (error) {
        this.error = this.getErrorMessage(error)
        this.showMessage('error', this.error)
      } finally {
        this.loading = false
      }
    },

    async createEvent(formData) {
      this.loading = true
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
        this.loading = false
      }
    },

    async updateEvent(id, formData) {
      this.loading = true
      this.error = null

      try {
        const response = await apiUrl.post(`edit/${id}`, this.eventPayload(formData))

        this.eventsData = this.eventsData.map((event) => {
          return event.id === id ? response.data : event
        })

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
        this.loading = false
      }
    },

    async deleteEvent(id) {
      this.loading = true
      this.error = null

      try {
        await apiUrl.delete(`delete/${id}`)
        this.eventsData = this.eventsData.filter((event) => event.id !== id)
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
        this.loading = false
      }
    },

    async fetchInterests(eventId) {
      try {
        const response = await apiUrl.get(`events/${eventId}/interests`)
        return { ok: true, data: response.data }
      } catch (error) {
        const message = this.getErrorMessage(error)
        this.showMessage('error', message)
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
      }
    },
  },
})
