import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import AttendeeModal from '@/components/attendee/AttendeeModal.vue'

const mocks = vi.hoisted(() => ({
  fetchInterests: vi.fn(),
  createInterest: vi.fn(),
  syncInterestCount: vi.fn(),
  showMessage: vi.fn(),
}))

vi.mock('@/stores/eventStore', () => ({
  eventStore: () => ({
    requests: {
      createInterest: false,
      fetchInterests: false,
    },
    fetchInterests: mocks.fetchInterests,
    createInterest: mocks.createInterest,
    syncInterestCount: mocks.syncInterestCount,
    showMessage: mocks.showMessage,
  }),
}))

const baseEvent = {
  id: 14,
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
  it('shows attendee fetch errors inline when the table cannot load', async () => {
    mocks.fetchInterests.mockResolvedValueOnce({
      ok: false,
      message: 'Unable to load attendees.',
    })

    const wrapper = await mountModal({
      canRegister: false,
      showTable: true,
    })

    expect(wrapper.text()).toContain('Unable to load attendees.')
    expect(wrapper.get('[role="alert"]').text()).toContain('Unable to load attendees.')
  })

  it('shows registration errors inline inside the attendee form', async () => {
    mocks.fetchInterests.mockResolvedValueOnce({
      ok: true,
      data: [],
    })
    mocks.createInterest.mockResolvedValueOnce({
      ok: false,
      message: 'This email is already registered for this event.',
      errors: {},
    })

    const wrapper = await mountModal({
      canRegister: true,
      showTable: false,
    })

    await wrapper.get('#attendee-name').setValue('Aarav Singh')
    await wrapper.get('#email').setValue('aarav@example.com')
    await wrapper.get('#attendee-mobile').setValue('9876543210')
    await wrapper.get('form').trigger('submit.prevent')
    await Promise.resolve()
    await nextTick()

    expect(wrapper.text()).toContain('This email is already registered for this event.')
    expect(wrapper.get('[role="alert"]').text()).toContain('This email is already registered for this event.')
  })
})
