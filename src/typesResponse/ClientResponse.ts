// SÍ SE USA NUEVO
export type ClientResponse = {
  person_id: number;

  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;

  person: {
    first_name: string;
    last_name: string;
    birthdate: string;
    gender: string;
    identification: string;
    phone: string;
    marital_status: string;
    occupation: string;
    education: string;
  };

  user_account: {
    user_account_id: number;
    email: string;
    role: string;
    status: string;
    last_login: string | null;
  };
};
