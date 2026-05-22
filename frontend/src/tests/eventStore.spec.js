import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const mockPost = vi.fn()
const notifySpy = vi.fn()

vi.mock('@/api/axios', () => ({
  default: {
    post: mockPost,
  },
}))

vi.mock('@/lib/notify', () => ({
  notify: notifySpy,
}))

describe('eventStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('does not show a toast for backend validation errors during event updates', async () => {
    mockPost.mockRejectedValueOnce({
      response: {
        data: {
          message: 'capacity cannot be less than the total registered users.',
          errors: {
            capacity: ['capacity cannot be less than the total registered users.'],
          },
        },
      },
      message: 'Request failed with status code 422',
    })

    const { eventStore } = await import('@/stores/useEventStore')
    const store = eventStore()

    const result = await store.updateEvent(7, {
      name: 'Demo Event',
      category: 'meetup',
      location: 'Anand',
      start_date: '2099-05-22T17:32',
      end_date: '2099-05-24T17:32',
      capacity: 1,
      image: null,
      remove_image: false,
      status: 'active',
    })

    expect(result).toEqual({
      ok: false,
      message: 'Capacity cannot be less than the total registered users.',
      errors: {
        capacity: ['capacity cannot be less than the total registered users.'],
      },
    })
    expect(notifySpy).not.toHaveBeenCalled()
  })

  it('still shows a toast for non-validation update failures', async () => {
    mockPost.mockRejectedValueOnce({
      response: {
        data: {
          message: 'server unavailable',
        },
      },
      message: 'Request failed with status code 500',
    })

    const { eventStore } = await import('@/stores/useEventStore')
    const store = eventStore()

    await store.updateEvent(7, {
      name: 'Demo Event',
      category: 'meetup',
      location: 'Anand',
      start_date: '2099-05-22T17:32',
      end_date: '2099-05-24T17:32',
      capacity: 10,
      image: null,
      remove_image: false,
      status: 'active',
    })

    expect(notifySpy).toHaveBeenCalledWith('error', 'Server unavailable')
  })
})
