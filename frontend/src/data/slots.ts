import type { CourtSlot } from '@/types'
import { bookings } from './bookings'
import { phnomPenhToIso, courtSlotIdOf } from './ids'

const OPEN_HOUR = 8 // first slot starts 08:00
const CLOSE_HOUR = 22 // last slot ends 22:00, so 14 slots a day

// Days that have slots in the demo, and the courts that have them.
const days = ['2026-11-03', '2026-11-05', '2026-11-06']
const activeCourtIds = [1, 2, 3, 4, 5, 6, 7]

const bookedSlotIds = new Set(bookings.filter((b) => b.status === 'CONFIRMED').map((b) => b.courtSlotId))

function slotsForDay(courtId: number, date: string): CourtSlot[] {
  const result: CourtSlot[] = []
  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
    const id = courtSlotIdOf(courtId, date, hour)
    result.push({
      id,
      courtId,
      startAt: phnomPenhToIso(date, hour),
      endAt: phnomPenhToIso(date, hour + 1),
      status: bookedSlotIds.has(id) ? 'BOOKED' : 'AVAILABLE',
    })
  }
  return result
}

export const slots: CourtSlot[] = activeCourtIds.flatMap((courtId) =>
  days.flatMap((date) => slotsForDay(courtId, date)),
)