import { useState, useEffect, useMemo } from "react";
import type { Appointment, Doctor } from "@/types";
import { appointmentService } from "@/services/appointmentService";

interface UseAppointmentsParams {
  doctorId: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
}

interface UseAppointmentsReturn {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  loading: boolean;
  error: Error | null;
}

export function useAppointments(
  params: UseAppointmentsParams
): UseAppointmentsReturn {
  const { doctorId, date, startDate, endDate } = params;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const doctor = useMemo(() => {
    return appointmentService.getDoctorById(doctorId);
  }, [doctorId]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        setError(null);

        let result: Appointment[] = [];

        if (startDate && endDate) {
          result = appointmentService.getAppointmentsByDoctorAndDateRange(
            doctorId,
            startDate,
            endDate
          );
        } else {
          result = appointmentService.getAppointmentsByDoctorAndDate(
            doctorId,
            date
          );
        }

        result = appointmentService.sortAppointmentsByTime(result);

        setAppointments(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId, date, startDate, endDate]);

  return {
    appointments,
    doctor,
    loading,
    error,
  };
}
