<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useCatalogStore } from '../stores/catalog'

const store = useCatalogStore()
// storeToRefs keeps reactivity when destructuring
const { sports, courts, loading, error } = storeToRefs(store)

const selectedSportId = ref<number | null>(null)

const visibleCourts = computed(() => {
  const activeCourts = courts.value.filter(c => c.isActive)
  if (!selectedSportId.value) return activeCourts
  return activeCourts.filter(c => c.sportId === selectedSportId.value)
})

onMounted(() => {
  store.fetchAll()
})
</script>

<template>
  <div>
    <h1>Book a Court</h1>

    <!-- Loading State -->
    <p v-if="loading">Loading courts...</p>

    <!-- Error State -->
    <div v-else-if="error">
      <p style="color: red">{{ error }}</p>
      <button @click="store.fetchAll()">Try again</button>
    </div>

    <!-- Success State -->
    <div v-else>
      <div class="tabs">
        <button @click="selectedSportId = null" :class="{ active: !selectedSportId }">All</button>
        <button 
          v-for="sport in sports" 
          :key="sport.id" 
          @click="selectedSportId = sport.id"
          :class="{ active: selectedSportId === sport.id }"
        >
          {{ sport.name }}
        </button>
      </div>

      <div class="court-list">
        <div v-for="court in visibleCourts" :key="court.id" class="court-card">
          <h3>{{ court.name }}</h3>
          <p>${{ court.pricePerSlot }} / hour</p>
          <RouterLink :to="`/courts/${court.id}`">View Slots</RouterLink>
        </div>
      </div>

      <!-- Empty State -->
      <p v-if="visibleCourts.length === 0">No courts found for this sport.</p>
    </div>
  </div>
</template>

<style scoped>
.tabs { margin-bottom: 20px; display: flex; gap: 8px; }
.tabs button { padding: 8px 16px; cursor: pointer; }
.tabs button.active { background: black; color: white; }
.court-list { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.court-card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; }
</style>