# 🧹 Proyecto Registro LyD - Frontend

Frontend del sistema **Registro LyD**, desarrollado con **React.js** y **Material-UI**, que permite gestionar el flujo de autenticación, paneles de administración y operadores para la aplicación de control de limpieza.

## 🚀 Tecnologías principales

* [React 18](https://reactjs.org/)
* [React Router v6](https://reactrouter.com/en/main)
* [Material-UI (MUI)](https://mui.com/)
* [Axios](https://axios-http.com/)
* [Day.js](https://day.js.org/)
* [Three.js](https://threejs.org/)
* [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
* [OGL](https://github.com/oframe/ogl)
* [Web Vitals](https://web.dev/vitals/)


## 🛠️ Instalación y configuración

```bash
# Entrar al directorio frontend
cd Proyecto-RegistroLyD/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (.env)

# Iniciar en desarrollo
npm start
```

## 📌 Notas

* Este proyecto se comunica con un **backend en Node.js + Express + PostgreSQL**.
* Se recomienda usar **Docker Compose** para levantar la base de datos y API.

## ⚙️ Scripts disponibles

```bash
npm start
```
Inicia la aplicación en modo desarrollo en [http://localhost:3000](http://localhost:3000).


```bash
npm run build
```
Construye la aplicación para producción en la carpeta `build/`.

## 🔑 Variables de entorno


Crea un archivo `.env` basado en el ejemplo:

```bash
cp .env.example .env
```

Ejemplo de variables:

```env
# API Configuration (Backend URL)
REACT_APP_API_URL=http://localhost:5000

# Environment
REACT_APP_ENV=development

# App Configuration
REACT_APP_NAME="Sistema de Registro de Limpieza UPB"
REACT_APP_VERSION=1.0.0

# Debug Mode (para mostrar usuarios de prueba)
REACT_APP_DEBUG=true

# PWA Configuration
REACT_APP_ENABLE_SW=true

# Branding
REACT_APP_UPB_NAME="Universidad Pontificia Bolivariana"
REACT_APP_COMPANY_NAME="A&S Servicios"
```
## 

Pasos para construir y correr

Genera el build de React:

npm run build


(Opcional) Si el Dockerfile usa dist/, renombra el build o ajusta el Dockerfile:

mv build dist


Construye la imagen Docker:

docker build -t registro-lyd-frontend .


Ejecuta el contenedor:

docker run -d -p 80:80 --name registro-lyd-frontend registro-lyd-frontend


Abre en el navegador:

http://localhost


Ver logs si es necesario:

docker logs -f registro-lyd-frontend


## 👥 Roles y funcionalidades

* **Administrador**

  * Acceso al dashboard de administración
  * Gestión de usuarios y reportes

* **Operador**

  * Acceso al panel de control operativo
  * Registro de actividades y consultas rápidas

* **Usuarios no autenticados**

  * Acceso a Login y Registro
