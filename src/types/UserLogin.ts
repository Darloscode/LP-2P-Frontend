// SÍ SE USA NUEVO
export type UserLogin = {
  user_account_id: number;
  email: string;
  last_login: string;

  person: {
    person_id: number;
    first_name: string;
    last_name: string;
    identification: string;
    phone: string;
    gender: string;
  };

  role: {
    role_id: number;
    name: string;
  };

  status: {
    status_id: number;
    name: string;
  };
};
