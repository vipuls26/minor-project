import CalendarView from '@/components/common/CalendarView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/HomeView.vue'),
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('../components/event/EventView.vue'),
  },
  {
    path: '/upcoming-events',
    name: 'activeEvents',
    component: () => import('../components/attendee/ActiveEventView.vue'),
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
