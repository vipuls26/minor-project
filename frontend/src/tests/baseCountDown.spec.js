import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BaseCountDown from '@/components/baseui/baseCountDown.vue'

describe('BaseCountDown', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows that an event has ended after the end date passes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2099-08-20T20:00:00'))

    const wrapper = mount(BaseCountDown, {
      props: {
        targetDate: '2099-08-20T18:30:00',
        endDate: '2099-08-20T19:30:00',
      },
    })

    expect(wrapper.text()).toContain('Ended')
  })

  it('shows that an event has started between the start and end dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2099-08-20T19:00:00'))

    const wrapper = mount(BaseCountDown, {
      props: {
        targetDate: '2099-08-20T18:30:00',
        endDate: '2099-08-20T19:30:00',
      },
    })

    expect(wrapper.text()).toContain('Live now')
  })
})
