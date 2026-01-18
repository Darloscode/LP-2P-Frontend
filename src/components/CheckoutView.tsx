import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { FileData } from "@/types/FileData";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PaymentForm from "@/components/PaymentForm";
import Review from "@components/Review";
import Steps from "@components/Steps";
import Divider from "@mui/material/Divider";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import Success from "@components/Success";
import { uploadToCloudinary } from "@/utils/utils";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import apiURL from "@/API/apiConfig";
import axios from "axios";
import { AppointmentRequest } from "@/typesRequest/AppointmentRequest";

const steps = ["Detalles de Pago", "Revisar cita"];

export default function CheckoutView() {
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceResponse>();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial
  const [isSaving, setIsSaving] = useState(false); // Estado de guardado

  const { serviceId, workerScheduleId, clientId } = useParams();

  const parsedServiceId = parseInt(serviceId || "", 10);
  const parsedWorkerScheduleId = parseInt(workerScheduleId || "", 10);
  const parsedClientId = parseInt(clientId || "", 10);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");
      try {
        setIsLoading(true);

        const [servicesData] = await Promise.all([
          axios.get(`${apiURL}/services`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const services: ServiceResponse[] = servicesData.data;
        const service = services.find((s) => s.service_id === parsedServiceId);
        setService(service);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [parsedServiceId]);

  const handleOpen = async () => {
    if (file != null && service != null) {
      setIsSaving(true);

      try {
        // Subir a Cloudinary
        const uploadedFileUrl = await uploadToCloudinary(file);

        const dataSend: AppointmentRequest = {
          service_id: parsedServiceId,
          client_id: parsedClientId,
          scheduled_by: parsedClientId, // o el ID del usuario logueado
          worker_schedule_id: parsedWorkerScheduleId,
          payment_status_id: 1,
          appointment_status_id: 1,
          payment_file: uploadedFileUrl,
          created_by: "system",
        };

        const token = localStorage.getItem("token");

        await axios.post(`${apiURL}/appointments`, dataSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        console.log("Appointment created successfully");
        setActiveStep(activeStep + 1);
        setOpen(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("Error de validación:", error.response?.data);
          alert("Error al crear la cita. Por favor intente nuevamente.");
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      console.error("File is null or missing data");
      alert("Por favor suba el comprobante de pago");
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PaymentForm
            service={service!}
            setIsValid={setIsPaymentValid}
            setFile={setFile}
          />
        );
      case 1:
        return <Review service={service!} />;
      default:
        throw new Error("Unknown step");
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleBackPage = () => {
    navigate(-1);
  };

  // Mostrar loading mientras se cargan los datos iniciales
  if (isLoading) {
    return (
      <Box
        className="box-panel-control"
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Si no se encuentra el servicio después de cargar
  if (!service) {
    return (
      <Box className="box-panel-control" sx={{ padding: 2 }}>
        <Typography variant="h5" color="error">
          Servicio no encontrado
        </Typography>
        <Button onClick={handleBackPage} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1} className="contenedor-principal">
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9}>
              <Typography variant="h3">Pagar</Typography>
            </Grid>
            <Grid size={3} display="flex" justifyContent="flex-end">
              <Button
                onClick={handleBackPage}
                variant="outlined"
                startIcon={<ReplyRoundedIcon />}
                className="guardar"
              >
                Volver
              </Button>
            </Grid>
          </Grid>
          <Divider className="divider-paciente-historial"></Divider>
        </Grid>
        <Grid size={12} className="contenedor-principal">
          <Steps activeStep={activeStep} steps={steps} />
        </Grid>
        <Grid size={12} className="contenedor-principal">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 1, md: "none" },
            }}
          >
            {activeStep === steps.length ? (
              <Success
                open={open}
                handleClose={handleClose}
                isRegister={false}
                message={"Cita registrada con éxito"}
              />
            ) : (
              <Fragment>
                {getStepContent(activeStep)}
                <Box
                  sx={[
                    {
                      display: "flex",
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      alignItems: "end",
                      flexGrow: 1,
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                    },
                    activeStep !== 0
                      ? { justifyContent: "space-between" }
                      : { justifyContent: "flex-end" },
                  ]}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{ display: { xs: "none", sm: "flex" } }}
                      disabled={isSaving}
                    >
                      Previous
                    </Button>
                  )}

                  {activeStep === 0 && (
                    <Button
                      variant="contained"
                      endIcon={<ChevronRightRoundedIcon />}
                      onClick={handleNext}
                      disabled={!isPaymentValid}
                      sx={{ width: { xs: "100%", sm: "fit-content" } }}
                    >
                      Next
                    </Button>
                  )}

                  {activeStep === 1 && (
                    <Button
                      variant="contained"
                      onClick={handleOpen}
                      disabled={isSaving}
                      sx={{ width: { xs: "100%", sm: "fit-content" } }}
                    >
                      {isSaving ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        "Finalizar"
                      )}
                    </Button>
                  )}
                </Box>
              </Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
