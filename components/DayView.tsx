"use client";

import { useState } from "react";
import { format, addMinutes, isBefore, isAfter, isEqual } from "date-fns";
import {
  APPOINTMENT_TYPE_CONFIG,
  DEFAULT_CALENDAR_CONFIG,
  Appointment,
  Doctor,
  TimeSlot,
} from "@/types";

interface DayViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  date: Date;
}

export function DayView({ appointments, doctor, date }: DayViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter((appt) =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function generateTimeSlots(): TimeSlot[] {
    const { startHour, endHour, slotDuration } = DEFAULT_CALENDAR_CONFIG;
    const slots: TimeSlot[] = [];

    let current = new Date(date);
    current.setHours(startHour, 0, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, 0, 0, 0);

    while (isBefore(current, end)) {
      const next = addMinutes(current, slotDuration);
      slots.push({
        start: new Date(current),
        end: new Date(next),
        label: format(current, "h:mm a"),
      });
      current = next;
    }

    return slots;
  }

  function getAppointmentsForSlot(slot: TimeSlot): Appointment[] {
    return filteredAppointments.filter((appt) => {
      const start = new Date(appt.startTime);
      const end = new Date(appt.endTime);

      return (
        (isBefore(start, slot.end) || isEqual(start, slot.end)) &&
        (isAfter(end, slot.start) || isEqual(end, slot.start))
      );
    });
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="day-view p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {format(date, "EEEE, MMMM d, yyyy")}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Dr. {doctor.name} – {doctor.specialty}
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

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex">
            <div className="w-24 p-2 text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
              {slot.label}
            </div>

            <div
              className="flex-1 p-2 min-h-[60px] relative border-l border-gray-100 dark:border-gray-700"
              role="list"
              aria-label={`Appointments for ${slot.label}`}
            >
              {getAppointmentsForSlot(slot).map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          No appointments scheduled for this day
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const config = APPOINTMENT_TYPE_CONFIG[appointment.type];
  const start = format(new Date(appointment.startTime), "h:mm a");
  const end = format(new Date(appointment.endTime), "h:mm a");

  return (
    <div
      className="rounded-lg p-2 mb-1 text-sm text-white shadow-sm"
      style={{ backgroundColor: config.color }}
      role="listitem"
      aria-label={`${appointment.patientName} - ${config.label} from ${start} to ${end}`}
    >
      <div className="font-medium">{config.label}</div>
      <div className="opacity-90">
        {appointment.patientName} | {start} – {end}
      </div>
      {appointment.notes && (
        <div className="italic opacity-80 mt-1 text-xs">{appointment.notes}</div>
      )}
    </div>
  );
}
