"use client";

import { useAppointments } from "@/hooks/useAppointments";
import { DoctorSelector } from "./DoctorSelector";
import { DayView } from "./DayView";
import { WeekView } from "./WeekView";
import { getWeekStart } from "@/utils/dateUtils";
import type { CalendarView } from "@/types";

interface ScheduleViewProps {
  selectedDoctorId: string;
  selectedDate: Date;
  view: CalendarView;
  onDoctorChange: (doctorId: string) => void;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}

export function ScheduleView({
  selectedDoctorId,
  selectedDate,
  view,
  onDoctorChange,
  onDateChange,
  onViewChange,
}: ScheduleViewProps) {
  const { appointments, doctor, loading, error } = useAppointments({
    doctorId: selectedDoctorId,
    date: selectedDate,
    startDate: view === "week" ? getWeekStart(selectedDate) : undefined,
    endDate:
      view === "week"
        ? new Date(
            getWeekStart(selectedDate).getTime() + 6 * 24 * 60 * 60 * 1000
          )
        : undefined,
  });

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Doctor Schedule</h2>
          {doctor && (
            <p className="text-sm text-gray-600 mt-1">
              Dr. {doctor.name} - {doctor.specialty}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <DoctorSelector
              selectedDoctorId={selectedDoctorId}
              onDoctorChange={onDoctorChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={
                selectedDate ? selectedDate.toISOString().split("T")[0] : ""
              }
              onChange={(e) => {
                const newDate = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                onDateChange(newDate);
              }}
              className="px-4 py-2 border rounded-lg text-sm w-full sm:w-auto"
            />
          </div>

          <div className="flex gap-2">
            <button
              className={`px-4 py-2 text-sm rounded ${
                view === "day"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => onViewChange("day")}
            >
              Day
            </button>
            <button
              className={`px-4 py-2 text-sm rounded ${
                view === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => onViewChange("week")}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading && (
          <p className="text-gray-500 text-sm">Loading appointments...</p>
        )}
        {error && <p className="text-red-500 text-sm">{error.message}</p>}

        {!loading && !error && (
          <>
            {view === "day" ? (
              <DayView
                appointments={appointments}
                doctor={doctor}
                date={selectedDate}
              />
            ) : (
              <WeekView
                appointments={appointments}
                doctor={doctor}
                weekStartDate={getWeekStart(selectedDate)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
