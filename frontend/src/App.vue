<!-- frontend/src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { courts, sports, slots as initialSlots, bookings as initialBookings } from './data'
import type { CourtSlot, Booking } from './types'

// App.vue OWNS the mutable state (Part D pattern)
const allCourts = ref(courts)
const allSports = ref(sports)
const allSlots = ref<CourtSlot[]>([...initialSlots])
const allBookings = ref<Booking[]>([...initialBookings])

// The child view emits this when a slot is clicked
function onBookSlot(slotId: number) {
  const slot = allSlots.value.find(s => s.id === slotId)
  if (!slot || slot.status === 'BOOKED') return

  // 1. Mark slot as booked
  slot.status = 'BOOKED'

  // 2. Create a new booking (mock current user is id: 1)
  allBookings.value.push({
    id: Date.now(), // simple mock id
    userId: 1,
    courtSlotId: slotId,
    status: 'CONFIRMED',
    createAt: new Date().toISOString()
  })
}

function onCancelBooking(bookingId: number) {
  const booking = allBookings.value.find(b => b.id === bookingId)
  if (!booking) return

  // 1. Mark booking as cancelled
  booking.status = 'CANCELLED'

  // 2. Free up the slot
  const slot = allSlots.value.find(s => s.id === booking.courtSlotId)
  if (slot) slot.status = 'AVAILABLE'
}
</script>

<template>
  <div class="app-shell">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/bookings">My Bookings</RouterLink>
    </nav>
    
    <!-- Pass data and events down through RouterView -->
    <main>
      <RouterView 
        :courts="allCourts"
        :sports="allSports"
        :slots="allSlots"
        :bookings="allBookings"
        @book="onBookSlot"
        @cancel="onCancelBooking"
      />
    </main>
  </div>
</template>

<style>
/* Add minimal global CSS here for a clean look */
body { font-family: sans-serif; margin: 0; padding: 20px; }
nav { margin-bottom: 20px; display: flex; gap: 16px; }
nav a { text-decoration: none; color: blue; }
</style>