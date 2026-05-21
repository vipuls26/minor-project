import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import AttendeeModal from '@/components/attendee/AttendeeModal.vue'

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  showMessage: vi.fn(),
}))

vi.mock('@/api/axios', () => ({
  default: {
    get: mocks.get,
    post: mocks.post,
  },
}))

vi.mock('@/stores/eventStore', () => ({
  eventStore: () => ({
    activeEventList: [],
    eventsData: [],
    showMessage: mocks.showMessage,
  }),
}))

const baseEvent = {
  id: 21,
  name: 'Campus Hackathon',
  capacity: 25,
  interests_count: 2,
}

async function mountModal(props = {}) {
  const wrapper = mount(AttendeeModal, {
    props: {
      isOpen: false,
      event: baseEvent,
      ...props,
    },
    global: {
      stubs: {
        Teleport: true,
      },
    },
  })

  await wrapper.setProps({ isOpen: true })
  await nextTick()
  return wrapper
}

describe('AttendeeModal', () => {
  it('shows asterisks on required attendee field labels', async () => {
    mocks.get.mockResolvedValueOnce({ data: [] })

    const wrapper = await mountModal({
      canRegister: true,
      showTable: false,
    })

    expect(wrapper.find('label[for="attendee-name"]').text()).toContain('*')
    expect(wrapper.find('label[for="email"]').text()).toContain('*')
    expect(wrapper.find('label[for="attendee-mobile"]').text()).toContain('*')
  })

  it('shows attendee fetch errors inline when the table cannot load', async () => {
    mocks.get.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Unable to load attendees.',
        },
      },
    })

    const wrapper = await mountModal({
      canRegister: false,
      showTable: true,
    })

    await Promise.resolve()
    await nextTick()

    expect(wrapper.text()).toContain('Unable to load attendees.')
    expect(wrapper.get('[role="alert"]').text()).toContain('Unable to load attendees.')
  })

  it('renders attendee initials avatars in the attendee table', async () => {
    mocks.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'Aarav Singh',
          email: 'aarav@example.com',
          mobile_no: '9876543210',
        },
      ],
    })

    const wrapper = await mountModal({
      canRegister: false,
      showTable: true,
    })

    await Promise.resolve()
    await nextTick()

    expect(wrapper.text()).toContain('Aarav Singh')
    expect(wrapper.text()).toContain('AS')
  })
})
