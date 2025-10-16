# Frontend Challenge Submission: Appointment Scheduler

**Candidate Name:** Vaishnavi Kale
**Date:** 16 October 2025
**Time Spent:** 4-5 hours

---

## ✅ Completed Features

Marked features have been implemented based on the requirements.

### Core Features
- [x] Day View calendar (time slots 8 AM - 6 PM)
- [x] Week View calendar (7-day grid)
- [x] Doctor selector dropdown
- [x] Appointment rendering with correct positioning
- [x] Color-coding by appointment type
- [x] Service layer implementation
- [x] Custom hooks (headless pattern)
- [x] Component composition

### Bonus Features
- [ ] Current time indicator 
- [x] Responsive design (mobile-friendly)
- [x] Empty states
- [x] Loading states
- [x] Error handling
- [x] Appointment search/filter 
- [x] Dark mode 
- [x] Accessibility improvements 
- [x] Other: **Custom Overlap Rendering** (Day View)

---
### State Management

**Approach:** [x] Custom hooks (headless pattern)

**Why?** The custom hook (`useAppointments`) centralizes all data fetching, filtering, loading, and error logic, providing a clean API for the `ScheduleView` component and keeping the UI layer lean.

---
### Service Layer

**Structure:** Implemented as an ES6 **Class** (`AppointmentService`) exposed as a **singleton instance** to abstract data access away from the React layer.
**Implemented Methods:**
- [x] getAppointmentsByDoctor
- [x] getAppointmentsByDoctorAndDate
- [x] getAppointmentsByDoctorAndDateRange
- [x] getPopulatedAppointment
- [x] getAllDoctors
- [x] Other: `sortAppointmentsByTime` (internal helper)

---

## 🎨 UI/UX Decisions

### Calendar Rendering

**Time Slots:** Dynamically generated via a loop for 30-minute intervals (8 AM to 6 PM).
**Positioning:** **CSS Absolute Positioning** in Day View. `top` and `height` properties are calculated based on the appointment's start time and duration relative to the calendar's start time.
**Overlap Handling:** Used a **Greedy Column Packing Algorithm** to detect concurrent appointments, assign them a column index, and calculate their appropriate **`left`** position and **`width`** (as percentages) to stack them side-by-side.

---

### Responsive Design

**Mobile-Friendly:** [x] Yes, fully responsive
**Strategies:** Used **`overflow-x-auto`** on the Week View's main table wrapper to allow users to scroll horizontally through the days on smaller screens, preserving the dense calendar layout without breakage.

---

## 🧪 Testing & Quality

**Code Checks:** All checks passed (`lint`, `type-check`, `build`), and manual testing was completed.
**Tests:** [x] No (ran out of time)

---

## 🤔 Assumptions Made

1.  Assumed all `startTime`/`endTime` strings in mock data are valid and convertible to `Date` objects.
2.  Assumed date range queries are inclusive of the start and end days.

---

## ⚠️ Known Issues / Limitations

1.  **Week View Time Span:** Appointments in the Week View only visually occupy the cell where they **start**, they do not span vertically across subsequent time cells to show duration.
2.  **Working Hours Filter:** The current service layer does not validate if fetched appointments fall within the doctor's specific `workingHours` defined in the mock data.

---

## 🚀 Future Improvements

1.  **Virtualization:** Implement list virtualization (e.g., `react-window`) for better performance scalability with large datasets.
2.  **API Integration:** Convert service methods to be `async` and introduce TanStack Query (React Query) for robust caching and state synchronization.
3.  **Refactoring:** Isolate the complex Day View overlap positioning logic into its own dedicated utility hook for better testability and cleanliness.

---

## 📚 Libraries & Tools Used

**Calendar/UI:** [x] **Tailwind CSS**
**Utility:** [x] **date-fns**
**AI Tools:** [x] **ChatGPT** and **GitHub Copilot** (Used for boilerplate, structure refinement, and complex algorithmic math validation).

---

## 📝 Additional Notes

The solution successfully separates the data access layer (`AppointmentService`) from the state logic (`useAppointments`), providing a clean, scalable foundation ready for integration with a real, asynchronous backend API.

---