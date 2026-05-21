import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import FormAdd from '@/components/common/FormAdd.vue'

function getFutureDateTimeLocal() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function getLaterFutureDateTimeLocal() {
  const date = new Date(Date.now() + 48 * 60 * 60 * 1000)
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

async function mountForm(props = {}) {
  const wrapper = mount(FormAdd, {
    props: {
      isOpen: false,
      errors: {},
      ...props,
    },
    global: {
      stubs: {
        Teleport: true,
      },
    },
  })

  await wrapper.setProps({ isOpen: true })
  return wrapper
}

describe('FormAdd', () => {
  it('shows asterisks on required field labels', async () => {
    const wrapper = await mountForm()

    expect(wrapper.find('label[for="name"]').text()).toContain('*')
    expect(wrapper.find('label[for="category"]').text()).toContain('*')
    expect(wrapper.find('label[for="location"]').text()).toContain('*')
    expect(wrapper.find('label[for="start_date"]').text()).toContain('*')
    expect(wrapper.find('label[for="end_date"]').text()).toContain('*')
    expect(wrapper.find('label[for="capacity"]').text()).toContain('*')
    expect(wrapper.find('label[for="image"]').text()).not.toContain('*')
  })

  it('shows validation errors and prevents submit when required fields are empty', async () => {
    const wrapper = await mountForm()

    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Event name is required')
    expect(wrapper.text()).toContain('Location is required')
    expect(wrapper.text()).toContain('Start date is required')
    expect(wrapper.text()).toContain('End date is required')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('emits a trimmed payload when the form is valid', async () => {
    const wrapper = await mountForm()

    await wrapper.get('#name').setValue('  Launch Party  ')
    await wrapper.get('#location').setValue('  Main Hall  ')
    await wrapper.get('#start_date').setValue(getFutureDateTimeLocal())
    await wrapper.get('#end_date').setValue(getLaterFutureDateTimeLocal())
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      name: 'Launch Party',
      category: 'meetup',
      location: 'Main Hall',
      start_date: expect.any(String),
      end_date: expect.any(String),
      capacity: 1,
      image: null,
      remove_image: false,
      status: 'active',
    })
  })

  it('prefills existing values in edit mode and emits the updated status', async () => {
    const wrapper = await mountForm({
      mode: 'edit',
      initialEvent: {
        name: 'Summit',
        category: 'webinar',
        location: 'Delhi',
        start_date: '2099-06-01 10:30:00',
        end_date: '2099-06-01 12:30:00',
        image_url: 'http://127.0.0.1:8000/storage/events/summit.jpg',
        status: 'inactive',
      },
    })

    expect(wrapper.get('#name').element.value).toBe('Summit')
    expect(wrapper.get('#category').element.value).toBe('webinar')
    expect(wrapper.get('#location').element.value).toBe('Delhi')
    expect(wrapper.get('#start_date').element.value).toBe('2099-06-01T10:30')
    expect(wrapper.get('#end_date').element.value).toBe('2099-06-01T12:30')
    expect(wrapper.get('#status').element.value).toBe('inactive')
    expect(wrapper.get('img[alt="Event preview"]').attributes('src')).toBe(
      'http://127.0.0.1:8000/storage/events/summit.jpg',
    )

    await wrapper.get('#category').setValue('conference')
    await wrapper.get('#status').setValue('active')
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('submit')[0][0]).toMatchObject({
      name: 'Summit',
      category: 'conference',
      location: 'Delhi',
      start_date: '2099-06-01T10:30',
      end_date: '2099-06-01T12:30',
      capacity: 1,
      image: null,
      remove_image: false,
      status: 'active',
    })
  })

  it('allows removing the current image in edit mode', async () => {
    const wrapper = await mountForm({
      mode: 'edit',
      initialEvent: {
        name: 'Summit',
        category: 'webinar',
        location: 'Delhi',
        start_date: '2099-06-01 10:30:00',
        end_date: '2099-06-01 12:30:00',
        image_url: 'http://127.0.0.1:8000/storage/events/summit.jpg',
        status: 'active',
      },
    })

    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({
      image: null,
      remove_image: true,
    })
    expect(wrapper.find('img[alt="Event preview"]').exists()).toBe(false)
  })

  it('prefers local validation errors over backend field errors', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-18T10:00:00Z'))

    const wrapper = await mountForm({
      errors: {
        fields: {
          start_date: ['Backend start date error'],
        },
      },
    })

    await wrapper.get('#name').setValue('Demo Event')
    await wrapper.get('#location').setValue('Jaipur')
    await wrapper.get('#start_date').setValue('2026-05-18T09:00')
    await wrapper.get('#end_date').setValue('2026-05-18T11:00')
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Start date must be in the future')
    expect(wrapper.text()).not.toContain('Backend start date error')

    vi.useRealTimers()
  })

  it('renders backend general errors inline inside the modal', async () => {
    const wrapper = await mountForm({
      errors: {
        general: 'Unable to save event right now.',
      },
    })

    expect(wrapper.text()).toContain('Unable to save event right now.')
    expect(wrapper.get('[role="alert"]').text()).toContain('Unable to save event right now.')
  })
})
