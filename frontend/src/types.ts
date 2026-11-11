// All of the 5 entities
//#1 User
export type Role = 'CUSTOMER' | 'STAFF'

export interface User {
    id: number
    name: string
    email: string
    role: Role
}
//#2 Sport
export interface Sport {
    id: number
    name: string
    description: string;
}
//#3 Court
export interface Court {
    id: number
    sportId: number
    name: string
    pricePerSlot: number
    isActive: boolean
}
//#4 CourtSlot
export type SlotStatus = 'AVAILABLE' | 'BOOKED'

export interface CourtSlot {
    id: number 
    courtId: number
    startAt: string
    endAt: string 
    status: SlotStatus
}
//#5 Booking
export type BookingStatus = 'CONFIRMED' | 'CANCELLED'

export interface Booking {
    id: number 
    userId: number 
    courtSlotId: number
    status: BookingStatus
    createAt: string
}

