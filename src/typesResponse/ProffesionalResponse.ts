// SÍ SE USA NUEVO
export type ProfessionalResponse = {
  person_id: number;
  specialty: string;
  title: string;

  person: {
    first_name: string;
    last_name: string;
    identification: string | null;
  };

  user_account: {
    user_account_id: number;
    email: string;
    role: string;
    status: string;
  };

  services: {
    service_id: number;
    name: string;
    price: number;
  };

  total_services: number;
  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;
};
