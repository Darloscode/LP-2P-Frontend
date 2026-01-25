//SÍ SE USA NUEVO
export type RegisterUser = {
  // UserAccount
  email: string;
  password: string;
  role_id: number; // 2=Professional, 3=Client, 4=Staff
  status?: number;

  // Person
  first_name: string;
  last_name: string;
  birthdate: string; // YYYY-MM-DD
  gender: number;
  occupation: number;
  marital_status: number;
  education: number;
  phone: string;

  // Identification
  identification_number: string;

  // Professional (solo si role_id = 2)
  specialty?: string;
  title?: string;

  // Metadata
  created_by?: string;
};
