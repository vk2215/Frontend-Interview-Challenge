"use client";

import { useState } from "react";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import type { Appointment, Doctor, TimeSlot } from "@/types";
import { AppointmentCard } from "./AppointmentCard";

interface WeekViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  weekStartDate: Date;
}

export function WeekView({
  appointments,
  doctor,
  weekStartDate,
}: WeekViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // --- 🧩 TEMP FIX: safely handle patientName ---
  // Some data might not have a `patientName` directly, so we fallback to a generic name.
  const safeAppointments = appointments.map((appt) => ({
    ...appt,
    patientName:
      (appt as any).patientName ||
      (appt as any).patient?.name ||
      "Unknown Patient",
  }));

  const filteredAppointments = safeAppointments.filter((appt) =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getWeekDays(): Date[] {
    return Array.from({ length: 7 }).map((_, i) => addDays(weekStartDate, i));
  }

  function generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push({
        start: setMinutes(setHours(new Date(), hour), 0),
        end: setMinutes(setHours(new Date(), hour), 30),
        label: `${hour}:00`,
      });
      slots.push({
        start: setMinutes(setHours(new Date(), hour), 30),
        end: setMinutes(setHours(new Date(), hour + 1), 0),
        label: `${hour}:30`,
      });
    }
    return slots;
  }

  function getAppointmentsForDay(date: Date): Appointment[] {
    return filteredAppointments.filter((apt) =>
      isSameDay(new Date(apt.startTime), date)
    );
  }

  function getAppointmentsForDayAndSlot(
    date: Date,
    slotStart: Date
  ): Appointment[] {
    return getAppointmentsForDay(date).filter(
      (apt) =>
        isWithinInterval(new Date(apt.startTime), {
          start: slotStart,
          end: addDays(slotStart, 0),
        }) ||
        isWithinInterval(new Date(apt.endTime), {
          start: slotStart,
          end: addDays(slotStart, 0),
        })
    );
  }

  const weekDays = getWeekDays();
  const timeSlots = generateTimeSlots();

  return (
    <div className="week-view p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {format(weekStartDate, "MMM d")} -{" "}
          {format(addDays(weekStartDate, 6), "MMM d, yyyy")}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Dr. {doctor.name} — {doctor.specialty}
          </p>
        )}
        <input
          type="text"
          placeholder="Search patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2 p-1 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          aria-label="Search appointments by patient name"
        />
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="w-20 p-2 text-xs bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                Time
              </th>
              {weekDays.map((day, idx) => (
                <th
                  key={idx}
                  className="p-2 text-xs bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="font-semibold">{format(day, "EEE")}</div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {format(day, "MMM d")}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, slotIdx) => (
              <tr
                key={slotIdx}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-1 text-xs text-gray-600 dark:text-gray-300">
                  {slot.label}
                </td>
                {weekDays.map((day, dayIdx) => (
                  <td
                    key={dayIdx}
                    className="p-1 border-l border-gray-200 dark:border-gray-700 align-top min-h-[60px] relative"
                    role="list"
                    aria-label={`Appointments for ${slot.label} on ${format(
                      day,
                      "EEE MMM d"
                    )}`}
                  >
                    {getAppointmentsForDayAndSlot(day, slot.start).map(
                      (apt) => (
                        <AppointmentCard
                          key={apt.id}
                          appointment={apt}
                          compact
                        />
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAppointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          No appointments scheduled for this week
        </div>
      )}
    </div>
  );
}
