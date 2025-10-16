"use client";

import { useState, useEffect } from "react";
import type { Doctor } from "@/types";
import { appointmentService } from "@/services/appointmentService";

interface DoctorSelectorProps {
  selectedDoctorId: string;
  onDoctorChange: (doctorId: string) => void;
}

export function DoctorSelector({
  selectedDoctorId,
  onDoctorChange,
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);

      const allDoctors = appointmentService.getAllDoctors();
      setDoctors(allDoctors);
    } catch (err) {
      setError("Failed to load doctors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading doctors...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="doctor-selector w-full max-w-sm">
      <label
        htmlFor="doctorSelect"
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        Select Doctor
      </label>

      <select
        id="doctorSelect"
        value={selectedDoctorId}
        onChange={(e) => onDoctorChange(e.target.value)}
        className="block w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select a doctor --</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            Dr. {doctor.name} — {doctor.specialty}
          </option>
        ))}
      </select>
    </div>
  );
}
