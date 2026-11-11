import type { Booking } from '@/types'
import { courtSlotIdOf } from './ids'

// Demo "now" is Thu 5 Nov 2026, 09:00. User 1 (Puthirith) is the logged-in customer.
export const bookings: Booking[] = [
  // Starts in 1 hour: shows "Cannot cancel within 2 hours".
  {
    id: 1,
    userId: 1,
    courtSlotId: courtSlotIdOf(1, '2026-11-05', 10),
    status: 'CONFIRMED',
    createAt: '2026-11-04T10:00:00Z',
  },
  // Later today: can be cancelled.
  {
    id: 2,
    userId: 1,
    courtSlotId: courtSlotIdOf(4, '2026-11-05', 18),
    status: 'CONFIRMED',
    createAt: '2026-11-04T11:30:00Z',
  },
  // Tomorrow.
  {
    id: 3,
    userId: 1,
    courtSlotId: courtSlotIdOf(1, '2026-11-06', 12),
    status: 'CONFIRMED',
    createAt: '2026-11-04T12:00:00Z',
  },
  // Already played (Past tab).
  {
    id: 4,
    userId: 1,
    courtSlotId: courtSlotIdOf(1, '2026-11-03', 12),
    status: 'CONFIRMED',
    createAt: '2026-11-01T08:00:00Z',
  },
  // Cancelled: the slot is free again (Past tab).
  {
    id: 5,
    userId: 1,
    courtSlotId: courtSlotIdOf(2, '2026-11-06', 9),
    status: 'CANCELLED',
    createAt: '2026-11-02T09:00:00Z',
  },
  // Other customers, for the staff screens.
  {
    id: 6,
    userId: 4,
    courtSlotId: courtSlotIdOf(1, '2026-11-05', 12),
    status: 'CONFIRMED',
    createAt: '2026-11-04T13:00:00Z',
  },
  {
    id: 7,
    userId: 2,
    courtSlotId: courtSlotIdOf(2, '2026-11-05', 13),
    status: 'CONFIRMED',
    createAt: '2026-11-04T14:00:00Z',
  },
  {
    id: 8,
    userId: 3,
    courtSlotId: courtSlotIdOf(3, '2026-11-05', 14),
    status: 'CANCELLED',
    createAt: '2026-11-04T15:00:00Z',
  },
]