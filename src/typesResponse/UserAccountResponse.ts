// SÍ SE USA NUEVO
export type UserAccountResponse = {
  user_account_id: number;
  email: string;
  last_login: string | null;

  created_by: string;
  creation_date: string;

  role: {
    role_id: number;
    name: string;
  };

  status: {
    status_id: number;
    name: string;
  };

  /** Persona asociada (puede ser null) */
  person: {
    person_id: number;
    first_name: string;
    last_name: string;
    birthdate: string | null;
    phone: string | null;
    identification: string | null;
    gender: string | null;
    occupation: string | null;
    marital_status: string | null;
    education: string | null;
  } | null;

  /** Cliente (solo ID, puede ser null) */
  client: {
    person_id: number;
  } | null;

  /** Profesional (puede ser null) */
  professional: {
    person_id: number;
    specialty: string;
    title: string;
    services: {
      service_id: number;
      name: string;
      price: string;
    }[];
  } | null;

  /** Staff (solo ID, puede ser null) */
  staff: {
    person_id: number;
  } | null;
};
