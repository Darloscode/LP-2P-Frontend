import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfessionalByService } from "@/utils/utils";
import { getScheduleByProfessional } from "@/utils/utils";
import { WorkerScheduleResponse } from "@/typesResponse/WorkerScheduleResponse";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DateCalendarValue from "@components/DateCalendarValue";
import axios from "axios";
import apiURL from "@/API/apiConfig";
import { ProfessionalServiceResponse } from "@/typesResponse/ProfessionalServiceResponse";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import { ProfessionalOptionResponse } from "@/typesResponse/ProfessionalOptionResponse";
import { ClientResponse } from "@/typesResponse/ClientResponse";

export default function AppointmentCreation() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Datos completos cargados una sola vez
  const [professionalServiceData, setProfessionalServiceData] = useState<
    ProfessionalServiceResponse[]
  >([]);
  const [workerSchedulesData, setWorkerSchedulesData] = useState<
    WorkerScheduleResponse[]
  >([]);
  const [allServices, setAllServices] = useState<ServiceResponse[]>([]);
  const [allClients, setAllClients] = useState<ClientResponse[]>([]);

  // Estados de selección
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [workerScheduleId, setWorkerScheduleId] = useState<number | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);

  // Opciones filtradas para mostrar
  const [professionalsOptions, setProfessionalsOptions] = useState<
    ProfessionalOptionResponse[]
  >([]);
  const [schedulesOptions, setSchedulesOptions] = useState<
    WorkerScheduleResponse[]
  >([]);

  const navigate = useNavigate();

  // Cargar todos los datos UNA SOLA VEZ al montar el componente
  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");
      try {
        setLoading(true);

        const [responsePS, responseClients, responseWS] = await Promise.all([
          axios.get(`${apiURL}/professional-services`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiURL}/clients`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiURL}/worker-schedules`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const professionalService: ProfessionalServiceResponse[] =
          responsePS.data;
        setProfessionalServiceData(professionalService);

        // Extraer servicios únicos
        const uniqueServices = Array.from(
          new Map(
            professionalService.map((ps: any) => [
              ps.service.service_id,
              ps.service,
            ]),
          ).values(),
        );
        setAllServices(uniqueServices);

        setAllClients(responseClients.data);
        setWorkerSchedulesData(responseWS.data);

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Solo se ejecuta una vez

  // Actualizar profesionales cuando cambia el servicio
  useEffect(() => {
    if (serviceId !== null) {
      const professionals: ProfessionalOptionResponse[] =
        getProfessionalByService(serviceId, professionalServiceData);
      setProfessionalsOptions(professionals);
    } else {
      setProfessionalsOptions([]);
    }
  }, [serviceId, professionalServiceData]);

  // Actualizar horarios cuando cambia el profesional
  useEffect(() => {
    if (professionalId !== null) {
      const schedules: WorkerScheduleResponse[] = getScheduleByProfessional(
        professionalId,
        workerSchedulesData,
      );
      setSchedulesOptions(schedules);
    } else {
      setSchedulesOptions([]);
    }
  }, [professionalId, workerSchedulesData]);

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setServiceId(value ? parseInt(value) : null);
    setProfessionalId(null);
    setWorkerScheduleId(null);
  };

  const handleProfessionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    setProfessionalId(value ? parseInt(value) : null);
    setWorkerScheduleId(null);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setClientId(value ? parseInt(value) : null);
  };

  const handleToPay = () => {
    if (!serviceId || !workerScheduleId || !professionalId || !clientId) {
      setErrorMessage(
        "Por favor, complete todos los campos antes de continuar.",
      );
      return;
    }

    setErrorMessage(null);
    const newPath = `/pago/${serviceId}/${workerScheduleId}/${clientId}`;
    navigate(newPath);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0px",
      }}
    >
      {/* Div izquierdo - contenido del formulario */}
      <div
        style={{
          width: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControl>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 w-full">
                <h6 className="grow">Servicio</h6>
              </div>
              <select
                value={serviceId || ""}
                onChange={handleServiceChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Escoja el servicio</option>
                {allServices.map((option: any) => (
                  <option key={option.service_id} value={option.service_id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 w-full">
                <h6 className="grow">Profesional</h6>
              </div>
              <select
                value={professionalId || ""}
                onChange={handleProfessionalChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                disabled={!serviceId}
              >
                <option value="">Escoja el profesional</option>
                {professionalsOptions?.map((option) => (
                  <option key={option.person_id} value={option.person_id}>
                    {option.first_name} {option.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 w-full">
                <h6 className="grow">Paciente</h6>
              </div>
              <select
                value={clientId || ""}
                onChange={handleClientChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Escoja el paciente</option>
                {allClients?.map((option) => (
                  <option key={option.person_id} value={option.person_id}>
                    {option.person.first_name} {option.person.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm my-4 text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-2 w-full mt-8">
            <Button variant="contained" onClick={handleToPay}>
              Proceder a pagar
            </Button>
          </div>
        </FormControl>
      </div>

      {/* Div derecho - calendario */}
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DateCalendarValue
          availableSchedules={schedulesOptions}
          onScheduleSelect={setWorkerScheduleId}
        />
      </div>
    </div>
  );
}
