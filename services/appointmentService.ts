import type {
  Appointment,
  Doctor,
  Patient,
  PopulatedAppointment,
} from "@/types";
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  getDoctorById as mockGetDoctorById,
  getPatientById as mockGetPatientById,
} from "@/data/mockData";

export class AppointmentService {
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return MOCK_APPOINTMENTS.filter((appt) => appt.doctorId === doctorId);
  }

  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    const targetDate = date.toDateString();

    return MOCK_APPOINTMENTS.filter((appt) => {
      const apptDate = new Date(appt.date).toDateString();
      return appt.doctorId === doctorId && apptDate === targetDate;
    });
  }

  getAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Appointment[] {
    const start = startDate.getTime();
    const end = endDate.getTime();

    return MOCK_APPOINTMENTS.filter((appt) => {
      const apptTime = new Date(appt.date).getTime();
      return appt.doctorId === doctorId && apptTime >= start && apptTime <= end;
    });
  }

  getPopulatedAppointment(
    appointment: Appointment
  ): PopulatedAppointment | null {
    const doctor = mockGetDoctorById(appointment.doctorId);
    const patient = mockGetPatientById(appointment.patientId);

    if (!doctor || !patient) return null;

    return {
      ...appointment,
      doctor,
      patient,
    };
  }

  getAllDoctors(): Doctor[] {
    return MOCK_DOCTORS;
  }

  getDoctorById(id: string): Doctor | undefined {
    return MOCK_DOCTORS.find((doc) => doc.id === id);
  }

  sortAppointmentsByTime(appointments: Appointment[]): Appointment[] {
    return [...appointments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  hasOverlappingAppointments(appointments: Appointment[]): boolean {
    const sorted = this.sortAppointmentsByTime(appointments);
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = new Date(sorted[i - 1].endTime).getTime();
      const currStart = new Date(sorted[i].startTime).getTime();
      if (currStart < prevEnd) return true;
    }
    return false;
  }
}

export const appointmentService = new AppointmentService();
