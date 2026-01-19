import axios from "axios";
import apiURL from "./apiConfig";
import { UserLogin } from "@/types/UserLogin";
import { setAuthenticatedUser } from "@store";
import { RegisterUser } from "@typesRequest/RegisterUser";
import { PersonResponse } from "@/typesResponse/PersonResponse";

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${apiURL}/login`,
    { email, password },
    { headers: { "Content-Type": "application/json" } },
  );

  if (!response) {
    throw new Error("Credenciales incorrectas");
  }
  const data = response.data;
  localStorage.setItem("token", data.token);
  await StoreUser();
  return data;
};

export const StoreUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");
  const response = await axios.get(`${apiURL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userLogin: UserLogin = response.data;
  setAuthenticatedUser(userLogin);
  return userLogin;
};

export const register = async (userRegister: RegisterUser) => {
  try {
    await axios.post(`${apiURL}/register`, userRegister);
  } catch (error) {
    console.error("Error al agregar persona:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: number,
  userUpdate: Partial<RegisterUser>,
) => {
  try {
    await axios.put(`${apiURL}/update-user/${userId}`, userUpdate);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${apiURL}/persons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.setItem("persons", JSON.stringify(response.data));
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};
