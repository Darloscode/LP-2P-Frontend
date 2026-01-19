<p align="center">
  <a href="https://react.dev" target="_blank">
    <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" width="120" alt="React Logo">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://vitejs.dev" target="_blank">
    <img src="https://vitejs.dev/logo.svg" width="120" alt="Vite Logo">
  </a>
</p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.x-blue" alt="React Version"></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-5.x-purple" alt="Vite Version"></a>
  <a href="https://mui.com"><img src="https://img.shields.io/badge/MUI-5.x-blueviolet" alt="Material UI"></a>
  <a href="#"><img src="https://img.shields.io/badge/API-REST-success" alt="API REST"></a>
</p>

## General

Este repositorio contiene el **frontend del proyecto LP-P2**, desarrollado con **React** y **Vite**, el cual consume el backend expuesto como **API REST** en Laravel.

Incluye:
- Autenticación mediante **token (JWT / Sanctum)**
- Gestión de servicios
- Gestión de citas
- Interfaz basada en **Material UI**
---

## Especificaciones

- **React** 18.x  
- **Vite** 5.x  
- **TypeScript**
- **Material UI (MUI)**  
- **Axios**
- **React Router DOM**

---

## Requerimientos

Antes de iniciar, asegúrate de tener instalado:

- Node.js ≥ 18
- npm ≥ 9
- Git

### Backend requerido

Para el correcto funcionamiento del frontend, el backend debe estar activo en:
http://127.0.0.1:8000/


---

## Installation

```bash
### 1. Clonar repositorio
git clone https://github.com/Darloscode/LP-2P-Frontend.git
cd LP-2P-Frontend

### 2. Instalar dependencias
npm install

## ⚠️ En caso de conflicto de dependencias:
npm install --force
```

## Desplegar el frontend
```bash
npm run dev
```

# Flujo Recomendado para prueba local

```bash
## Iniciar el backend

php artisan serve


## Iniciar el frontend

npm run dev


## Abrir la aplicación

http://localhost:5173/app
```



