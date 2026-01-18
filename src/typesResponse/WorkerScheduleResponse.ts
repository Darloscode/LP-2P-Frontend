import { ProfessionalOptionResponse } from "./ProfessionalOptionResponse";

// SÍ SE USA NUEVO
export type WorkerScheduleResponse = {
  worker_schedule_id: number;

  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;

  is_available: boolean;

  schedule: {
    schedule_id: number;
    date: string;
    start_time: string;
    end_time: string;
  };

  worker: ProfessionalOptionResponse;
};
