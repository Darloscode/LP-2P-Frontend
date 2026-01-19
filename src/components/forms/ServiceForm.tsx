import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputServiceConfig } from "@/config/serviceFormConfig";
import { Service } from "src/types/Service";
import { useNavigate } from "react-router-dom";
import UserInput from "@forms/UserInput";
import SaveButton from "@buttons/SaveButton";
import CreationButton from "@buttons/CreationButton";
import Success from "@components/Success";
import Progress from "@components/Progress";
import { getService } from "@/utils/utils";
import { ServiceRequest } from "@typesRequest/ServiceRequest";
import axios from "axios";
import apiURL from "@/API/apiConfig";

interface ServiceFormProps {
  isEditMode: boolean;
  serviceId?: number;
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
  const data: any = [];

  const handleClose = () => {
    setOpen(false);
    if (!isError) {
      navigate("/servicios");
    }
  };

  const methods = useForm<Service>();

  useEffect(() => {
    if (isEditMode && serviceId) {
      const service = getService(serviceId);
      if (service) {
        methods.reset({
          name: service.name,
          price: service.price,
        });
      }
    } else {
      methods.reset({
        name: "",
        price: 0,
      });
    }
  }, []);

  const list_inputs = inputServiceConfig.map((input) => (
    <UserInput
      label={input.label}
      key={input.key}
      type={input.type}
      id={input.key}
      validation={input.validation}
    />
  ));

  // TODO in a diff file
  const onClickSave = methods.handleSubmit(async (data) => {
    try {
      setLoadingSave(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiURL}/services/${serviceId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("¡Se ha actualizado con éxito!");
      setIsError(false);
      setFail(false);
      setOpen(true);
      
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
      const token = localStorage.getItem("token");
      await axios.post(
        `${apiURL}/services`,
        data,
        {headers: { Authorization: `Bearer ${token}`}}
      );

      setMessage("¡Servicio creado con éxito!");
      setOpen(true);
      
    } catch (error: any) {
      console.error("❌ Error en onClickCreate:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errors = error.response.data?.errors;

        if (errors?.name?.length) {
          // Nombre ya registrado
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
      setLoadingSave(false); // Termina la bolita de cargando
    }
  });

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
              <Progress />
            ) : (
              <CreationButton onClick={onClickCreate} text="Crear" />
            ))}
          {isEditMode &&
            (loadingSave ? (
              <Progress />
            ) : (
              <SaveButton onClick={onClickSave} text="Guardar" />
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
