import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "@/API/auth";
import { RegisterUser } from "@/typesRequest/RegisterUser";
import Box from "@mui/material/Box";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid";
import Success from "@components/Success";
import FormRegister from "@components/FormRegister";

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

export default function RegisterView() {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState<RegisterUser>();
  const [roleSelect, setRoleSelect] = useState<number>(0);

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
    navigate("/app");
  };

  const navigate = useNavigate();

  const formatUserAccount = (data: any): RegisterUser => {
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

      identification_number: data.identification_number,

      created_by: "system",
    };
  };

  const handleFinalSubmit = async (data: RegisterUser) => {
    const fullData = { ...userData, ...data };
    const userRegister = formatUserAccount(fullData);
    try {
      await register(userRegister);
      handleOpen();
    } catch (error) {
      console.error("Register failed:", error);
    }
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

  return (
    <Box>
      <Grid container rowSpacing={1}>
        <Grid size={12} className="contenedor-principal">
          <Steps activeStep={step} steps={stepsName} />
        </Grid>
        <Grid size={12}>
          <FormRegister
            start={stepsFields[step].start}
            end={stepsFields[step].end}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinalSubmit}
            isLast={step === totalSteps - 1}
            onRoleChange={setRoleSelect}
          />
        </Grid>
      </Grid>
      <Success
        open={open}
        handleClose={handleClose}
        isRegister={true}
        message={"Se ha registrado con éxito!!"}
      />
      ;
    </Box>
  );
}
