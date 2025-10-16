# 🏥 Hospital Appointment Scheduler - Frontend Challenge

## 🎯 Challenge Overview

Build a hospital appointment scheduling interface that displays doctor appointments in day and week calendar views.

**Time**: 4-5 hours
**Focus**: Architecture, design patterns, calendar rendering
**Framework**: Next.js 14 + TypeScript

---

## ✅ Implementation Status

All **Core Requirements** have been met. The solution demonstrates a clean separation of concerns using the Headless Component (Custom Hook) pattern and a dedicated Service Layer for data access.

| Requirement | Status | Notes |
| :--- | :--- | :--- |
| **Architecture & Design** | **COMPLETE** | Implemented Service Layer and `useAppointments` hook. |
| **Day View Calendar** | **COMPLETE** | Renders 30-minute slots (8 AM - 6 PM) and handles **overlapping appointments** using a CSS-based greedy column packing algorithm. |
| **Week View Calendar** | **COMPLETE** | Renders a 7-day grid with appointments positioned by day and time slot. |
| **Role-Based Filtering** | **COMPLETE** | Doctor selection dropdown filters the schedule view. |

---

## 🏗️ Architecture Decisions

The application follows a standard layered frontend architecture to ensure modularity, testability, and separation of concerns.

### 1. Service Layer (`services/AppointmentService.ts`)
* **Purpose:** Abstract data access. All components and hooks interact with data exclusively through this layer.
* **Design:** Implemented as a static class/singleton (`export const appointmentService = new AppointmentService();`). This allows for easy mocking in unit tests (by replacing the singleton instance or using dependency injection).
* **Filtering Logic:** Centralizes complex data logic, such as comparing date strings to `Date` objects and filtering appointments by day or date range.

### 2. Headless Logic Layer (`hooks/useAppointments.ts`)
* **Purpose:** Encapsulate business logic, state management (loading, error), and data transformation.
* **Design:** A primary `useAppointments` hook handles fetching for both Day and Week views by conditionally checking for `startDate`/`endDate`. Helper hooks (`useDayViewAppointments`, `useWeekViewAppointments`, `useDoctors`) provide specific, cleaner interfaces for consuming components.
* **Dependencies:** Relies solely on the `appointmentService` and standard React hooks (`useState`, `useEffect`, `useMemo`).

### 3. Domain Logic (Overlap Handling)
* **Decision:** To fulfill the requirement of handling overlaps without using a heavy calendar library or canvas, a custom **Greedy Column Packing Algorithm** was implemented in the `DayView` rendering logic.
* **Mechanism:** This algorithm calculates the optimal `left` position (column) and `width` (percentage) for each appointment, ensuring all overlapping appointments are visible side-by-side using CSS absolute positioning.

---

## 📁 Component Structure

The application's rendering is organized hierarchically:

1.  **`App` (Entry Point)**: Handles global state initialization (selected doctor, selected date, view mode) and renders the `ScheduleView`.
2.  **`ScheduleView` (Main Composition)**:
    * Connects to the `useAppointments` hook based on the global state.
    * Renders the Header (Doctor details, Date Controls, View Toggles).
    * Conditionally renders either `DayView` or `WeekView`.
3.  **`DoctorSelector` (UI/Data)**: Uses the `useDoctors` hook to populate the doctor dropdown.
4.  **`DayView` (Presentation)**:
    * Generates the time grid.
    * Applies the `calculateAppointmentLayout` logic for positioning.
    * Renders positioned `AppointmentCard` components.
5.  **`WeekView` (Presentation)**:
    * Renders the 7-day responsive `<table>` grid.
    * Renders the compact version of the `AppointmentCard` in the appropriate day/time cell.
6.  **`AppointmentCard` (Reusable UI)**: Renders the visual representation of a single appointment, handling color coding and dynamic sizing/positioning based on props (used in both Day and Week views).

---

## 📝 Trade-offs & Improvements

| Area | Current Implementation | Improvement with More Time |
| :--- | :--- | :--- |
| **Data Fetching** | Synchronous service calls (for mock data speed). | Implement `useAppointments` with `Promise`-based asynchronous fetching and proper error boundaries/suspense, matching a real API integration. |
| **Date/Time** | Uses basic JavaScript `Date` and `date-fns` helpers. | Standardize all date comparisons using a library like `date-fns` for robust time zone and daylight saving handling, especially in the `AppointmentService`. |
| **Day View Overlap** | Custom Greedy Column Packing algorithm. | Refine the algorithm to ensure maximum space utilization (e.g., using a non-greedy optimal packing) for highly complex or triple overlaps. |
| **Accessibility** | Basic HTML structure is used. | Add ARIA labels, ensure keyboard navigation for date controls and appointment cards, and verify color contrast ratios. |
| **Working Hours** | Doctor working hours are displayed but appointments aren't validated against them. | Implement validation in the service layer to filter out any appointments falling outside the doctor's `workingHours` for the given day. |

---

## 🚀 Getting Started



### 1. Install Dependencies

```bash

npm install

```



### 2. Run Development Server

```bash

npm run dev

```