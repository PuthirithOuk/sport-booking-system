// Slot ids are predictable so bookings and slots can refer to each other in hard-coded data.
// Example: court 1, 2026-11-05, 10:00 -> 1_110_510 (courtId, MMDD, hour).
export function courtSlotIdOf(courtId: number, date: string, hour: number): number {
  const mmdd = Number(date.slice(5, 7) + date.slice(8, 10))
  return courtId * 1_000_000 + mmdd * 100 + hour
}

// An opening-hour boundary in Phnom Penh time (UTC+7) as a UTC ISO string.
export function phnomPenhToIso(date: string, hour: number): string {
  const hh = String(hour).padStart(2, '0')
  return new Date(`${date}T${hh}:00:00+07:00`).toISOString()
}