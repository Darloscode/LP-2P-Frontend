// SÍ SE USA NUEVO
export type AppointmentResponse = {
  appointment_id: number;

  client: {
    user_account_id: number;
    person_id: number;
    first_name: string;
    last_name: string;
    email: string;
    identification: string;
    phone: string;
    gender: string;
  };

  professional: {
    person_id: number;
    first_name: string;
    last_name: string;
    email: string;
    title: string;
    specialty: string;
  };

  service: {
    service_id: number;
    name: string;
    price: string; // viene como string desde backend
  };

  schedule: {
    date: string; // YYYY-MM-DD
    start_time: string; // HH:mm:ss
    end_time: string; // HH:mm:ss
  };

  payment: {
    payment_id: number;
    status: string;
    has_receipt: boolean;
    file: string;
  };

  report: {
    appointment_report_id: number;
    file: string;
  } | null;

  scheduled_by: {
    person_id: number;
    first_name: string;
    last_name: string;
    role: string;
  };

  status: {
    status_id: number;
    name: string;
  };

  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;
};
