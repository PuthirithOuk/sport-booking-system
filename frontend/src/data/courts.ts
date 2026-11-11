import type { Court } from '@/types'

export const courts: Court[] = [
  { id: 1, sportId: 1, name: 'Badminton Court A', pricePerSlot: 10, isActive: true },
  { id: 2, sportId: 1, name: 'Badminton Court B', pricePerSlot: 10, isActive: true },
  { id: 3, sportId: 1, name: 'Badminton Court C', pricePerSlot: 12, isActive: true },
  { id: 4, sportId: 2, name: 'Tennis Court A', pricePerSlot: 15, isActive: true },
  { id: 5, sportId: 2, name: 'Tennis Court B', pricePerSlot: 15, isActive: true },
  { id: 6, sportId: 3, name: 'Basketball Court A', pricePerSlot: 12, isActive: true },
  { id: 7, sportId: 4, name: 'Football Field A', pricePerSlot: 25, isActive: true },
  { id: 8, sportId: 4, name: 'Football Field B', pricePerSlot: 25, isActive: false },
]