TODO App - Sistema de Gestión de Tareas 
## Descripción:
El proyecto consiste en un Sistema de Gestión de Tareas (todo-app), el cual permite a los usuarios visualizar, agregar, marcar como completadas y eliminar tareas a través de una interfaz web.
## Arquitectura: 
1. Frontend
•	Tecnología: Nginx sirve archivos estáticos (HTML5, CSS3, JavaScript Vanilla).
•	Propósito: Proporciona la Interfaz Web (UI) para el usuario.
•	Comunicación: Se comunica con el Backend a través de la Fetch API.
•	Puerto de Acceso: Expuesto externamente en el puerto 8080 (mapeado al puerto interno 80 del contenedor Nginx).
2. Backend
•	Tecnología: Una API REST desarrollada en Node.js con el framework Express.
•	Propósito: Contiene la lógica de negocio y maneja las peticiones CRUD (Crear, Leer, Actualizar, Eliminar) de las tareas.
•	Comunicación: Se conecta a la base de datos PostgreSQL usando el cliente pg.
•	Puerto Interno: Escucha internamente en el puerto 3000.
3. Base de Datos (DB)
•	Tecnología: Una base de datos PostgreSQL.
•	Propósito: Persistencia de datos para almacenar la información de las tareas en la tabla tasks.
•	Persistencia: Utiliza un Volumen Persistente (nombrado) para asegurar que los datos no se pierdan al eliminar o recrear el contenedor de la base de datos.
•	Puerto Interno: Escucha internamente en el puerto 5432
## Tecnologías: 
Backend: Node.js + Express + PostgreSQL 
Frontend: HTML + CSS + JavaScript + Nginx 
Orquestación: Docker + Docker Compose 
## Requisitos Previos:
Docker 20 
Docker Compose 2
Git 
## Instalación y Ejecución 
### 1. Clonar repositorio 
# Clona el proyecto desde GitHub
git clone git@github.com:ManuCeren/todo-app-laboratorio.git
# Navega al directorio raíz del proyecto
cd todo-app-laboratorio
### 2. Levantar servicios 
•	Interfaz de Usuario (Frontend): http://localhost:8080
•	API REST (Backend): http://localhost:3000
### 3. Acceder a la aplicación 
•	Interfaz de Usuario (Frontend): http://localhost:8080
•	API REST (Backend): http://localhost:3000
## Comandos Útiles 
•	docker-compose up -d: Construye y levanta todos los servicios en segundo plano.
•	docker-compose down: Detiene y elimina los contenedores, manteniendo los datos del volumen DB para un reinicio posterior.
•	docker-compose down -v: Detiene y elimina contenedores y el Volumen Persistente (borra todos los datos de la base de datos).
•	docker-compose ps: Muestra el estado actual de todos los servicios.
•	docker volume ls: Lista los volúmenes nombrados gestionados por Docker (debe aparecer el de la DB).
•	docker logs <nombre_servicio>: Muestra los logs de un servicio específico (ejemplo: todo-app_backend_1). 
## Estructura del Proyecto 
todo-app/
├── .gitignore
├── README.md
├── docker-compose.yml
├── docs/
│   └── arquitectura.md
├── backend/
│   ├── Dockerfile             # Para construir la imagen del Backend (Node.js)
│   ├── package.json           # Dependencias de Node.js
│   ├── .dockerignore          # Archivos a ignorar en la build de Docker
│   └── src/
│       └── index.js           # Punto de entrada de la API
└── frontend/
    ├── Dockerfile             # Para construir la imagen del Frontend (Nginx)
    ├── index.html             # Interfaz de usuario principal
    ├── styles.css             # Estilos de la aplicación
    └── nginx.conf             # Configuración personalizada de Nginx

## API Endpoints 
La API REST del Backend (ejecutándose en el puerto interno 3000) expone los siguientes endpoints para la gestión de tareas:
•	GET /api/tasks: Obtiene la lista completa de tareas. (No requiere cuerpo de petición).
•	POST /api/tasks: Crea una nueva tarea.
o	Cuerpo de Petición (Body): { "description": "Tarea a realizar" }
•	PUT /api/tasks/:id: Actualiza el estado de una tarea. Se usa para marcarla como completada.
o	Cuerpo de Petición (Body): { "completed": true }
•	DELETE /api/tasks/:id: Elimina una tarea específica por su id. (No requiere cuerpo de petición).
## Autores
Estudiante 1: Manuel de Jesús Cerén Alvarez
Estudiante 2: Estefany Michelle Peñate Solís 
## Fecha 
15/10/2025
