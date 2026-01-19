// SÍ SE USA NUEVO
export type PersonResponse = {
  person_id: number;

  first_name: string;
  last_name: string;
  birthdate: string;
  phone: string;
  identification: string;
  gender: string;
  occupation: string;
  marital_status: string;
  education: string;
  email: string;

  user_account: {
    user_account_id: number;
    role: string;
    role_id: number;
    status_id: number;
    status: string;
  };

  country?: {
    country_id: number | null;
    name: string | null;
    state: {
      state_id: number | null;
      name: string | null;
      city: {
        city_id: number | null;
        name: string | null;
      };
    };
  };

  /** Client | Professional | Staff | null */
  type: "Client" | "Professional" | "Staff" | null;

  professional_info: {
    specialty: string;
    title: string;
    services: {
      service_id: number;
      name: string;
      price: string;
    }[];
  } | null;

  created_by: string;
  creation_date: string;
};
