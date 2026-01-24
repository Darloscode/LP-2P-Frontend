import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "@typesRequest/RegisterUser";
import { getUser } from "@/utils/utils";
import { fetchUsers, register, updateUser } from "@/API/auth";
import Box from "@mui/material/Box";
import UserFormAdmin from "@admin/UserFormAdmin";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid";
import Success from "@components/Success";
import { PersonResponse } from "@/typesResponse/PersonResponse";

interface FormViewProps {
  isEdit: boolean;
  user_id?: number;
}

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

export default function FormViewAdmin({ isEdit, user_id }: FormViewProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const [roleSelect, setRoleSelect] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

  const [userData, setUserData] = useState<RegisterUser>();

  const handleNext = (data: RegisterUser) => {
    setUserData((prev) => ({ ...prev, ...data }));
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  const navigate = useNavigate();

  const formatUserCreate = (data: any): RegisterUser => {
    if (Number(data.role_id) === 2) {
      return {
        email: data.email,
        password: data.password,
        role_id: Number(data.role_id),
        status: 1,

        first_name: data.first_name,
        last_name: data.last_name,
        birthdate: data.birthdate,
        gender: Number(data.gender),
        occupation: Number(data.occupation),
        marital_status: Number(data.marital_status),
        education: Number(data.education),
        phone: data.phone,
        country_id: 1,

        identification_number: data.identification_number,

        specialty: data.specialty,
        title: data.title,

        created_by: "system",
      };
    }
    return {
      email: data.email,
      password: data.password,
      role_id: Number(data.role_id),
      status: 1,

      first_name: data.first_name,
      last_name: data.last_name,
      birthdate: data.birthdate,
      gender: Number(data.gender),
      occupation: Number(data.occupation),
      marital_status: Number(data.marital_status),
      education: Number(data.education),
      phone: data.phone,
      country_id: 1,

      identification_number: data.identification_number,

      created_by: "system",
    };
  };

  const formatUserEdit = (data: any): RegisterUser => {
    if (Number(data.role_id) === 2) {
      return {
        email: data.email,
        password: data.password,
        role_id: Number(data.role_id),
        status: 1,

        first_name: data.first_name,
        last_name: data.last_name,
        birthdate: data.birthdate,
        gender: Number(data.gender),
        occupation: Number(data.occupation),
        marital_status: Number(data.marital_status),
        education: Number(data.education),
        phone: data.phone,
        country_id: 1,

        identification_number: data.identification_number,

        specialty: data.specialty,
        title: data.title,

        created_by: "system",
      };
    }
    return {
      email: data.email,
      password: data.password,
      role_id: Number(data.role_id),
      status: 1,

      first_name: data.first_name,
      last_name: data.last_name,
      birthdate: data.birthdate,
      gender: Number(data.gender),
      occupation: Number(data.occupation),
      marital_status: Number(data.marital_status),
      education: Number(data.education),
      phone: data.phone,
      country_id: 1,

      identification_number: data.identification_number,

      created_by: "system",
    };
  };

  const handleFinalSubmit = async (data: RegisterUser) => {
    const fullData = { ...userData, ...data };
    setLoad(true);
    if (isEdit && user_id) {
      const userEdit = formatUserEdit(fullData);
      await updateUser(user_id, userEdit);
      await fetchUsers();
    } else {
      const userRegister = formatUserCreate(fullData);
      await register(userRegister);
      await fetchUsers();
    }
    setLoad(false);
    handleOpen();
  };

  let stepsFields = [];
  if (roleSelect === 2) {
    stepsFields = [
      { start: 0, end: 6 },
      { start: 6, end: 13 },
      { start: 13, end: 16 },
    ];
  } else {
    stepsFields = [
      { start: 0, end: 6 },
      { start: 6, end: 11 },
      { start: 11, end: 13 },
    ];
  }

  if (isEdit) {
    if (user_id) {
      const user: PersonResponse = getUser(user_id);
      if (user.user_account.role_id === 2) {
        stepsFields = [
          { start: 0, end: 6 },
          { start: 6, end: 13 },
          { start: 13, end: 16 },
        ];
      } else {
        stepsFields = [
          { start: 0, end: 6 },
          { start: 6, end: 11 },
          { start: 11, end: 13 },
        ];
      }
      if (roleSelect === 2) {
        stepsFields = [
          { start: 0, end: 6 },
          { start: 6, end: 13 },
          { start: 13, end: 16 },
        ];
      } else {
        stepsFields = [
          { start: 0, end: 6 },
          { start: 6, end: 11 },
          { start: 11, end: 13 },
        ];
      }
    }
  }

  return (
    <Box>
      <Grid container rowSpacing={1}>
        <Grid size={12} className="contenedor-principal">
          <Steps activeStep={step} steps={stepsName} />
        </Grid>
        <Grid size={12}>
          <UserFormAdmin
            isEditMode={isEdit}
            start={stepsFields[step].start}
            end={stepsFields[step].end}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinalSubmit}
            isLast={step === totalSteps - 1}
            userId={user_id}
            onRoleChange={setRoleSelect}
            load={load}
          />
        </Grid>
      </Grid>
      <Success
        open={open}
        handleClose={handleClose}
        isRegister={true}
        message={
          isEdit
            ? "Se ha actualizado con éxito!!"
            : "Se ha registrado con éxito!!"
        }
      />
      ;
    </Box>
  );
}
