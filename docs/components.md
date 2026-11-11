# Component trees

Frontend for SportBook (Vue 3, TypeScript, Pinia, Vue Router). One section per wireframe in `docs/wireframes/`.

## Rules used in every screen

- Props down, events up. A child never changes its props and never imports a store; only views talk to stores.
- State lives in the lowest component that needs it. If two siblings need it, the parent owns it.
- Data used by more than one screen (courts, slots, bookings, the logged-in user) lives in a Pinia store. Anything about the screen itself (selected tab, open dialog, notice) lives in the view.
- Time rules use a `now` value from `useClock()`, passed down as a prop, so tests can fix the time.
- Two-way fields use `v-model` (`modelValue` prop and `update:modelValue` event).
- Types come from `src/types.ts`: `User`, `Sport`, `Court`, `CourtSlot`, `Booking`, plus `Page<T>` (`data`, `page`, `limit`, `total`).

## Routes and stores

| Route | View | Who |
|---|---|---|
| `/` | `CourtsView` (courts home) | customer |
| `/courts/:id?date=YYYY-MM-DD` | `CourtDetailView` | customer |
| `/bookings` | `MyBookingsView` | customer |
| `/staff` | `StaffDashboardView` | staff |

| Store | Owns | Main actions and getters |
|---|---|---|
| `useAuthStore` | `currentUser` (mock in M1) | `isStaff` |
| `useCatalogStore` | `sports`, `courts` | `courtsPage(sportId, date, page, limit)` returns `Page<Court>`; `sportName(id)` |
| `useBookingStore` | `slots`, `bookings` | `slotsFor(courtId, date)`, `freeSlotCount(courtId, date)`, `bookSlot(slotId)`, `cancelBooking(id)`, `myBookings`, `allBookings` |

`bookSlot` and `cancelBooking` return `{ ok: true }` or `{ ok: false, reason }`, where `reason` is `PAST`, `TAKEN`, `TOO_LATE` or `NOT_OWNER`. The views turn the reason into a message.

## Shared building blocks

| Component | Props | Events | Owns state |
|---|---|---|---|
| `AppSidebar` | `title`, `links: { label, to }[]` | `logout` | none (active link comes from the router) |
| `PageHeader` | `title`, `subtitle?` (slot `actions` for the avatar) | none | none |
| `StatusBadge` | `label`, `tone: 'success' \| 'neutral' \| 'warning' \| 'danger'` | none | none |
| `BaseButton` | `variant: 'primary' \| 'outline' \| 'danger'`, `disabled?` | `click` | none |
| `NoticeBar` | `kind: 'success' \| 'error'`, `message` | `dismiss` | none |
| `EmptyState` | `title`, `message`, `actionLabel?` | `action` | none |
| `ConfirmDialog` | `open`, `title`, `message`, `confirmLabel` | `confirm`, `close` | none |
| `Pagination` | `page`, `limit`, `total` | `change(page)` | none |
| `TabBar` | `tabs: { id, label, count? }[]`, `modelValue` | `update:modelValue` | none |

## Layout: sidebar shell (`00-sidebar-shell.pdf`)

```
App.vue
├── AppSidebar          (customer links: Home, My Bookings, Profile)  or  (staff links, see screen 4)
└── RouterView
```

`App.vue` picks the sidebar links from `route.meta.area` (`customer` or `staff`) and the current user from `useAuthStore`. It handles `logout` by clearing the user and redirecting to the login page. `App.vue` owns no state of its own.

## Screen 1: Courts home (`01-courts-home.pdf`)

```
CourtsView
├── PageHeader            "Welcome back, <name>!"
├── SportTabs
├── DateSearchBar
├── CourtCard  (v-for)
│   └── StatusBadge
├── EmptyState            when no court matches
└── Pagination
```

| Component | Props | Events | Owns state |
|---|---|---|---|
| `CourtsView` | none (reads stores) | none | `selectedSportId`, `appliedDate`, `page` |
| `SportTabs` | `sports: Sport[]`, `modelValue: number` | `update:modelValue` | none |
| `DateSearchBar` | `initialDate: string` | `search(date)` | `draftDate` (what the person is typing) |
| `CourtCard` | `court: Court`, `sportName`, `freeSlots: number` | `select(courtId)` | none |
| `Pagination` | `page`, `limit`, `total` | `change(page)` | none |

State ownership:

- `selectedSportId`, `appliedDate` and `page` live in `CourtsView` because the court list, the pagination and the empty state all depend on them. Changing the sport or the date resets `page` to 1.
- `draftDate` lives in `DateSearchBar`, because the wireframe has a Search button: typing does not filter, only `search(date)` moves the date up to `appliedDate`.
- The visible courts are a computed `Page<Court>` from `useCatalogStore().courtsPage(...)`, with the free-slot count from `useBookingStore().freeSlotCount(...)`. Courts with 0 free slots are left out.
- `select(courtId)` makes `CourtsView` navigate to `/courts/:id?date=<appliedDate>`.

## Screen 2: Court detail and slot picker (`02-court-detail.pdf`)

```
CourtDetailView
├── BaseButton (variant outline)   "Back"
├── CourtHeader                    image, name, price per hour
├── NoticeBar                      booking confirmed or error
├── SlotGrid
│   └── SlotButton (v-for)
├── BaseButton (variant primary)   "Book This Slot"
└── CourtInfoPanel                 sport, price, status
```

| Component | Props | Events | Owns state |
|---|---|---|---|
| `CourtDetailView` | none (reads route and stores) | none | `selectedSlotId`, `notice`, `isBooking` |
| `CourtHeader` | `court`, `sportName`, `imageUrl` | none | none |
| `SlotGrid` | `slots: CourtSlot[]`, `selectedSlotId: number \| null`, `now: string` | `select(slotId)` | none |
| `SlotButton` | `label` (for example "12:00 – 13:00"), `state: 'available' \| 'selected' \| 'booked' \| 'past'` | `click` | none |
| `CourtInfoPanel` | `court`, `sportName` | none | none |

State ownership:

- `selectedSlotId` lives in `CourtDetailView`, because both `SlotGrid` (to highlight) and the Book button (enabled only when a slot is selected) need it.
- `notice` and `isBooking` live in `CourtDetailView` as well, because they come from the result of `bookSlot`.
- The court id comes from `route.params.id` and the date from `route.query.date`. They are read, not copied, so there is no second copy to get out of sync.
- `SlotGrid` decides each button's state: `BOOKED` slots are `booked`, slots that started before `now` are `past`, the selected one is `selected`. Booked and past buttons are disabled and do not emit.
- Clicking Book calls `bookSlot(selectedSlotId)`. On success: clear the selection and show "Booking confirmed". On `TAKEN`: clear the selection and show "This slot was just booked by someone else. Choose another." On `PAST`: show "This slot has already started."
- Unknown court id: show `EmptyState` ("Court not found") instead of the page.

## Screen 3: My bookings (`03-my-bookings.pdf`)

```
MyBookingsView
├── PageHeader            "My Bookings"
├── TabBar                Upcoming (n), Past (n)
├── NoticeBar
├── BookingRow  (v-for)
│   ├── StatusBadge
│   └── BaseButton (variant outline)   "Cancel"
├── EmptyState
└── ConfirmDialog
```

| Component | Props | Events | Owns state |
|---|---|---|---|
| `MyBookingsView` | none (reads stores) | none | `activeTab`, `bookingToCancel`, `notice` |
| `BookingRow` | `booking: BookingView`, `canCancel: boolean` | `cancel(bookingId)` | none |
| `ConfirmDialog` | `open`, `title`, `message`, `confirmLabel` | `confirm`, `close` | none |

`BookingView` is a booking joined with its court and slot: `id`, `courtName`, `sportName`, `imageUrl`, `startAt`, `endAt`, `status`.

State ownership:

- `activeTab` (`'upcoming'` or `'past'`) lives in `MyBookingsView`. Upcoming means CONFIRMED and not started yet; Past means everything else (started, or CANCELLED).
- The tab counts and the rows are computed from `useBookingStore().myBookings`.
- `bookingToCancel` (a booking id or null) lives in `MyBookingsView`. `BookingRow` emits `cancel(id)`, the view stores it and opens `ConfirmDialog`; `confirm` calls `cancelBooking(id)`, `close` clears it.
- `canCancel` is computed by the view with the 2-hour rule: the start is more than 2 hours after `now` (exactly 2 hours is not allowed). When it is false, `BookingRow` hides the Cancel button and shows "Cannot cancel within 2 hours".
- Empty tab: `EmptyState` with "No upcoming bookings" and the action "Find a court", which goes to `/`.

## Screen 4: Staff dashboard (`04-staff-dashboard.pdf`)

```
App.vue
├── AppSidebar            title "Staff Panel"
└── StaffDashboardView
    ├── PageHeader        "Staff Dashboard", "Manage your facility"
    ├── StatCard  (x4)    Sports, Courts, Bookings Today, Total Bookings
    ├── RecentBookingsTable
    │   └── StatusBadge
    └── QuickActions
```

| Component | Props | Events | Owns state |
|---|---|---|---|
| `StaffDashboardView` | none (reads stores) | none | none |
| `StatCard` | `label`, `value: number` | none | none |
| `RecentBookingsTable` | `rows: { id, customerName, courtName, startAt, endAt, status }[]` | `viewAll` | none |
| `QuickActions` | `actions: { id, label }[]` | `select(actionId)` | none |

State ownership:

- The dashboard has no state of its own. The four numbers and the last 5 bookings are computed from `useCatalogStore` and `useBookingStore` (`allBookings`).
- `viewAll` navigates to the all-bookings page, and `select(actionId)` navigates to Manage Courts or Generate Slots.
- Sidebar links for staff: Dashboard, Manage Sports, Manage Courts, Generate Slots, All Bookings. Staff routes use a guard that sends customers away.

## Changes from the wireframes

These are small additions needed by the SRS, so the wireframes stay as they are and the code follows this list.

| Wireframe | Change | Reason |
|---|---|---|
| Courts home | Add `Pagination` under the cards, and an empty state | Stretch feature (story 2), and the empty state required by M1 |
| Courts home | Badge "Available" becomes "6 slots free" | More useful than a label that is always the same |
| Court detail | Slot buttons get `booked` and `past` states (gray, disabled), and the Book button is disabled until a slot is selected | Stories 3 and BR rules |
| My bookings | Cancel is hidden within 2 hours, with a short explanation, and a confirm dialog before cancelling | Story 5, FR-10 |
| My bookings | Give the date and time text enough width so "12:00 - 13:00" is not cut off | The wireframe clips the end time |
| Staff dashboard | The "Block Slot / Maintenance" action and sidebar link are left out of M1 | Story 9 is optional |
| All screens with images | Use a placeholder image per sport. `Court` has no image field yet | Add `imageUrl` later if there is time |
| Mock dates | Use real weekdays: Oct 26, 2026 is a Monday and Oct 27 a Tuesday, not Sat and Sun | Generate the weekday in code instead of typing it |
