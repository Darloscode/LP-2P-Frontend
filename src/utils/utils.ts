import { ProfessionalServiceResponse } from "@/typesResponse/ProfessionalServiceResponse";
import { PaymentResponse } from "@/typesResponse/PaymentResponse";
import { PersonResponse } from "@/typesResponse/PersonResponse";
import { WorkerScheduleResponse } from "@/typesResponse/WorkerScheduleResponse";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import { AppointmentResponse } from "@/typesResponse/AppointmentResponse";
import { UserAccountResponse } from "@/typesResponse/UserAccountResponse";
import { PageViewsBarChartProps } from "@/components/admin/PageViewsBarChart";
import { StatCardProps } from "@/components/admin/StatCard";
import { CloudinaryUploadResponse } from "@/typesResponse/CloudinaryUploadResponse";
import { FileData } from "@/types/FileData";
import { ProfessionalOptionResponse } from "@/typesResponse/ProfessionalOptionResponse";

type TendenciaDiaria = {
  promedioPorcentual: number;
};

type TotalIngresosMensual = {
  total: number;
};

export function CalcularTendenciaDiaria(data: number[]): TendenciaDiaria {
  if (data.length < 2) {
    return {
      promedioPorcentual: 0,
    };
  }

  let sumaPorcentajes = 0;

  for (let i = 1; i < data.length; i++) {
    const actual = data[i];
    const anterior = data[i - 1];

    const cambio = actual - anterior;

    if (anterior !== 0) {
      const porcentaje = (cambio / anterior) * 100;
      sumaPorcentajes += porcentaje;
    }
  }

  const totalCambios = data.length - 1;

  return {
    promedioPorcentual: +(sumaPorcentajes / totalCambios).toFixed(2),
  };
}

export function TotalIngresosMensual(data: number[]): TotalIngresosMensual {
  return { total: data.reduce((total, numero) => total + numero, 0) };
}

export function getPerson(person_id: number, data: any): PersonResponse {
  const persons: PersonResponse[] = data.persons;
  const person = persons.find((person) => person.person_id === person_id);
  if (!person) throw new Error(`No se encontró la persona con ID ${person_id}`);
  return person;
}

export function getWorkerSchedule(
  worker_schedule_id: number,
  data: any,
): WorkerScheduleResponse {
  const workerschedules: WorkerScheduleResponse[] = data.workerSchedules;
  const workerschedule = workerschedules.find(
    (workerschedule) =>
      workerschedule.worker_schedule_id === worker_schedule_id,
  );
  if (!workerschedule)
    throw new Error(
      `No se encontró el worker schedule con ID ${worker_schedule_id}`,
    );
  return workerschedule;
}

export function getService(service_id: number): ServiceResponse {
  const servicesData = localStorage.getItem("services");
  const services: ServiceResponse[] = servicesData
    ? JSON.parse(servicesData)
    : [];
  const serviceFind = services.find(
    (service) => service.service_id === service_id,
  );
  if (!serviceFind)
    throw new Error(`No se encontró el worker schedule con ID ${service_id}`);
  return serviceFind;
}

export function getDataAppointment(data: any): PageViewsBarChartProps {
  const appointments: AppointmentResponse[] = data;
  const scheduled = Array(12).fill(0);
  const completed = Array(12).fill(0);
  const cancelled = Array(12).fill(0);

  appointments.forEach((appointment) => {
    const creationMonth = new Date(appointment.creation_date).getMonth(); // Obtenemos el mes (0-11)
    const statusName = appointment.status.name.toLowerCase(); // Obtenemos el estado de la cita (scheduled, completed, cancelled)

    if (statusName === "scheduled") {
      scheduled[creationMonth] += 1;
    } else if (statusName === "completed") {
      completed[creationMonth] += 1;
    } else if (statusName === "cancelled") {
      cancelled[creationMonth] += 1;
    }
  });

  const total = appointments.length; // Total de citas es la longitud de la lista de datos

  return {
    total,
    scheduled,
    completed,
    cancelled,
  };
}

export function getDataCard(
  usersData: any,
  appointmentsData: any,
): StatCardProps[] {
  const users: UserAccountResponse[] = usersData;
  const appointments: AppointmentResponse[] = appointmentsData;
  const today = new Date();

  const lastMonth = today.getMonth() - 1 < 0 ? 11 : today.getMonth() - 1;
  const lastMonthYear =
    today.getMonth() - 1 < 0 ? today.getFullYear() - 1 : today.getFullYear();

  const daysInLastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();

  function countMonthDays<T>(
    items: T[],
    getDate: (item: T) => string,
  ): number[] {
    const counts = Array(daysInLastMonth).fill(0);

    items.forEach((item) => {
      const date = new Date(getDate(item));
      if (
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear
      ) {
        const day = date.getDate() - 1;
        counts[day] += 1;
      }
    });

    while (counts.length < 31) {
      counts.push(0);
    }

    return counts;
  }

  const usuariosData = countMonthDays(users, (u) => u.creation_date);
  const citasData = countMonthDays(appointments, (c) => c.creation_date);
  const pacientesData = countMonthDays(
    users.filter((u) => u.role.role_id === 3),
    (u) => u.creation_date,
  );
  const inactivosData = countMonthDays(
    users.filter((u) => u.status.status_id === 2),
    (u) => u.creation_date,
  );

  return [
    {
      title: "Usuarios",
      value: usuariosData.reduce((a, b) => a + b, 0).toString(),
      interval: "Mes pasado",
      trend: "usuarios",
      data: usuariosData,
    },
    {
      title: "Citas",
      value: citasData.reduce((a, b) => a + b, 0).toString(),
      interval: "Mes pasado",
      trend: "citas",
      data: citasData,
    },
    {
      title: "Pacientes",
      value: pacientesData.reduce((a, b) => a + b, 0).toString(),
      interval: "Mes pasado",
      trend: "pacientes",
      data: pacientesData,
    },
    {
      title: "Usuarios inactivos",
      value: inactivosData.reduce((a, b) => a + b, 0).toString(),
      interval: "Mes pasado",
      trend: "inactivos",
      data: inactivosData,
    },
  ];
}

export function translateRol(rol: string): string {
  switch (rol.trim().toLowerCase()) {
    case "admin":
      return "Administrador";
    case "professional":
      return "Profesional";
    case "client":
      return "Cliente";
    case "staff":
      return "Secretario";
    default:
      return "Desconocido";
  }
}

export function toNumber(str: string): number {
  return Number(str);
}

export function getAppointmentByProfessional(
  proffesional_id: number,
  data: any,
): AppointmentResponse[] {
  if (!data) {
    return [];
  }

  const appointments: AppointmentResponse[] = data;

  if (proffesional_id === 0) {
    return appointments;
  }

  return appointments.filter(
    (appointment) => appointment.professional.person_id === proffesional_id,
  );
}

export function translateStatus(status: string): string {
  switch (status.trim().toLowerCase()) {
    case "scheduled":
      return "Agendado";
    case "completed":
      return "Completado";
    case "cancelled":
      return "Cancelado";
    case "pending":
      return "Pendiente";
    default:
      return "Desconocido";
  }
}

export function getOccupation(occupation: number): string {
  switch (occupation) {
    case 1:
      return "Doctor";
    case 2:
      return "Enfermero";
    case 3:
      return "Ingeniero";
    case 4:
      return "Estudiante";
    default:
      return "Desconocido";
  }
}

export function getAge(birthdate: string): number {
  const today = new Date();
  const [year, month, day] = birthdate.split("-").map(Number);
  let age = today.getFullYear() - year;

  // Ajustar si aún no ha cumplido años este año
  const mesActual = today.getMonth() + 1;
  const diaActual = today.getDate();
  if (mesActual < month || (mesActual === month && diaActual < day)) {
    age--;
  }

  return age;
}

export function getGender(gender: number): string {
  switch (gender) {
    case 1:
      return "Masculino";
    case 2:
      return "Femenino";
    default:
      return "Desconocido";
  }
}

export const uploadToCloudinary = async (file: FileData): Promise<string> => {
  const realFile = file!.file as File;
  const formData = new FormData();
  formData.append("file", realFile);
  formData.append("upload_preset", "aspy-web");

  formData.append("folder", "pdfs");

  const isPdf = realFile.type === "application/pdf";
  if (!isPdf && !realFile.type.startsWith("image/")) {
    throw new Error("Solo se permiten imágenes o PDFs.");
  }

  const resourceType = isPdf ? "raw" : "image";
  const url = `https://api.cloudinary.com/v1_1/dyqznwbdb/${resourceType}/upload`;

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error Cloudinary: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as CloudinaryUploadResponse;
    return data.secure_url;
  } catch (error: any) {
    console.error("Error subiendo a Cloudinary:", error.message);
    throw new Error("No se pudo subir el archivo a Cloudinary.");
  }
};

export function getUser(user_id: number): PersonResponse {
  const raw = localStorage.getItem("persons");

  if (!raw) {
    throw new Error("No hay personas en localStorage");
  }

  const data: PersonResponse[] = JSON.parse(raw);

  const user = data.find((u) => u.person_id === user_id);

  if (!user) {
    throw new Error(`Usuario con ID ${user_id} no encontrado`);
  }

  return user;
}

export function getPayments(data: any): PaymentResponse[] {
  return data.payments;
}

export function getProfessionalByService(
  serviceId: number,
  professionalServices: ProfessionalServiceResponse[],
): ProfessionalOptionResponse[] {
  if (!serviceId) return [];

  return professionalServices
    .filter((ps) => ps.service.service_id === serviceId)
    .map((ps) => ps.professional);
}

export function getScheduleByProfessional(
  professionalId: number,
  workerSchedules: WorkerScheduleResponse[],
): WorkerScheduleResponse[] {
  if (!professionalId) return [];

  return workerSchedules.filter(
    (ws) => ws.worker.person_id === professionalId && ws.is_available === true,
  );
}

export function getIncome(data: PaymentResponse[]): number[] {
  const income = Array(12).fill(0);

  data.forEach((payment) => {
    // Solo pagos efectivamente cobrados
    if (payment.status?.name !== "Paid") return;

    const date = new Date(payment.creation_date);
    const month = date.getMonth(); // 0 = Enero

    const amount = Number(payment.service?.price ?? 0);

    income[month] += amount;
  });

  return income;
}
