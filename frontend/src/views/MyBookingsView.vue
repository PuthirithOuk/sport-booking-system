<script setup lang="ts">
import { computed } from 'vue'
import type { Booking, CourtSlot } from '../types'
import { NOW } from '../data'

const props = defineProps<{
  bookings: Booking[]
  slots: CourtSlot[]
}>()

const emit = defineEmits<{
  cancel: [bookingId: number]
}>()

const myBookings = computed(() => props.bookings.filter(b => b.userId === 1))

function getSlot(slotId: number) {
  return props.slots.find(s => s.id === slotId)
}

function canCancel(slotId: number) {
  const slot = getSlot(slotId)
  if (!slot) return false
  
  const startTime = new Date(slot.startAt).getTime()
  const nowTime = new Date(NOW).getTime()
  const twoHoursInMs = 2 * 60 * 60 * 1000
  
  return (startTime - nowTime) > twoHoursInMs
}
</script>

<template>
  <div>
    <h1>My Bookings</h1>

    <div v-if="myBookings.length === 0">
      <p>You have no bookings yet.</p>
    </div>

    <div v-else class="booking-list">
      <div v-for="booking in myBookings" :key="booking.id" class="booking-card">
        <div>
          <strong>Slot ID:</strong> {{ booking.courtSlotId }} <br>
          <strong>Status:</strong> {{ booking.status }} <br>
          <strong>Start:</strong> {{ getSlot(booking.courtSlotId)?.startAt }}
        </div>
        
        <div>
          <button 
            v-if="booking.status === 'CONFIRMED' && canCancel(booking.courtSlotId)"
            @click="emit('cancel', booking.id)"
          >
            Cancel Booking
          </button>
          
          <p v-if="booking.status === 'CONFIRMED' && !canCancel(booking.courtSlotId)" class="warn">
            Cannot cancel within 2 hours
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-list { display: flex; flex-direction: column; gap: 16px; }
.booking-card { border: 1px solid #ccc; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
.warn { color: red; font-size: 0.9em; }
</style>