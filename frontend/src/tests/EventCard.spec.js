import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import EventCard from '@/components/event/EventCard.vue'

const mocks = vi.hoisted(() => ({
  deleteEvent: vi.fn(),
  fire: vi.fn(),
}))

vi.mock('@/stores/eventStore', () => ({
  eventStore: () => ({
    requests: {
      deleteEvent: false,
    },
    deleteEvent: mocks.deleteEvent,
  }),
}))

vi.mock('@/stores/themeStore', () => ({
  useThemeStore: () => ({
    darkMode: false,
  }),
}))

vi.mock('sweetalert2', () => ({
  default: {
    fire: mocks.fire,
  },
}))

const baseEvent = {
  id: 7,
  name: 'Design Meetup',
  category: 'workshop',
  location: 'Mumbai',
  start_date: '2099-08-20T18:30:00',
  end_date: '2099-08-20T20:30:00',
  created_at: '2099-08-01T10:00:00',
  updated_at: '2099-08-05T12:00:00',
  interests_count: 7,
  capacity: 20,
}

function mountCard(props = {}) {
  return mount(EventCard, {
    props: {
      event: baseEvent,
      ...props,
    },
    global: {
      stubs: {
        BaseCard: {
          template: '<div><slot /></div>',
        },
        BaseCountDown: true,
      },
    },
  })
}

describe('EventCard', () => {
  beforeEach(() => {
    mocks.deleteEvent.mockReset()
    mocks.fire.mockReset()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2099-08-20T17:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('deletes the event after confirmation', async () => {
    mocks.fire.mockResolvedValue({ isConfirmed: true })
    const wrapper = mountCard()

    await wrapper.get('button[title="Manage attendees"] + button + button').trigger('click')

    expect(mocks.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete event?',
        text: 'Are you sure you want to delete "Design Meetup"?',
      }),
    )
    expect(mocks.deleteEvent).toHaveBeenCalledWith(7)
  })

  it('does not delete the event when confirmation is cancelled', async () => {
    mocks.fire.mockResolvedValue({ isConfirmed: false })
    const wrapper = mountCard()

    await wrapper.get('button[title="Manage attendees"] + button + button').trigger('click')

    expect(mocks.deleteEvent).not.toHaveBeenCalled()
  })

  it('renders the category badge and seats left summary', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Workshop')
    expect(wrapper.text()).toContain('Seats Left')
    expect(wrapper.text()).toContain('13 left')
    expect(wrapper.text()).toContain('7 / 20')
  })

  it('disables interest registration once the event has started', async () => {
    const wrapper = mountCard({
      showInterestButton: true,
      showActions: false,
    })

    const interestButton = wrapper.get('button[type="button"]')

    expect(interestButton.text()).toContain('Add Interest')
    expect(interestButton.attributes('disabled')).toBeUndefined()

    await interestButton.trigger('click')
    expect(wrapper.emitted('attendees')).toHaveLength(1)

    await wrapper.setProps({
      event: {
        ...baseEvent,
        start_date: '2099-08-20T16:30:00',
        end_date: '2099-08-20T18:30:00',
      },
    })

    expect(interestButton.text()).toContain('Event Started')
    expect(interestButton.attributes()).toHaveProperty('disabled')

    await interestButton.trigger('click')
    expect(wrapper.emitted('attendees')).toHaveLength(1)
  })

  it('disables interest registration as soon as the timer reaches zero', async () => {
    const wrapper = mountCard({
      showInterestButton: true,
      showActions: false,
      showTimer: true,
      event: {
        ...baseEvent,
        start_date: '2099-08-20T17:00:01',
        end_date: '2099-08-20T18:30:00',
      },
    })

    const interestButton = wrapper.get('button[type="button"]')

    expect(interestButton.text()).toContain('Add Interest')
    expect(interestButton.attributes('disabled')).toBeUndefined()

    vi.advanceTimersByTime(1000)
    await nextTick()

    expect(interestButton.text()).toContain('Event Started')
    expect(interestButton.attributes()).toHaveProperty('disabled')
  })

  it('keeps interest registration disabled after the event has ended', () => {
    const wrapper = mountCard({
      showInterestButton: true,
      showActions: false,
      event: {
        ...baseEvent,
        start_date: '2099-08-20T14:00:00',
        end_date: '2099-08-20T16:00:00',
      },
    })

    const interestButton = wrapper.get('button[type="button"]')

    expect(interestButton.text()).toContain('Event Ended')
    expect(interestButton.attributes()).toHaveProperty('disabled')
  })
})
