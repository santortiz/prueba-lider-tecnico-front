# 🍽️ Sistema de Reservas Inteligente – Frontend

Este proyecto corresponde al frontend del sistema de gestión de reservas para restaurante desarrollado como prueba técnica para el rol de **Líder Técnico**.

El sistema permite:

- A los clientes hacer reservas según fecha, hora y número de invitados.
- A los meseros gestionar el estado de las mesas en tiempo real.
- A los usuarios autenticarse vía JWT y navegar entre las distintas vistas.

---

## 🛠️ Tecnologías utilizadas

| Herramienta      | Propósito                              |
| ---------------- | --------------------------------------- |
| React + Vite     | Framework moderno y ágil para frontend |
| TypeScript       | Tipado estático para mayor robustez    |
| TailwindCSS      | Estilos rápidos y consistentes         |
| Axios            | Cliente HTTP para consumir API REST     |
| React Router DOM | Navegación entre vistas                |
| lucide-react     | Íconos modernos y accesibles           |

---

## 🚀 Funcionalidades principales

### 🧑‍🍳 Interfaz Cliente (http://localhost:5173/reservation)

- Formulario de reserva con validaciones.
- Lógica condicional:
  - Si invitados ≤ 6 → asignación automática de mesa.
  - Si invitados > 6 → selección visual de mesa agrupada por salón.
- Confirmación con opción de correo.
- Vista profesional, centrada y con fondo visual llamativo.

### 👨‍🍳 Panel del Mesero (http://localhost:5173/dashboard)

- Requiere autenticación.
- Vista tipo dashboard con tarjetas de mesas.
- Cambios de estado:
  - Walk-in → Mesa libre a ocupada
  - Finalizar → Mesa ocupada a libre
- Estilo visual moderno y responsive.

### 🔐 Autenticación

- Usuario administrador predeterminado: admin@resto.com / admin123
- Usuario mesero predeterminado: waiter@resto.com / waiter123
  Formulario estilizado con fondo gráfico.
- Uso de JWT para acceso.
- Cierre de sesión (Logout) con limpieza de token y redirección.
- Condicionales de navegación basados en autenticación.

---

## 📁 Estructura de Carpetas

```
src/
├── assets/           # Imágenes como fondo de login
├── components/       # Layout con barra de navegación
├── pages/            # Login, Dashboard, Reserva
├── services/         # Axios configurado con token
├── utils/            # Utilidades como logout, sesión
├── App.tsx           # Definición de rutas
├── main.tsx          # Punto de entrada principal
```

---

## 🔧 Instalación y ejecución

### 1. Clonar el proyecto

```bash
git clone <REPO_URL>
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

Accede a: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Configuración esperada del backend

El backend debe estar disponible en:

```
http://localhost:8000
```

Y debe implementar los endpoints definidos en la documentación (`/auth/login`, `/tables`, `/reservations`, etc.).

---

## ✨ To Do / Mejoras Futuras

- Protección real de rutas privadas
- Validaciones más avanzadas con toasts
- Vista de plano gráfico con SVG para salones
- Soporte móvil completo

---

## 🧠 Autor

Prueba técnica desarrollada por Santiago Ortiz como parte del proceso de selección para Líder Técnico.
