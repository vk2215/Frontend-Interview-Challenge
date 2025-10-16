"use client";

import type { Appointment, PopulatedAppointment } from "@/types";

type AppointmentLike = Appointment | PopulatedAppointment;

interface AppointmentCardProps {
  appointment: AppointmentLike;
  compact?: boolean;
}

export function AppointmentCard({
  appointment,
  compact,
}: AppointmentCardProps) {
  const typeColors: Record<string, string> = {
    consultation: "bg-blue-100 text-blue-800",
    followup: "bg-green-100 text-green-800",
    procedure: "bg-red-100 text-red-800",
  };

  const colorClass =
    typeColors[appointment.type] || "bg-gray-100 text-gray-800";

  // ✅ Handle both Appointment and PopulatedAppointment
  const patientName =
    (appointment as any).patientName ||
    (appointment as any).patient?.name ||
    "Unknown Patient";

  const doctorName =
    (appointment as any).doctor?.name || (appointment as any).doctorName || "";

  return (
    <div
      className={`rounded-md p-2 border ${colorClass} mb-1 text-sm shadow-sm ${
        compact ? "text-xs p-1" : ""
      }`}
      role="listitem"
      aria-label={`${patientName} appointment ${doctorName ? `with Dr. ${doctorName}` : ""}`}
    >
      <p className="font-semibold">{patientName}</p>
      <p className="truncate capitalize">{appointment.type}</p>
      {doctorName && (
        <p className="text-xs italic text-gray-600 dark:text-gray-300">
          Dr. {doctorName}
        </p>
      )}
      <p className="text-gray-600 dark:text-gray-300 text-xs">
        {new Date(appointment.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {new Date(appointment.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
