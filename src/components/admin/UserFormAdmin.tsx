import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import Button from "@mui/material/Button";
import UserInput from "@forms/UserInput";
import axios from "axios";
import apiURL from "@/API/apiConfig";
import CircularProgress from "@mui/material/CircularProgress";
import { RegisterUser } from "@/typesRequest/RegisterUser";
import { PersonResponse } from "@/typesResponse/PersonResponse";

interface UserFormProps {
  isEditMode: boolean;
  userId?: number;
  start: number;
  end: number;
  onNext: (data: RegisterUser) => void;
  onBack: () => void;
  onFinish: (data: RegisterUser) => void;
  isLast?: boolean;
  onRoleChange?: (roleId: number) => void;
  load?: boolean;
}

// Funciones traductoras de string a number
const translateGender = (gender: string): number => {
  const genderMap: { [key: string]: number } = {
    Masculino: 1,
    Femenino: 2,
  };
  return genderMap[gender] || 0;
};

const translateOccupation = (occupation: string): number => {
  const occupationMap: { [key: string]: number } = {
    Doctor: 1,
    Enfermero: 2,
    Ingeniero: 3,
    Estudiante: 4,
  };
  return occupationMap[occupation] || 0;
};

const translateMaritalStatus = (maritalStatus: string): number => {
  const maritalStatusMap: { [key: string]: number } = {
    Soltero: 1,
    Casado: 2,
    Divorciado: 3,
  };
  return maritalStatusMap[maritalStatus] || 0;
};

const translateEducation = (education: string): number => {
  const educationMap: { [key: string]: number } = {
    Secundaria: 1,
    Pregrado: 2,
    Postgrado: 3,
  };
  return educationMap[education] || 0;
};

export default function UserFormAdmin({
  isEditMode,
  userId,
  start,
  end,
  onNext,
  onBack,
  onFinish,
  isLast,
  onRoleChange,
  load,
}: UserFormProps) {
  const methods = useForm<RegisterUser>();
  const [users, setUsers] = useState<PersonResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para obtener la lista de usuarios
  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${apiURL}/persons`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.setItem("persons", JSON.stringify(response.data));

        const userList: PersonResponse[] = response.data;

        setUsers(userList);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (isEditMode && users.length > 0) {
      const user = users.find((u) => u.person_id === userId);
      if (user) {
        methods.reset({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          identification_number: user.identification,
          phone: user.phone,
          birthdate: user.birthdate,
          gender: translateGender(user.gender),
          occupation: translateOccupation(user.occupation),
          marital_status: translateMaritalStatus(user.marital_status),
          education: translateEducation(user.education),
          role_id: user.user_account.role_id,
          title: user.professional_info?.title,
          specialty: user.professional_info?.specialty,
        });
      }
    } else if (!isEditMode) {
      methods.reset({
        first_name: "",
        last_name: "",
        email: "",
        birthdate: "",
        title: "",
        specialty: "",
      });
    }
  }, [isEditMode, userId, users]);

  const roleSelect = Number(methods.watch("role_id") ?? 0);

  useEffect(() => {
    if (onRoleChange) {
      onRoleChange(roleSelect);
    }
  }, [roleSelect]);

  const filteredInputs = inputCreateUserAdminConfig.filter((input) => {
    const isExtraField = ["title", "specialty"].includes(input.key);
    return !(isExtraField && roleSelect !== 2);
  });

  const list_inputs = filteredInputs.slice(start, end).map((input) => (
    <UserInput
      key={input.key}
      label={input.label}
      type={input.type}
      id={input.key}
      validation={
        input.key === "confirmPassword"
          ? {
              ...input.validation,
              validate: (value: string) =>
                value === methods.getValues("password") ||
                "Las contraseñas no coinciden",
            }
          : input.validation
      }
      options={input.options}
    />
  ));

  const onSubmit = methods.handleSubmit((data) => {
    if (isLast) {
      onFinish(data);
    } else {
      onNext(data);
    }
  });

  const getButtonLabel = () => {
    if (isLast) {
      return isEditMode ? "Guardar" : "Crear";
    }
    return "Siguiente";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        noValidate
        className="flex flex-col w-full h-full p-6"
      >
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {list_inputs}
          </div>
        </div>
        <div className="gap-10 mt-4 flex flex-row items-center justify-center">
          {start != 0 && (
            <Button
              variant="outlined"
              onClick={onBack}
              className="md:w-[250px]"
            >
              Anterior
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            onClick={onSubmit}
            className="md:w-[250px]"
          >
            {load ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              getButtonLabel()
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
