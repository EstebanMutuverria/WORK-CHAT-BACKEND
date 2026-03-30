# TP Integrador Slack - Backend

Este proyecto es el backend de una aplicación estilo "Slack", desarrollada como Trabajo Práctico Integrador para la Diplomatura Full-Stack (UTN). Proporciona una API RESTful para gestionar usuarios, espacios de trabajo (workspaces), canales y mensajes en tiempo real, junto con un sistema completo de autenticación y verificación mediante correo electrónico.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework minimalista para la creación de APIs y manejo de rutas.
- **MongoDB**: Base de datos NoSQL orientada a documentos.
- **Mongoose**: ODM (Object Data Modeling) para modelar los esquemas de la base de datos de MongoDB.
- **JSON Web Token (JWT)**: Manejo de autenticación, autorización y reseteo de contraseñas de manera segura y sin estado (stateless).
- **Bcrypt**: Encriptación de contraseñas antes de guardarlas en la base de datos.
- **Nodemailer**: Envío de correos electrónicos (verificación de cuentas, reseteo de contraseñas).
- **Dotenv**: Carga de variables de entorno desde un archivo `.env`.

## Estructura del Proyecto

El código fuente está estructurado de acuerdo al patrón de diseño de arquitectura en capas, separando responsabilidades:

```text
src/
├── config/              # Configuraciones de entorno, MongoDB y Nodemailer
├── controllers/         # Controladores (procesan las peticiones y devuelven respuestas HTTP)
├── helper/              # Clases de ayuda, manejo de errores personalizados (ServerError)
├── models/              # Modelos de Mongoose (Esquemas de la Base de Datos)
├── repository/          # Repositorios (Capa de abstracción que interactúa con Mongoose)
├── routes/              # Definición de rutas y endpoints de Express
├── service/             # Servicios y lógica de negocio (validaciones, envío de correos, transacciones)
└── main.js              # Punto de entrada principal (Entry point) y servidor Express
```

## Requisitos Previos

Asegúrate de tener instalado en tu máquina lo siguiente:
- [Node.js](https://nodejs.org/) (v14 o superior recomendado)
- [MongoDB](https://www.mongodb.com/) (Local o cuenta en MongoDB Atlas)

## Instalación y Configuración

1. **Clona el repositorio** o descarga el código fuente en tu entorno local.
2. **Instala las dependencias** abriendo una terminal en la raíz del proyecto y ejecutando:
   ```bash
   npm install
   ```
3. **Configura el entorno**. Crea un archivo `.env` en la raíz del proyecto basándote en un posible archivo de ejemplo o bien define las siguientes variables obligatorias:
   ```env
   PORT=3000
   MONGO_DB_CONNECTION_STRING=tu_cadena_de_conexion_a_mongodb
   MAIL_USER=tu_correo_ejemplo@gmail.com
   MAIL_PASSWORD=tu_contrasena_de_aplicacion_correo
   URL_BACKEND=http://localhost:3000
   JWT_SECRET_KEY=tu_clave_secreta_super_segura
   ```

## Uso

Para arrancar el proyecto en un entorno de desarrollo, puedes configurar un script o ejecutar directamente el main:

```bash
node src/main.js
```

Una vez que el servidor esté corriendo, la consola mostrará: 
`El servidor esta corriendo en el puerto: [PUERTO]`

## Endpoints Principales

La API cuenta con las siguientes rutas base documentadas también en línea mediante JSDoc en el código.

### Autenticación (`/api/auth`)
- **`POST /register`**: Registra un nuevo cuenta y manda mail de confirmación. Requiere `email`, `user_name` y `password`.
- **`POST /login`**: Autenticación de un usuario usando `email` y `password`. Devuelve el Token (JWT).
- **`GET /verify-email`**: Verifica el email en base al token (`verify_email_token`) obtenido como parámetro URL de la query.
- **`POST /reset-password-request`**: Genera una solicitud de recuperación de clave y manda un correo. Requiere el `email`.
- **`POST /reset-password/:reset_token`**: Guarda la nueva `password` verificando el token en el enlace.

### Estado (`/api/health`)
- **`GET /`**: Devuelve estado de vida de la API.
- **`GET /database`**: Realiza una pequeña consulta en base de datos para asegurar el vínculo.

## Documentación del Código

Todo el código fuente en la carpeta `src` está completamente documentado utilizando convenciones estándar de **JSDoc**. Esto permite que la base de código sea descriptiva y genere hints en la gran mayoría de IDEs (como VS Code) al sobrevolar métodos, parámetros o clases, explicando detalladamente responsabilidades en cada bloque.
