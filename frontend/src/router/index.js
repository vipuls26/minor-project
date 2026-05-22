import CalendarView from '@/components/calendar/CalendarView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomeView.vue'),
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('../components/event/EventView.vue'),
  },
  {
    path: '/upcoming-events',
    name: 'activeEvents',
    component: () => import('../components/event/ActiveEventView.vue'),
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
