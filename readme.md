# 🚀 API Pokemon - REST API con Node.js y MongoDB

API REST desarrollada con Node.js y Express que permite gestionar una base de datos de Pokémon. Incluye autenticación JWT, middleware personalizado y está completamente dockerizada con MongoDB.

## 📋 Características

- ✅ API REST completa con los 4 verbos principales (GET, POST, PUT, DELETE)
- ✅ Autenticación JWT con middleware personalizado
- ✅ Base de datos MongoDB dockerizada
- ✅ Seed automático con 150 Pokémon y usuarios predefinidos
- ✅ Arquitectura limpia y escalable
- ✅ Docker Compose para fácil despliegue

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas (layered architecture) con separación clara de responsabilidades:

```
.
├── api/
│   ├── scripts/
│   │   └── seed.js              # Script para poblar la BD con datos iniciales
│   ├── src/
│   │   ├── config/              # Configuraciones de la aplicación
│   │   │   ├── auth.js          # Configuración de autenticación JWT
│   │   │   └── db.js            # Configuración de base de datos MongoDB
│   │   ├── controllers/         # Controladores - manejo de requests HTTP
│   │   │   ├── auth.controller.js
│   │   │   └── pokemon.controller.js
│   │   ├── middlewares/         # Middlewares personalizados
│   │   │   └── auth.middleware.js
│   │   ├── models/              # Modelos de datos (Mongoose schemas)
│   │   │   ├── pokemon.model.js
│   │   │   └── user.model.js
│   │   ├── repositories/        # Capa de acceso a datos
│   │   │   └── pokemon.repository.js
│   │   ├── routes/              # Definición de rutas
│   │   │   ├── auth.routes.js
│   │   │   └── pokemon.routes.js
│   │   ├── services/            # Lógica de negocio
│   │   │   ├── auth.service.js
│   │   │   └── pokemon.service.js
│   │   ├── app.js               # Configuración de Express
│   │   └── server.js            # Punto de entrada de la aplicación
│   ├── .env                     # Variables de entorno
│   ├── Dockerfile               # Imagen Docker de la API
│   └── package.json             # Dependencias del proyecto
├── .gitignore
└── docker-compose.yml           # Orquestación de contenedores
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación y autorización
- **bcryptjs** - Encriptación de contraseñas
- **Docker & Docker Compose** - Contenedorización
- **Nodemon** - Desarrollo en tiempo real

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Docker
- Docker Compose

### 1. Clonar el repositorio

```bash
git clone https://github.com/caxrxloxs/api-pokemon.git
cd api-pokemon
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la carpeta `api/`:

```env
PORT=3000
MONGODB_URI=mongodb://admin:admin@mongo:27017/pokemon-api?authSource=admin
JWT_SECRET=tu_jwt_secret_aqui
NODE_ENV=development
```

### 3. Levantar los contenedores

```bash
docker compose up --build
```

### 4. Poblar la base de datos (seed)

```bash
docker exec -it api-pokemon npm run seed
```

### 5. Verificar que funcione

La API estará disponible en: `http://localhost:3000`

## 📡 Endpoints

### Autenticación

#### POST `/api/auth/register`

Registrar nuevo usuario

```json
{
  "username": "nuevo_usuario",
  "password": "contraseña123"
}
```

#### POST `/api/auth/login`

Iniciar sesión y obtener token JWT

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin"
  }
}
```

### Pokémon (Endpoints públicos)

#### GET `/api/pokemons`

Obtener todos los Pokémon

```bash
curl http://localhost:3000/api/pokemons
```

#### GET `/api/pokemons/:id`

Obtener Pokémon por ID

```bash
curl http://localhost:3000/api/pokemons/1
```

### Pokémon (Endpoints protegidos - Requieren JWT)

Para los siguientes endpoints, incluir el header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### POST `/api/pokemons`

Crear nuevo Pokémon

```json
{
  "code": "1234",
  "name": "Pikachu",
  "types": ["electric"],
  "attacks":["Impactrueno"],
  "height": 4,
  "weight": 60
}
```

#### PUT `/api/pokemons/:id`

Actualizar Pokémon existente

```json
{
  "code": "1234",
  "name": "Pikachu Updated",
  "types": ["electric"],
  "attacks":["Impactrueno","Onda Trueno"],
  "height": 5,
  "weight": 65
}
```

#### DELETE `/api/pokemons/:id`

Eliminar Pokémon

```bash
curl -X DELETE http://localhost:3000/api/pokemons/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👥 Usuarios Predefinidos

El seed carga automáticamente estos usuarios:

| Username | Password | Rol   |
| -------- | -------- | ----- |
| admin    | admin123 | admin |
| user     | user123  | user  |

## 🐳 Docker

### Servicios definidos en docker-compose.yml:

#### MongoDB

- **Puerto:** 27018:27017
- **Credenciales:** admin/admin
- **Base de datos:** pokemon-api

#### API Node.js

- **Puerto:** 3000:3000
- **Dependencias:** MongoDB
- **Hot reload:** Habilitado con nodemon

### Comandos útiles:

```bash
# Levantar servicios
docker compose up --build

# Ver logs
docker-compose logs -f api

# Detener servicios
docker-compose down

```

## 🔒 Autenticación y Middleware

La API implementa autenticación JWT con middleware personalizado:

1. **Registro/Login:** Genera token JWT válido por 2h -  configurable en src/config/auth.js
2. **Middleware de autenticación:** Valida token en rutas protegidas
3. **Rutas protegidas:** POST, PUT, DELETE de Pokémon requieren autenticación

### Ejemplo de uso completo:

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. Usar token para crear Pokémon
curl -X POST http://localhost:3000/api/pokemons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Custom Pokémon",
    "type": ["fire"],
    "height": 10,
    "weight": 100
  }'
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT -

**Desarrollado como proyecto académico**
