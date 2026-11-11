import { createRouter, createWebHistory } from 'vue-router'
import CourtsView from '../views/CourtsView.vue'
import CourtDetailView from '../views/CourtDetailView.vue'
import MyBookingsView from '../views/MyBookingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: CourtsView },
    { path: '/courts/:id', name: 'court-detail', component: CourtDetailView },
    { path: '/bookings', name: 'my-bookings', component: MyBookingsView },
  ],
})

export default router