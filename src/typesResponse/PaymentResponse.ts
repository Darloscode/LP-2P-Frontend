// SÍ SE USA NUEVO
export type PaymentResponse = {
  payment_id: number;

  appointment: {
    appointment_id: number;
    status: string;
  };

  client: {
    user_account_id: number;
    person_id: number;
    first_name: string;
    last_name: string;
    email: string;
    identification: string;
    phone: string;
  };

  service: {
    service_id: number;
    name: string;
    price: string; // viene como string desde backend
  };

  status: {
    status_id: number;
    name: string;
  };

  file: string;
  has_receipt: boolean;
  has_appointment: boolean;

  created_by: string;
  creation_date: string;
};
