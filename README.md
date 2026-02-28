
# Plataforma de Inglés

Plataforma sencilla para el aprendizaje de inglés con un `backend` (Express + SQLite) y un `frontend` (React) separados.

**Estructura del proyecto**

- **backend/**: servidor Express, base de datos SQLite, rutas de la API.
- **frontend/**: aplicación React (Create React App / `react-scripts`).

**Requisitos**

- Node.js (recomendado 16+)
- npm

**Backend**

- Puerto: `3001`
- Imágenes estáticas servidas en: `/images`

Inicio rápido (backend):

```bash
cd backend
npm install
# inicializar la BD SQLite (crea db.sqlite y las tablas)
node initDB.js
# ejecutar el servidor
node server.js
```

Notas:
- Si prefieres usar `nodemon`, instálalo globalmente y ejecuta `nodemon server.js`.

Resumen de la API (rutas montadas en `server.js`):

- `GET /book-words` — palabras del libro (rutas en `backend/routes/bookWords.js`)
- `GET /spelling-words` — lista de palabras para deletrear (rutas en `backend/routes/spellingWords.js`)
- `GET /students` — obtener la lista de estudiantes; `POST /students` — agregar un estudiante (ver `backend/routes/students.js`)
- `GET/POST /verbs` — operaciones con verbos (`backend/routes/verbs.js`)
- `GET/POST /adjectives` — operaciones con adjetivos (`backend/routes/adjectives.js`)
- `GET/POST /nouns` — operaciones con sustantivos (`backend/routes/nouns.js`)
- `POST /game-manager` y endpoints relacionados en `backend/routes/gameManager.js`

(Cada archivo de ruta implementa los endpoints CRUD y las consultas a la base de datos correspondientes.)

**Frontend**

Inicio rápido (frontend):

```bash
cd frontend
npm install
npm start
```

- El frontend se ejecuta por defecto en `http://localhost:3000` y espera que el backend esté en `http://localhost:3001`.
- Las llamadas a la API se realizan desde `src/services/api.js`.

**Base de datos**

- Archivo de la base de datos SQLite: `backend/db.sqlite` (creado por `initDB.js`).
- La creación del esquema está en `backend/initDB.js`.

**Imágenes y recursos**

- Las imágenes se almacenan en `backend/images/` y se sirven desde `/images`.

**Notas de desarrollo**

- Las dependencias del backend están en `backend/package.json` (Express, sqlite3, multer, cors).
- El frontend es una app CRA estándar; usa los scripts en `frontend/package.json` para compilar o ejecutar tests.

**Solución de problemas**

- Si el backend no arranca, comprueba que el puerto `3001` esté libre y que `node` esté disponible.
- Para problemas con la BD, elimina `backend/db.sqlite` y ejecuta `node initDB.js` para recrearla.

**Licencia y atribución**

Este repositorio es un proyecto educativo para vocabulario y juegos en el aula.



