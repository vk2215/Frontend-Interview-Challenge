"use client";

import type { Appointment } from "@/types";

interface AppointmentCardProps {
  appointment: Appointment;
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

  return (
    <div
      className={`rounded-md p-2 border ${colorClass} mb-1 text-sm ${
        compact ? "text-xs p-1" : ""
      }`}
    >
      <p className="font-semibold">{appointment.patientName}</p>
      <p className="truncate">{appointment.type}</p>
      <p className="text-gray-600 text-xs">
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
