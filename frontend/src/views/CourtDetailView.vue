<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import type { Court, CourtSlot } from '../types'

const props = defineProps<{
  courts: Court[]
  slots: CourtSlot[]
}>()

const emit = defineEmits<{
  book: [slotId: number]
}>()

const route = useRoute()
const courtId = computed(() => Number(route.params.id))

const court = computed(() => props.courts.find(c => c.id === courtId.value))
const courtSlots = computed(() => props.slots.filter(s => s.courtId === courtId.value))

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
</script>

<template>
  <div v-if="court">
    <h1>{{ court.name }}</h1>
    <p>Price: ${{ court.pricePerSlot }} / hour</p>

    <h3>Available Slots</h3>
    <div class="slot-grid">
      <button
        v-for="slot in courtSlots"
        :key="slot.id"
        :disabled="slot.status === 'BOOKED'"
        :class="{ booked: slot.status === 'BOOKED' }"
        @click="emit('book', slot.id)"
      >
        {{ formatTime(slot.startAt) }}
      </button>
    </div>
    <br>
    <RouterLink to="/">Back to Home</RouterLink>
  </div>
  
  <div v-else>
    <h2>Court not found</h2>
    <RouterLink to="/">Back to Home</RouterLink>
  </div>
</template>

<style scoped>
.slot-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
.slot-grid button { padding: 10px 20px; cursor: pointer; }
.slot-grid button.booked { background: #eee; color: #aaa; cursor: not-allowed; }
</style>