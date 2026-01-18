import { ProfessionalOptionResponse } from "@typesResponse/ProfessionalOptionResponse";

// SÍ SE USA NUEVO
export type ProfessionalServiceResponse = {
  professional_service_id: number;

  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;

  // professional
  professional: ProfessionalOptionResponse;

  service: {
    // service
    service_id: number;
    name: string;
    price: string; // viene como string desde el backend
  };
};
