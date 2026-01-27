import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputServiceConfig } from "@/config/serviceFormConfig";
import { ServiceResponse } from "src/typesResponse/ServiceResponse";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import UserInput from "@forms/UserInput";
import Success from "@components/Success";
import CircularProgress from "@mui/material/CircularProgress";
import { ServiceRequest } from "@/typesRequest/ServiceRequest";
import axios from "axios";
import { createService, updateService } from "@/API/auth";
import apiURL from "@/API/apiConfig";
/*
Formulario de creación y edición de servicios
*/
interface ServiceFormProps {
  isEditMode: boolean; //Define si el formulario debe comportarse como edición o creación
  serviceId?: number; //El id del servicio a editar, si es que aplica
}

export default function ServiceForm({
  isEditMode,
  serviceId,
}: ServiceFormProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fail, setFail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false); // 🆕 Estado para la carga de datos en edición
  const [services, setServices] = useState<ServiceResponse[]>([]);

  const handleClose = () => {
    setOpen(false);
    if (!isError) {
      navigate("/servicios");
    }
  };

  const methods = useForm<ServiceResponse>();

  useEffect(() => {
    setIsLoading(true); // Activar carga mientras busca los datos
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); 

        const response = await axios.get(`${apiURL}/services`, {
          //Hace un get de los servicios disponibles
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const serviceList: ServiceResponse[] = response.data;
        setServices(serviceList);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (isEditMode && serviceId) { //Si es que el formulario está en modo edicion
      setIsLoadingData(true); // Activar carga mientras busca los datos
      const service = services.find((s) => s.service_id === serviceId); //Busca el servicio a editar
      if (service) {
        methods.reset({ //Deja los datos vacios para poder cambiarlos a los deseados
          name: service.name,
          price: service.price,
        });
      }
      setIsLoadingData(false); // Desactivar carga cuando termine
    } else {
      methods.reset({
        name: "",
        price: 0,
      });
    }
  }, [isEditMode, serviceId, services, methods]);

  const list_inputs = inputServiceConfig.map((input) => (
    <UserInput
      label={input.label}
      key={input.key}
      type={input.type}
      id={input.key}
      validation={input.validation}
    />
  ));

  const onClickSave = methods.handleSubmit(async (data) => {
    try {
      setLoadingSave(true);
      if (isEditMode && serviceId) {
        const transformedData: ServiceResponse = data;
        await updateService(serviceId, transformedData); //Envia el nuevo servicio modificado
        setIsError(false);
        setFail(false);
        setOpen(true);
      }
    } catch (error) {
      console.error("Error al guardar el servicio:", error);
      setFail(true);
      setMessage("Ocurrió un error al guardar el servicio.");
      setIsError(true);
      setOpen(true);
    } finally {
      setLoadingSave(false);
    }
  });

  const onClickCreate = methods.handleSubmit(async (data) => {
    try {
      setLoadingSave(true);
      const transformedData: ServiceRequest = data;
      await createService(transformedData); //Envia el nuevo servicio modificado
      setMessage("¡Se ha creado con éxito!");
      setIsError(false);
      setFail(false);
      setOpen(true);
    } catch (error: any) {
      console.error("❌ Error en onClickCreate:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errors = error.response.data?.errors;

        if (errors?.name?.length) {
          setMessage(`⚠ Este servicio ya ha sido registrado`);
          setFail(true);
          setIsError(true);
        } else {
          setMessage("Ocurrió un error al guardar el servicio.");
          setIsError(true);
        }
        setOpen(true);
      } else {
        setMessage("Error desconocido.");
        setOpen(true);
      }
    } finally {
      setLoadingSave(false);
    }
  });

  // Mostrar loading mientras carga la lista inicial de servicios
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  // Mostrar loading mientras carga los datos en modo edición
  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full h-full p-6"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {list_inputs}
          </div>
        </div>
        <div className="gap-10 mt-4 flex flex-row items-center justify-center">
          {!isEditMode &&
            (loadingSave ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                onClick={onClickCreate}
                className="md:w-[250px]"
              >
                Crear
              </Button>
            ))}
          {isEditMode &&
            (loadingSave ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                onClick={onClickSave}
                className="md:w-[250px]"
              >
                Guardar
              </Button>
            ))}
        </div>
      </form>
      <Success
        open={open}
        handleClose={handleClose}
        isRegister={false}
        message={message}
        fail={fail}
      />
    </FormProvider>
  );
}
