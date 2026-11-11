# Multi-Sport Facility Booking System

## Problem

Sports facilities that take bookings by phone or chat suffer double bookings and wasted staff time, and customers cannot see which courts are free. This system shows live availability and confirms a one-hour booking in one step, so customers book faster and the operator manages everything in one place.

## Users and roles

- Customer: registers, logs in, filters courts by sport and date, books an available one-hour slot, and views and cancels their own bookings.
- Staff (the single facility operator, created by the seed script): manages sports, courts and prices, generates slots, and views and cancels any booking.

## User stories

1. As a customer, I want to register and log in so that I can make and manage my own bookings.
   Accepted when: registration needs a unique email and a password of at least 8 characters; the password is stored only as a hash; registration always creates a CUSTOMER, even if the request contains a role.

2. As a customer, I want to filter courts by sport and date so that I can quickly find a court with free times.
   Accepted when: there is one tab per sport, built from the database; only courts with a free future slot on the chosen date are shown; the API pages the list (`page`, `limit`) and returns `data`, `page`, `limit` and `total`.

3. As a customer, I want to book an available one-hour slot so that I get a confirmed court without waiting for approval.
   Accepted when: a past slot returns 400; an already booked slot returns 409; if two customers book the same slot at the same moment, exactly one succeeds and the other gets 409, never 500.

4. As a customer, I want to see my bookings so that I know what I have reserved.
   Accepted when: only my own bookings are listed, with court, sport, start time and status; upcoming and past bookings are separated.

5. As a customer, I want to cancel a booking so that the court is freed when my plans change.
   Accepted when: only the owner can cancel (another customer gets 403); cancelling exactly 2 hours before the start or later returns 400; the booking stays in history as CANCELLED and the slot can be booked again.

6. As staff, I want to manage sports and courts so that the catalogue matches the real facility.
   Accepted when: staff can create and edit sports and courts and set the price; a court with future confirmed bookings cannot be deactivated (409); customers calling these endpoints get 403.

7. As staff, I want to generate one-hour slots for a court over a date range so that I do not have to create each slot by hand.
   Accepted when: slots are created from 08:00 to 22:00 in the facility time zone (Asia/Phnom Penh); existing times are skipped; an invalid or longer than 31 days range returns 400.

8. As staff, I want to view and cancel any booking so that I can handle customer requests.
   Accepted when: staff see all bookings with customer and court details; staff can cancel at any time and the slot becomes available again.

9. As staff, I want to block slots for maintenance or closures so that customers cannot book them.
   Accepted when: a blocked slot cannot be booked (409); a slot with a confirmed booking must be cancelled first; staff can unblock it.

10. As a customer, I want to book two consecutive slots in one request so that I can play for two hours.
    Accepted when: both slots are on the same court and consecutive, otherwise 400; I get both or neither; if either is taken, the whole request returns 409.

Full acceptance criteria and the requirements list are in the SRS (`SRS.md`).

## MVP scope

Must have: story 1, 2, 3, 4, 5, 6, 7, 8.

Nice to have: story 9, 10 (only after the core is stable and tested).

**Which story did you cut, and why?** I moved story 10 (two consecutive slots) and story 9 (block slots) from must-have to optional. Story 10 turns one atomic claim into an all-or-none claim on two rows and needs adjacency checks, which adds a lot of work on top of the single-slot concurrency that already has to be right. Story 9 adds a third slot status (BLOCKED) that touches booking, cancellation, court deactivation and the availability filter, and staff can already deactivate a court. Neither is needed for a customer to find, book and cancel a court, so cutting them gives a working demo first and leaves time for concurrency, permission and time-rule tests.

## Entities

| Entity | Main attributes | Relations |
|---|---|---|
| User | name, email, passwordHash, role (CUSTOMER or STAFF) | has many Bookings |
| Sport | name, description | has many Courts |
| Court | name, pricePerSlot, isActive | belongs to one Sport; has many CourtSlots |
| CourtSlot | startAt, endAt, status (AVAILABLE, BOOKED; BLOCKED if story 9 is built) | belongs to one Court; has many Bookings (history), only one CONFIRMED at a time |
| Booking | status (CONFIRMED or CANCELLED), createdAt | belongs to one User and one CourtSlot |

A PostgreSQL partial unique index allows only one CONFIRMED booking per slot.

**How this differs from the reference event-booking app.** An event app sells a limited number of seats (capacity) at events that organisers create. This project books a time on a physical resource: one hour on one court, with exactly one booking per slot, staff-generated hourly slots, fixed opening hours, a time zone, a 2-hour cancellation cut-off and a concurrency-safe claim of the same slot.

## Stretch feature

Search + pagination.

What it does in this app: customers filter courts by sport (one tab per sport) and by date. `GET /courts?sport=&date=&page=1&limit=10` is paginated in the database query (default 10 per page, maximum 50) and returns `{ data, page, limit, total }`, so the court list is genuinely paged by the API.

## Repository

https://github.com/OukPuthirith/sport-booking-system.git
