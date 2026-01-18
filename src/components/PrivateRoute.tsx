/*
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
*/
// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
//import { getAuthenticatedUserRole } from "@/utils/store";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  //const role = getAuthenticatedUserRole() as "admin";
  //if (!role) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default PrivateRoute;
