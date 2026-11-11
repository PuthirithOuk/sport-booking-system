import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Court, Sport } from '../types'
import { catalogApi } from '../api/catalog'

export const useCatalogStore = defineStore('catalog', () => {
  // State
  const sports = ref<Sport[]>([])
  const courts = ref<Court[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      // Fetch both at the same time for speed
      const [sportsData, courtsData] = await Promise.all([
        catalogApi.getSports(),
        catalogApi.getCourts()
      ])
      sports.value = sportsData
      courts.value = courtsData
    } catch (e) {
      error.value = 'Failed to load courts. Please check your connection.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return { sports, courts, loading, error, fetchAll }
})