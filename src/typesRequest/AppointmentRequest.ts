//SÍ SE USA NUEVO
export type AppointmentRequest = {
  service_id: number;
  client_id: number;
  scheduled_by: number;
  worker_schedule_id: number;
  payment_status_id: number;
  appointment_status_id: number;
  payment_file: string;
  created_by: string;
};
